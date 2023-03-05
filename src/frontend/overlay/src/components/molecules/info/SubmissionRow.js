import { CircleCell } from "../../atoms/CircleCellsProblem";
import React from "react";
import { DateTime } from "luxon";
import { TimeCell } from "../../organisms/holder/TeamViewHolder";
import { useSelector } from "react-redux";
import { SCOREBOARD_TYPES } from "../../../consts";
import { ContesterRow2 } from "../../atoms/ContesterRow2";
import { TaskResultLabel2 } from "../../atoms/ContestLabels2";
import { CELL_INFO_VERDICT_WIDTH } from "../../../config";


export const SubmissionRow = ({ result, lastSubmitTimeMs, minScore, maxScore, backgroundColor, taskName }) => {
    return <ContesterRow2>
        <TimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</TimeCell>
        <CircleCell content={taskName} backgroundColor={backgroundColor}/>
        <TaskResultLabel2 problemResult={result} minScore={minScore} maxScore={maxScore} width={CELL_INFO_VERDICT_WIDTH} align={"center"}/>
    </ContesterRow2>;
};

export default SubmissionRow;
