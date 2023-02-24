import React from "react";
import { TIMELINE_HEIGHT, TIMELINE_WIDTH } from "../../../config";
import styled from "styled-components";
import { Run } from "../../molecules/timeline/Run";

const Background = styled.div`
  background-color: gray;
  
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
            <Run task="sdf" time="42px" lastSubmitTimeMs={16422443}/>
            <Run task="sdf" time="42px" lastSubmitTimeMs={12422443}/>
            <Run task="sdf" time="42px" lastSubmitTimeMs={15422443}/>
            <Run task="sdf" time="42px" lastSubmitTimeMs={6422443}/>
            <Run task="sdf" time="42px" lastSubmitTimeMs={9422443}/>
            <Run task="sdf" time="42px" lastSubmitTimeMs={2422443}/>
        </Background>
    );
};
