import CircleCellProblem from "../../atoms/CircleCellsProblem";
import React from "react";
import {DateTime} from "luxon";
import {ScoreboardTimeCell} from "../../organisms/holder/TeamViewHolder";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SCOREBOARD_TYPES } from "../../../consts";
import { getStatusCell } from "../../atoms/ContestCells";

export const SubmissionRowWrap = styled.div`
  
`;



export const SubmissionRow = ({ probData, status, lastSubmitTimeMs, score, minScore, maxScore }) => {
    let scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal]?.ids[teamId]);
    let component = getStatusCell(scoreboardData?.problemResults[0], score, minScore, maxScore);
    return <SubmissionRowWrap>
        <ScoreboardTimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</ScoreboardTimeCell>
        <CircleCellProblem probData={probData} status={status}/>
        {component}
    </SubmissionRowWrap>;
};

export default SubmissionRow;