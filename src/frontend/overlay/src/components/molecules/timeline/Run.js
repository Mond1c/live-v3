import React from "react";
import styled from "styled-components";
import CircleCellProblem from "../../atoms/CircleCellsProblem";
import { ScoreboardTaskCell, ScoreboardTimeCell, TimeCell } from "../../organisms/holder/TeamViewHolder";
import { DateTime } from "luxon";

const RunWrap = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 5%;
  left: ${props => props.percent};
`;

export const Run = ({ probData, status, lastSubmitTimeMs, resultAttempts }) => {
    let percent = (100 * lastSubmitTimeMs / 18000000) + "%";
    return (
        <RunWrap percent={percent}>
            <ScoreboardTaskCell status={status}
                attempts={resultAttempts}/>
            <CircleCellProblem probData={probData} status={status} radius={"34px"}/>
            <TimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</TimeCell>
        </RunWrap>
    );
};
