import SETUP from './actions/SETUP';
import END_TURN from './actions/END_TURN';
import END_GAME from './actions/END_GAME';
import PICK_UP_TILES from './actions/PICK_UP_TILES';
import SELECT_PATTERN_LINE from './actions/SELECT_PATTERN_LINE';
import SCORE_FINISHED_LINES from './actions/SCORE_FINISHED_LINES';
import SCORE_BONUSES from './actions/SCORE_BONUSES';

export default {
    END_TURN,
    PICK_UP_TILES,
    SELECT_PATTERN_LINE,
    SCORE_FINISHED_LINES,
    END_GAME,
    SCORE_BONUSES,
    SETUP,
    0: END_TURN,
    1: PICK_UP_TILES,
    2: SELECT_PATTERN_LINE,
    3: SCORE_FINISHED_LINES,
    4: END_GAME,
    5: SCORE_BONUSES,
    6: SETUP,
};
