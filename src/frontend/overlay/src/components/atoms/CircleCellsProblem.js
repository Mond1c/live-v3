import React from "react";
import styled from "styled-components";
import { CIRCLE_CELL_FONT_SIZE, CIRCLE_PROBLEM_LINE_WIDTH, CIRCLE_PROBLEM_SIZE } from "icpc-live-v3/src/config";
import { Box2, FlexedBox2 } from "./Box2";
import { TeamTaskColor, TeamTaskStatus } from "../../utils/statusInfo";
import { StarIcon2 } from "./Star2";


const CircleCellProblemWrap = styled(FlexedBox2)`
    position: relative;
    width: ${props => props.radius ?? CIRCLE_PROBLEM_SIZE};
    height: ${props => props.radius ?? CIRCLE_PROBLEM_SIZE};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-radius: 50%;
    font-size: ${CIRCLE_CELL_FONT_SIZE};
    border: ${props => props.borderColor ? `${props.borderColor} ${CIRCLE_PROBLEM_LINE_WIDTH} solid` : 0};
    background: ${props => props.backgroundColor};
`;
export const CircleCell = ({ content, borderColor, backgroundColor, radius }) => {
    return <CircleCellProblemWrap borderColor={borderColor} backgroundColor={backgroundColor} radius={radius}>
        {content}
    </CircleCellProblemWrap>;
};

export const CircleCellProblem = ({ status, probData, radius }) => {
    return <CircleCell content={<div>{status === TeamTaskStatus.first && <StarIcon2/>} {probData?.letter ?? "??"}</div>} borderColor={probData?.color ?? "black"} backgroundColor={TeamTaskColor[status]} radius={radius}/>;
};


export default CircleCellProblem;
