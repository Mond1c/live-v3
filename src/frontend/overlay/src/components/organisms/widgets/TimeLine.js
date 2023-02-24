import React from "react";
import { TIMELINE_HEIGHT, TIMELINE_WIDTH } from "../../../config";
import styled from "styled-components";
import { Run } from "../../molecules/timeline/Run";

const Background = styled.div`
  background-color: black;
  
  width: ${TIMELINE_WIDTH};
  height: ${TIMELINE_HEIGHT};
  
  border-radius: 29px;
  
  position: relative;
`;

const Line = styled.div`
  background-color: white;
  
  width: ${TIMELINE_WIDTH};
  height: 2%;
  
  border-radius: 5px;
  
  position: absolute;
  top: 49%;
`;


export const TimeLine = () => {
    return (
        <Background>
            <Line />
            <Run task="sdf" time="42px"/>
        </Background>
    );
};
