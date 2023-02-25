import React from "react";
import styled from "styled-components";
import CircleCellProblem from "../../atoms/CircleCellsProblem";
import {
    ScoreboardTaskCell,
    ScoreboardTaskCell2,
    ScoreboardTimeCell,
    TimeCell
} from "../../organisms/holder/TeamViewHolder";
import { DateTime } from "luxon";
import { TIMELINE_CIRCLE_RADIUS, TIMELINE_WIDTH } from "../../../config";

const RunWrap = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 3%;
  left: ${props => props.percent};
`;

export const Run = ({ probData, status, lastSubmitTimeMs, resultAttempts }) => {
    let leftMargin = (100 * lastSubmitTimeMs / 18000000) * 0.96 + "%";
    return (
        <RunWrap percent={leftMargin}>
            <ScoreboardTaskCell2 status={status}
                attempts={resultAttempts}/>
            <CircleCellProblem probData={probData} status={status} radius={TIMELINE_CIRCLE_RADIUS}/>
            <TimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</TimeCell>
        </RunWrap>
    );
};
