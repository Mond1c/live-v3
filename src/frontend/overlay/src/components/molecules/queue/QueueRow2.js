import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
    CELL_BG_COLOR,
    CELL_BG_COLOR_ODD,
    CELL_QUEUE_RANK_WIDTH,
    CELL_QUEUE_TASK_WIDTH,
    CELL_QUEUE_TOTAL_SCORE_WIDTH,
    CELL_QUEUE_VERDICT_WIDTH,
    QUEUE_OPACITY,
    QUEUE_ROW_HEIGHT
} from "../../../config";
import { SCOREBOARD_TYPES } from "../../../consts";
import {
    ProblemCell,
    ProblemCell2,
    RankCell2,
    TextShrinkingCell,
    VerdictCell,
    VerdictCell2
} from "../../atoms/ContestCells";
import { formatScore } from "../../atoms/ContestCells";

const QueueRowWrap = styled.div`
  background-color: ${(props) => props.background ?? ((props.isEven && CELL_BG_COLOR_ODD) || CELL_BG_COLOR)};

  border-radius: 16px;

  height: ${QUEUE_ROW_HEIGHT}px;
  display: flex;
  flex-wrap: nowrap;
  max-width: 100%;
  opacity: ${QUEUE_OPACITY};
`;

export const QueueRow2 = ({ entryData, isEven, flash }) => {
    const scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal].ids[entryData.teamId]);
    const teamData = useSelector((state) => state.contestInfo.info?.teamsId[entryData.teamId]);
    const probData = useSelector((state) => state.contestInfo.info?.problemsId[entryData.problemId]);

    return <QueueRowWrap isEven={isEven} >
        <RankCell2 width={CELL_QUEUE_RANK_WIDTH} isEven={isEven} rank={scoreboardData?.rank}
            medal={scoreboardData?.medalType} flash={flash}/>
        <TextShrinkingCell text={teamData?.shortName ?? "??"} isEven={isEven} flash={flash}/>
        <TextShrinkingCell width={CELL_QUEUE_TOTAL_SCORE_WIDTH} isEven={isEven} flash={flash}
            canShrink={false}
            canGrow={false}
            text={scoreboardData === null ? "??" : formatScore(scoreboardData?.totalScore ?? 0.0, 1)}/>
        <VerdictCell2 runData={entryData} width={CELL_QUEUE_VERDICT_WIDTH} isEven={isEven} flash={flash} />
        <ProblemCell2 probData={probData} width={CELL_QUEUE_TASK_WIDTH} isEven={isEven} flash={flash}/>
    </QueueRowWrap>;
};

QueueRow2.propTypes = {
    entryData: PropTypes.object.isRequired,
    isEven: PropTypes.bool.isRequired
};

