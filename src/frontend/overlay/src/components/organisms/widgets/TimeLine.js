import React from "react";
import { TIMELINE_HEIGHT, TIMELINE_WIDTH } from "../../../config";
import styled from "styled-components";

const Background = styled.div`
  background-color: black;
  
  width: ${TIMELINE_WIDTH};
  height: ${TIMELINE_HEIGHT};
  
  border-radius: 29px;
`;

const Line = styled.div`
  background-color: white;
  
  width: ${TIMELINE_WIDTH};
  
  border-radius: 5px;
`;



export const TimeLine = () => {
    return (
        <Background>
        </Background>
    );
};
