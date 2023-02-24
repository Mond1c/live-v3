import React from "react";
import { TIMELINE_CIRCLE_RADIUS } from "../../../config";
import styled from "styled-components";
import CircleCellProblem from "../../atoms/CircleCellsProblem";
import { ScoreboardTimeCell, TimeCell } from "../../organisms/holder/TeamViewHolder";
import { DateTime } from "luxon";

const RunWrap = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  
  position: absolute;  
  top: 35%;
  left: ${props => props.percent};
  
`;

export const Run = ({ probData, status, lastSubmitTimeMs }) => {
    let percent = (100 * lastSubmitTimeMs / 18000000) + "%";
    console.log(percent);
    return (
        <RunWrap percent={percent}>
            <CircleCellProblem probData={probData} status={status} radius={"34px"}/>
            <TimeCell>{DateTime.fromMillis(lastSubmitTimeMs).toFormat("H:mm")}</TimeCell>
        </RunWrap>
    );
};
