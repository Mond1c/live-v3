import { useSelector } from "react-redux";
import { SCOREBOARD_TYPES } from "../../../consts";
import { ContesterInfo2 } from "./ContesterInfo2";
import _ from "lodash";
import SubmissionRow from "./SubmissionRow";
import React from "react";
import styled from "styled-components";
import { TEAMVIEW_SMALL_FACTOR } from "../../../config";

const ScoreboardColumnWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-auto-rows: 1fr;
  position: absolute;
  transform-origin: top right;
  transform: ${props => props.isSmall ? `scale(${TEAMVIEW_SMALL_FACTOR})` : ""};
  white-space: nowrap;
`;
const ScoreboardTeamInfoRow = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
`;
const TaskRow = styled.div`
  display: flex;
  width: 100%;
  grid-column-start: 2;
  grid-column-end: 3;
`;

export const ContesterCorner2 = ({ teamId, isSmall }) => {
    let scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal]?.ids[teamId]);
    for (let i = 0; i < scoreboardData?.problemResults.length; i++) {
        scoreboardData.problemResults[i]["index"] = i;
    }
    const tasks = useSelector(state => state.contestInfo?.info?.problems);
    const contestData = useSelector((state) => state.contestInfo.info);

    //return <TimeLine scoreboardData={scoreboardData}/>;

    return <ScoreboardColumnWrapper isSmall={isSmall}>
        <ScoreboardTeamInfoRow>
            <ContesterInfo2 teamId={teamId}/>
        </ScoreboardTeamInfoRow>
        {_.sortBy(scoreboardData?.problemResults, "lastSubmitTimeMs").flatMap((result, i) =>
            (result.lastSubmitTimeMs === undefined) ? null :
                <TaskRow key={i}>
                    <SubmissionRow result={result} probData={tasks[result?.index]}
                        backgroundColor={tasks[result?.index]?.color ?? "black"}
                        lastSubmitTimeMs={result?.lastSubmitTimeMs} taskName={tasks[result?.index]?.letter}
                        minScore={contestData?.problems[result.index]?.minScore}
                        maxScore={contestData?.problems[result.index]?.maxScore}/>
                </TaskRow>
        )}
    </ScoreboardColumnWrapper>;

};
