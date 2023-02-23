import React from "react";
import styled from "styled-components";
import { CIRCLE_PROBLEM_LINE_WIDTH, CIRCLE_PROBLEM_SIZE } from "icpc-live-v3/src/config";
import { Cell2 } from "./Cell2";


const CircleCellProblemWrap = styled(Cell2)`
    position: relative;
    width: ${CIRCLE_PROBLEM_SIZE};
    height: ${CIRCLE_PROBLEM_SIZE};
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-radius: 50%;
    font-size: 14px;
    border: ${props => props.borderColor} ${CIRCLE_PROBLEM_LINE_WIDTH} solid;
    background: ${props => props.backgroundColor};
`;
export const CircleCellProblem = ({ content, borderColor, backgroundColor }) => {
    return <CircleCellProblemWrap borderColor={borderColor} backgroundColor={backgroundColor}>
        {content}
    </CircleCellProblemWrap>;
};

export default CircleCellProblem;
