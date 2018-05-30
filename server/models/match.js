import _ from 'lodash';
import mongoose from '../mongoose';
import gameConstants from '../../shared/constants/games';
import randomizer from '../helpers/randomizer';

const MatchSchema = new mongoose.Schema({
    status: {
        type: Number,
        required: true,
        default: gameConstants.GAME_STATUS_SETTING_UP,
        enum: Object.values(gameConstants),
    },
    handle: {
        type: String,
        required: true,
        enum: ['azul', 'five-tribes'],
    },
    initialState: {
        type: Object,
        required: true,
        default: {},
    },
    actions: {
        type: Object,
        required: true,
        default: [],
    },
    players: [mongoose.Schema.Types.ObjectId],
    scores: {
        type: Object,
        required: true,
        default: [],
    },
    randomSeed: {
        type: Number,
        required: true,
        default: () => Math.random(),
    },
}, {
    minimize: false,
    timestamps: true,
});

MatchSchema.methods.toJSON = function () {
    return {
        ..._.omit(this.toObject(), ['_id', '__v', 'randomSeed']),
        id: this.id,
    };
};

MatchSchema.methods.generateStates = function (actions) {
    return this.actions.reduce((result, [actionId, payload], index) => {
        const action = actions.findById(actionId);

        if (action.isEndGameAction) {
            return result;
        }

        return [
            ...result,
            {
                ...action.perform(
                    result[index],
                    payload,
                    this.players,
                    randomizer(this.randomSeed)
                ),
                action: [actionId, payload, result[index].currentPlayer],
            },
        ];
    }, [this.initialState]);
};

export const Match = mongoose.model('Match', MatchSchema);
