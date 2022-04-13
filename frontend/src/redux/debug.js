import _ from "lodash";
import { DateTime } from "luxon";
import { LOG_LINES } from "../config";

const ActionTypes = {
    PUSH_LOG: "PUSH_LOG",
    CLEAR_LOG: "CLEAR_LOG"
};

const initialState = {
    log: []
};

export const pushLog = (text) => {
    return async dispatch => {
        // dispatch({
        //     type: ActionTypes.PUSH_LOG,
        //     payload: {
        //         text: _.truncate(text, { length: 100 }),
        //         timestamp: DateTime.now().toLocaleString(DateTime.TIME_24_WITH_SECONDS)
        //     }
        // });
    };
};

export const clearLog = () => {
    return async dispatch => {
        dispatch({
            type: ActionTypes.CLEAR_LOG,
        });
    };
};

export function debugReducer(state = initialState, action) {
    switch (action.type) {
    case ActionTypes.PUSH_LOG:
        return {
            ...state,
            log: _.takeRight([
                ...state.log,
                action.payload
            ], LOG_LINES)
        };
    case ActionTypes.CLEAR_LOG:
        return {
            ...state,
            log: []
        };
    default:
        return state;
    }
}
