import React from "react";
import { CONTESTER_ROW_OPACITY, TIMELINE_HEIGHT, TIMELINE_WIDTH } from "../../../config";
import styled from "styled-components";
import { Run } from "../../molecules/timeline/Run";
import _ from "lodash";
import { getStatus, ScoreboardTimeCell } from "../holder/TeamViewHolder";
import { useSelector } from "react-redux";
import { TeamTaskStatus } from "../../../utils/statusInfo";
import { DateTime } from "luxon";

const Background = styled.div`
  background-color: black;
  opacity: ${CONTESTER_ROW_OPACITY};

  width: ${TIMELINE_WIDTH};
  height: ${TIMELINE_HEIGHT};

  border-radius: 29px;

  position: absolute;
  bottom: 0;
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
    const contestInfo = useSelector((state) => state.contestInfo?.info);
    const milliseconds = DateTime.fromMillis(contestInfo?.startTimeUnixMs ?? 0).diffNow().negate().milliseconds *
        (contestInfo?.emulationSpeed ?? 1);
    let procentOfLine = (100 * 0.96 * milliseconds / 18000000) + "%"; // I point on 0.96 because in another case, gradient will be further than circle
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
