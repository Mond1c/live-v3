import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import {
    CELL_QUEUE_RANK_WIDTH,
    CELL_QUEUE_TASK_WIDTH,
    CELL_QUEUE_TOTAL_SCORE_WIDTH,
    CELL_QUEUE_VERDICT_WIDTH,
    QUEUE_PER_COLUMNS_PADDING2,
    QUEUE_VERDICT_PADDING_LEFT2
} from "../../../config";
import { SCOREBOARD_TYPES } from "../../../consts";
import { formatScore } from "../../atoms/ContestCells";
import { RankLabel2, RunStatusLabel2 } from "../../atoms/ContestLabels2";
import { FlexedBox2, ShrinkingBox2 } from "../../atoms/Box2";
import { ContesterRow2 } from "../../atoms/ContesterRow2";
import { CircleCell } from "../../atoms/CircleCellsProblem";


export const QueueRow2 = ({ runInfo, isEven, flash }) => {
    const scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal].ids[runInfo.teamId]);
    const teamData = useSelector((state) => state.contestInfo.info?.teamsId[runInfo.teamId]);
    const probData = useSelector((state) => state.contestInfo.info?.problemsId[runInfo.problemId]);

    return <ContesterRow2 medal={scoreboardData?.medalType} isEven={isEven} flash={flash}>
        <RankLabel2 width={CELL_QUEUE_RANK_WIDTH} rank={scoreboardData?.rank}/>
        <ShrinkingBox2 width={"342px"} text={teamData?.shortName ?? "??"} flexGrow={1} flexShrink={1} Wrapper={FlexedBox2}
            marginLeft={QUEUE_PER_COLUMNS_PADDING2} marginRight={QUEUE_PER_COLUMNS_PADDING2}/>
        <ShrinkingBox2 width={CELL_QUEUE_TOTAL_SCORE_WIDTH} align={"center"} Wrapper={FlexedBox2}
            text={scoreboardData === null ? "??" : formatScore(scoreboardData?.totalScore ?? 0.0, 1)}
            marginRight={QUEUE_PER_COLUMNS_PADDING2}
        />
        <CircleCell content={probData?.letter ?? "??"} backgroundColor={probData?.color ?? "black"} probData={probData} width={CELL_QUEUE_TASK_WIDTH}/>
        <RunStatusLabel2 runInfo={runInfo} width={CELL_QUEUE_VERDICT_WIDTH} marginLeft={QUEUE_VERDICT_PADDING_LEFT2}/>
    </ContesterRow2>;
};

QueueRow2.propTypes = {
    runInfo: PropTypes.object.isRequired,
    isEven: PropTypes.bool.isRequired
};

