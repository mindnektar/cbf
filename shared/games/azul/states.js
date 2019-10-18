import END_GAME from './states/END_GAME';
import END_TURN from './states/END_TURN';
import PICK_UP_TILES from './states/PICK_UP_TILES';
import SCORE_BONUSES from './states/SCORE_BONUSES';
import SCORE_FINISHED_LINES from './states/SCORE_FINISHED_LINES';
import SELECT_PATTERN_LINE from './states/SELECT_PATTERN_LINE';

export default {
    PICK_UP_TILES,
    END_TURN,
    SELECT_PATTERN_LINE,
    SCORE_FINISHED_LINES,
    END_GAME,
    SCORE_BONUSES,
    0: PICK_UP_TILES,
    1: END_TURN,
    2: SELECT_PATTERN_LINE,
    3: SCORE_FINISHED_LINES,
    4: END_GAME,
    5: SCORE_BONUSES,
};
