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
import { TaskResultLabel2 } from "../../atoms/ContestLabels2";

const RunWrap = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 5%;
  left: ${props => props.percent};
`;

export const Run = ({ result, probData, backgroundColor, lastSubmitTimeMs, minScore, maxScore, ...props }) => {
    let leftMargin = (100 * lastSubmitTimeMs / 18000000) * 0.96 + "%";
    return (
        <RunWrap percent={leftMargin}>
            <TaskResultLabel2 problemResult={result} minScore={minScore} maxScore={maxScore} {...props}/>
            <CircleCellProblem backgroundColor={backgroundColor} probData={probData} status={result.status} radius={TIMELINE_CIRCLE_RADIUS}/>
            <TimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</TimeCell>
        </RunWrap>
    );
};
