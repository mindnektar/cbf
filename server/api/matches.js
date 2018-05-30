import { Router } from 'express';
import _ from 'lodash';
import gameConstants from '../../shared/constants/games';
import authenticate from '../middleware/authenticate';
import randomizer from '../helpers/randomizer';
import { Match } from '../models/match';

const router = new Router();

router.get('/matches', (request, response, next) => {
    Match.find()
        .then(matches => response.send(matches))
        .catch(next);
});

router.post('/matches', authenticate, (request, response, next) => {
    const body = _.pick(request.body, ['handle']);
    const match = new Match({
        ...body,
        players: [request.user._id],
    });

    match.save()
        .then(() => response.send(match))
        .catch(next);
});

router.get('/matches/:id', (request, response, next) => {
    Match.findById(request.params.id)
        .then(match => response.send({
            ...match,
            gameStates: match.generateStates(require(`../../shared/games/${match.handle}/actions`)),
        }))
        .catch(next);
});

router.patch('/matches/:id', authenticate, (request, response, next) => {
    const body = _.pick(request.body, ['status']);

    Match.findById(request.params.id)
        .then((match) => {
            if (body.status === gameConstants.GAME_STATUS_ACTIVE) {
                const setup = require(`../../shared/games/${match.handle}/setup`);

                body.initialState = setup(match.players, randomizer(match.randomSeed));
            }

            return match.set(body).save()
                .then(() => response.send(match));
        })
        .catch(next);
});

router.post('/matches/:id/players', authenticate, (request, response, next) => {
    Match.findById(request.params.id)
        .then((match) => {
            if (match.status !== gameConstants.GAME_STATUS_OPEN) {
                return Promise.reject(new Error('Match is not open for joining'));
            }

            return match.set({ players: [...match.players, request.user._id] }).save()
                .then(() => response.send(match));
        })
        .catch(next);
});

router.post('/matches/:id/actions', authenticate, (request, response, next) => {
    Match.findById(request.params.id)
        .then((match) => {
            if (match.status !== gameConstants.GAME_STATUS_ACTIVE) {
                throw new Error('Match is not active');
            }

            const actions = require(`../../shared/games/${match.handle}/actions`);
            const states = require(`../../shared/games/${match.handle}/states`);
            let currentState = match.generateStates(actions).pop();
            const { currentPlayer } = currentState;
            const newActions = request.body;
            let { status, scores } = match;

            if (!request.user._id.equals(currentPlayer)) {
                return response.sendStatus(403);
            }

            newActions.forEach(([actionId, payload = []]) => {
                const action = actions.findById(actionId);

                if (!action.isValid(currentState, payload)) {
                    throw new Error(`Invalid action: ${action}`);
                }

                currentState = {
                    ...action.perform(currentState, payload, match.players, match.randomSeed),
                    action: [action.id, payload, currentPlayer],
                };
            });

            while (states.findById(currentState.state).performAutomatically) {
                const action = states.findById(currentState.state).performAutomatically();

                if (!action.isValid(currentState)) {
                    throw new Error(`Invalid action: ${action}`);
                }

                newActions.push([action.id, []]);

                if (action.isEndGameAction) {
                    status = gameConstants.GAME_STATUS_FINISHED;
                    scores = action.getScores(currentState, match.players);
                    break;
                }

                currentState = {
                    ...action.perform(
                        currentState,
                        [],
                        match.players,
                        randomizer(match.randomSeed)
                    ),
                    action: [action.id, [], currentState.currentPlayer],
                };
            }

            return match
                .set({
                    actions: [...match.actions, ...newActions],
                    status,
                    scores,
                })
                .save()
                .then(() => response.send(match));
        })
        .catch(next);
});

export default router;
