import _ from 'lodash';
import mongoose from '../mongoose';
import gameConstants from '../../shared/constants/games';

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
    initialState: Object,
    actions: [Object],
    players: [mongoose.Schema.Types.ObjectId],
}, {
    minimize: false,
    timestamps: true,
});

MatchSchema.methods.toJSON = function () {
    return {
        ..._.omit(this.toObject(), ['_id', '__v']),
        id: this.id,
    };
};

MatchSchema.methods.generateStates = function (actions) {
    return this.actions.reduce((result, [actionId, payload], index) => [
        ...result,
        {
            ...actions.findById(actionId).perform(result[index - 1], payload),
            action: [actionId, payload, result[index - 1].currentPlayer],
        },
    ], [this.initialState]);
};

export const Match = mongoose.model('Match', MatchSchema);
