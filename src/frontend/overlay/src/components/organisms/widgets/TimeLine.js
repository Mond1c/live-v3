import React from "react";
import { TIMELINE_HEIGHT, TIMELINE_WIDTH } from "../../../config";
import styled from "styled-components";
import { Run } from "../../molecules/timeline/Run";
import _ from "lodash";
import { getStatus, ScoreboardTimeCell } from "../holder/TeamViewHolder";
import { useSelector } from "react-redux";
import { TeamTaskStatus } from "../../../utils/statusInfo";

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


// scoreboardData you may get from TeamViewHolder.js 152 str
export const TimeLine = ({ scoreboardData }) => {
    const tasks = useSelector(state => state.contestInfo?.info?.problems);

    return (
        <Background>
            <Line/>
            {_.sortBy(scoreboardData?.problemResults, "lastSubmitTimeMs").flatMap(({
                wrongAttempts,
                pendingAttempts,
                isSolved,
                isFirstToSolve,
                lastSubmitTimeMs,
                index }, i) =>
                getStatus(isFirstToSolve, isSolved, pendingAttempts, wrongAttempts) === TeamTaskStatus.untouched ? null :
                    <Run probData={tasks[index]}
                        status={getStatus(isFirstToSolve, isSolved, pendingAttempts, wrongAttempts)}
                        lastSubmitTimeMs={lastSubmitTimeMs}
                        resultAttempts={wrongAttempts + pendingAttempts}/>
            )}
        </Background>
    );
};
