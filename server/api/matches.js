import { Router } from 'express';
import _ from 'lodash';
import gameConstants from '../../shared/constants/games';
import authenticate from '../middleware/authenticate';
import { Match } from '../models/match';

const router = new Router();

router.get('/matches', (request, response) => {
    Match.find()
        .then(matches => response.send(matches))
        .catch(error => response.status(400).send(error));
});

router.post('/matches', authenticate, (request, response) => {
    const body = _.pick(request.body, ['handle']);
    const match = new Match({
        ...body,
        players: [request.user._id],
    });

    match.save()
        .then(() => response.send(match))
        .catch(error => response.status(400).send(error));
});

router.get('/matches/:id', (request, response) => {
    Match.findById(request.params.id)
        .then(match => response.send({
            ...match,
            gameStates: match.generateStates(require(`../../shared/games/${match.handle}/actions`)),
        }))
        .catch(error => response.status(400).send(error));
});

router.patch('/matches/:id', authenticate, (request, response) => {
    const body = _.pick(request.body, ['status']);

    Match.findById(request.params.id)
        .then((match) => {
            if (body.status === gameConstants.GAME_STATUS_ACTIVE) {
                body.initialState = require(`../../shared/games/${match.handle}/setup`)(match.players);
            }

            return match.set(body).save()
                .then(() => response.send(match));
        })
        .catch(error => response.status(400).send(error));
});

router.post('/matches/:id/players', authenticate, (request, response) => {
    Match.findById(request.params.id)
        .then((match) => {
            if (match.status !== gameConstants.GAME_STATUS_OPEN) {
                return Promise.reject(new Error('Match is not open for joining'));
            }

            return match.set({ players: [...match.players, request.user._id] }).save()
                .then(() => response.send(match));
        })
        .catch(error => response.status(400).send(error));
});

router.post('/matches/:id/actions', authenticate, (request, response) => {
    Match.findById(request.params.id)
        .then((match) => {
            if (match.status !== gameConstants.GAME_STATUS_ACTIVE) {
                throw new Error('Match is not active');
            }

            const actions = require(`../../shared/games/${match.handle}/actions`);
            const states = match.generateStates(actions);
            let currentState = states[states.length - 1];
            const { currentPlayer } = currentState;

            if (!request.user._id.equals(currentPlayer)) {
                return response.sendStatus(403);
            }

            request.body.forEach(([actionId, payload = []]) => {
                const action = actions.findById(actionId);

                if (!action.isValid(currentState, payload)) {
                    throw new Error(`Invalid action: ${action}`);
                }

                currentState = {
                    ...action.perform(currentState, payload),
                    action: [action, payload, currentPlayer],
                };
            });

            return match.set({ actions: [...match.actions, ...request.body] }).save()
                .then(() => response.send(match));
        })
        .catch(error => response.status(400).send(error));
});

export default router;
