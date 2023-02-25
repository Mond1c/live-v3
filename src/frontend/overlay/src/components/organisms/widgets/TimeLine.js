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
  background: linear-gradient(270deg, #D13D23 -28.28%, #FFC239 33.33%, #1A63D8 100%);

   width: ${(props) => props.procentOfLine};
  //width: 50%;
  height: 100%;

  border-radius: 5px;

  position: absolute;
`;

const LineBackground = styled.div`
  background: white;
  
  width: ${TIMELINE_WIDTH};
  height: 2%;

  border-radius: 5px;

  position: relative;
  top: 49%;
`;

// scoreboardData you may get from TeamViewHolder.js 152 str
export const TimeLine = ({ scoreboardData }) => {
    const tasks = useSelector(state => state.contestInfo?.info?.problems);
    const contestData = useSelector((state) => state.contestInfo.info);
    // I know that it's bad, but now We have gradient!
    // It may be do more well
    let array = _.sortBy(scoreboardData?.problemResults, "lastSubmitTimeMs").flatMap(({
        wrongAttempts,
        pendingAttempts,
        isSolved,
        isFirstToSolve,
        lastSubmitTimeMs,
        index }, i) => {
        return lastSubmitTimeMs;
    }
    );
    let lastSubmitTime;
    for (const elem in array) {
        if (array[elem] !== undefined) {
            lastSubmitTime = array[elem];
        }
    }
    let procentOfLine = (100 * 0.96 * lastSubmitTime / 18000000) + "%"; // I point on 0.96 because in another case, gradient will be further than circle
    return (
        <Background>
            <LineBackground>
                <Line procentOfLine={procentOfLine}/>
            </LineBackground>
            {_.sortBy(scoreboardData?.problemResults, "lastSubmitTimeMs").flatMap(({
                wrongAttempts,
                pendingAttempts,
                isSolved,
                isFirstToSolve,
                lastSubmitTimeMs,
                index }, i) => {
                lastSubmitTime = lastSubmitTimeMs;
                return getStatus(isFirstToSolve, isSolved, pendingAttempts, wrongAttempts) === TeamTaskStatus.untouched ? null :
                    <Run probData={tasks[index]}
                        status={getStatus(isFirstToSolve, isSolved, pendingAttempts, wrongAttempts)}
                        lastSubmitTimeMs={lastSubmitTimeMs}
                        resultAttempts={wrongAttempts + pendingAttempts}/>;
            }
            )}
        </Background>
    );
};
