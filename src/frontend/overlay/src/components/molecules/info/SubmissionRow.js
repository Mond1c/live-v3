import { CircleCell } from "../../atoms/CircleCellsProblem";
import React from "react";
import { DateTime } from "luxon";
import { TimeCell } from "../../organisms/holder/TeamViewHolder";
import { useSelector } from "react-redux";
import { SCOREBOARD_TYPES } from "../../../consts";
import { ContesterRow2 } from "../../atoms/ContesterRow2";


export const SubmissionRow = ({ probData, status, lastSubmitTimeMs, score, minScore, maxScore, backgroundColor, taskName }) => {
    console.log("kek",lastSubmitTimeMs, taskName, backgroundColor);
    /*
    let scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal]?.ids[teamId]);
    let component = <StatusCell data={scoreboardData?.problemResults[0]} score={score} minScore={minScore} maxScore={maxScore}/>*/
    return <ContesterRow2>
        <TimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</TimeCell>
        <CircleCell content={taskName} backgroundColor={backgroundColor}/>{/*
        {component}*/}
    </ContesterRow2>;
};

export default SubmissionRow;
