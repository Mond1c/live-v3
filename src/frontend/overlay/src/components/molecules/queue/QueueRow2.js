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
    ProblemCell2, RankCell,
    RankCell2, TextShrinkingCell, VerdictCell,
    VerdictCell2
} from "../../atoms/ContestCells";
import { formatScore } from "../../atoms/ContestCells";
import { TextShrinking } from "../../atoms/Cell2";
import { DataRow } from "../../atoms/DataRow";
import { CircleCell } from "../../atoms/CircleCellsProblem";


export const QueueRow2 = ({ entryData, isEven, flash }) => {
    const scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal].ids[entryData.teamId]);
    const teamData = useSelector((state) => state.contestInfo.info?.teamsId[entryData.teamId]);
    const probData = useSelector((state) => state.contestInfo.info?.problemsId[entryData.problemId]);

    return <DataRow medal={scoreboardData?.medalType} isEven={isEven} flash={flash}>
        <RankCell2 width={CELL_QUEUE_RANK_WIDTH} rank={scoreboardData?.rank}/>
        <TextShrinking text={teamData?.shortName ?? "??"}/>
        <TextShrinking width={CELL_QUEUE_TOTAL_SCORE_WIDTH}
            canShrink={false}
            canGrow={false}
            text={scoreboardData === null ? "??" : formatScore(scoreboardData?.totalScore ?? 0.0, 1)}/>
        <CircleCell content={probData?.letter ?? "??"} backgroundColor={probData?.color ?? "black"} probData={probData} width={CELL_QUEUE_TASK_WIDTH}/>
        <VerdictCell2 runData={entryData} width={CELL_QUEUE_VERDICT_WIDTH}/>
    </DataRow>;
};

QueueRow2.propTypes = {
    entryData: PropTypes.object.isRequired,
    isEven: PropTypes.bool.isRequired
};

