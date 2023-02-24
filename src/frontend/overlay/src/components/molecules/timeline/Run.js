import React from "react";
import { TIMELINE_CIRCLE_RADIUS } from "../../../config";
import styled from "styled-components";


const Circle = styled.div`
  background-color: yellow;
  
  width: ${TIMELINE_CIRCLE_RADIUS};
  height: ${TIMELINE_CIRCLE_RADIUS};
  
  border-radius: ${TIMELINE_CIRCLE_RADIUS};
  
`;

const RunWrap = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  
  position: absolute;  
  top: 15%;
`;

const Time = styled.div`
  font-size: 15px;
  color: white;

  padding-up: ${TIMELINE_CIRCLE_RADIUS};
  margin-up: ${TIMELINE_CIRCLE_RADIUS};
`;

const CharTask = styled.div`
  font-weight: bold;
  color: white;
`;

export const Run = ({ task,  time, ...props }) => {
    return (
        <RunWrap>
            <CharTask>A</CharTask>
            <Circle />
            <Time>03:42</Time>
        </RunWrap>
    );
};
