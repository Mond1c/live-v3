import _ from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
    CELL_QUEUE_RANK_WIDTH,
    CELL_QUEUE_TASK_WIDTH,
    CELL_QUEUE_TOTAL_SCORE_WIDTH,
    QUEUE_PER_COLUMNS_PADDING2, QUEUE_ROW_HEIGHT,
    QUEUE_VERDICT_PADDING_LEFT2,
    SCOREBOARD_HEADER_BG_COLOR,
    SCOREBOARD_HEADER_TITLE_BG_COLOR,
    SCOREBOARD_HEADER_TITLE_BG_GREEN_COLOR,
    SCOREBOARD_HEADER_TITLE_FONT_SIZE,
    SCOREBOARD_NAME_WIDTH,
    SCOREBOARD_NAME_WIDTH2,
    SCOREBOARD_OPACITY,
    SCOREBOARD_RANK_WIDTH,
    SCOREBOARD_RANK_WIDTH2,
    SCOREBOARD_ROW_TRANSITION_TIME,
    SCOREBOARD_SCROLL_INTERVAL,
    SCOREBOARD_SUM_PEN_WIDTH,
} from "../../../config";
import { Cell } from "../../atoms/Cell";
import { formatScore, ProblemCell, RankCell, TextShrinkingCell } from "../../atoms/ContestCells";
import { StarIcon } from "../../atoms/Star";
import { getStatus, getTeamTaskColor, TeamTaskColor, TeamTaskStatus, TeamTaskSymbol } from "../../../utils/statusInfo";
import { extractScoreboardRows, nameTable, useScoller } from "./Scoreboard";
import { ContesterRow2 } from "../../atoms/ContesterRow2";
import { TaskResultLabel2, RankLabel2 } from "../../atoms/ContestLabels2";
import { FlexedBox2, ShrinkingBox2 } from "../../atoms/Box2";
import { CircleCell } from "../../atoms/CircleCellsProblem";


const ScoreboardWrap2 = styled.div`
  height: 100%;
  width: 100%;
  // opacity: ${SCOREBOARD_OPACITY};
  border: none;
  border-collapse: collapse;
  table-layout: fixed;
  display: flex;
  flex-direction: column;
`;


const nameTable2 = {
    normal: "CURRENT",
    optimistic: "OPTIMISTIC",
    pessimistic: "PESSIMISTIC",
};

const ScoreboardRowContainer2 = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  /* box-sizing: border-box; */
`;

const ScoreboardCell2 = styled(Cell)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  position: relative;
`;

const ScoreboardStatCell2 = styled(ScoreboardCell2)`
  width: ${props => props.width};
`;

const ScoreboardTaskCellWrap2 = styled(ScoreboardCell2)`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 100%;
`;


// Green color: #1B8041, RGB(27, 128, 65) (VERDICT_OK)
// Red color: #881f1b, RGB(136, 31, 27) (VERDICT_NOK)


const ScoreboardICPCTaskCell2 = ({ status, attempts }) => {
    return <ScoreboardTaskCellWrap2 background={TeamTaskColor[status]}>
        {status === TeamTaskStatus.first && <StarIcon/>}
        {TeamTaskSymbol[status]}
        {status !== TeamTaskStatus.untouched && attempts > 0 && attempts}
    </ScoreboardTaskCellWrap2>;
};


export const ScoreboardIOITaskCell2 = ({ score, minScore, maxScore, ...props }) => {
    return <ScoreboardTaskCellWrap2 background={getTeamTaskColor(score, minScore, maxScore)} {...props}>
        {formatScore(score)}
    </ScoreboardTaskCellWrap2>;
};

ScoreboardICPCTaskCell2.propTypes = {
    status: PropTypes.oneOf(Object.values(TeamTaskStatus)),
    attempts: PropTypes.number
};

ScoreboardIOITaskCell2.propTypes = {
    status: PropTypes.oneOf(Object.values(TeamTaskStatus)),
    score: PropTypes.number,
    attempts: PropTypes.number,
    minScore: PropTypes.number,
    maxScore: PropTypes.number
};

const RenderScoreboardTaskCell2 = ({ data, ...props }) => {
    if (data.type === "icpc") {
        return <ScoreboardICPCTaskCell2
            status={getStatus(data.isFirstToSolve, data.isSolved, data.pendingAttempts, data.wrongAttempts)}
            attempts={data.wrongAttempts + data.pendingAttempts}
            {...props}
        />;
    } else {
        return <ScoreboardIOITaskCell2 score={data.score} {...props} />;
    }
};

RenderScoreboardTaskCell2.propTypes = {
    data: PropTypes.object
};

export const ScoreboardRow2 = ({ teamId, hideTasks, rankWidth, nameWidth, nameGrows, optimismLevel }) => {
    const scoreboardData = useSelector((state) => state.scoreboard[optimismLevel].ids[teamId]);
    const contestData = useSelector((state) => state.contestInfo.info);
    const teamData = useSelector((state) => state.contestInfo.info?.teamsId[teamId]);
    return <ContesterRow2 medal={scoreboardData?.medalType} >
        <RankLabel2 rank={scoreboardData?.rank}/>
        <ShrinkingBox2 text={teamData?.shortName ?? "??"} Wrapper={FlexedBox2}
            marginLeft={QUEUE_PER_COLUMNS_PADDING2} marginRight={QUEUE_PER_COLUMNS_PADDING2}
            width={SCOREBOARD_NAME_WIDTH2}/>
        <ShrinkingBox2 align={"center"} Wrapper={FlexedBox2}
            text={scoreboardData === null ? "??" : formatScore(scoreboardData?.totalScore ?? 0.0, 1)}
            flexGrow={1} flexShrink={1} flexBasis={0}/>
        {contestData?.resultType === "ICPC" && <ShrinkingBox2 align={"center"} Wrapper={FlexedBox2}
            text={scoreboardData?.penalty} flexGrow={1} flexShrink={1} flexBasis={0}/>}
        {!hideTasks && scoreboardData?.problemResults.map((result, i) =>
            <FlexedBox2 flexGrow={1} flexShrink={1} flexBasis={0} align={"center"} key={i}>
                <TaskResultLabel2 problemResult={result}
                    minScore={contestData?.problems[i]?.minScore} maxScore={contestData?.problems[i]?.maxScore}/>
            </FlexedBox2>)}
    </ContesterRow2>;
};
ScoreboardRow2.propTypes = {
    teamId: PropTypes.number.isRequired,
    hideTasks: PropTypes.bool
};

const ScoreboardHeaderTitle2 = styled(FlexedBox2)`
  text-align: center;
  width: calc(${SCOREBOARD_RANK_WIDTH2} + ${SCOREBOARD_NAME_WIDTH2});
`;


const ScoreboardProblemLabel2 = ({ probData: prob }) =>
    <FlexedBox2 flexGrow={1} flexShrink={1} flexBasis={0} align={"center"} display="flex">
        <CircleCell content={prob?.letter ?? "??"} backgroundColor={prob?.color ?? "black"} width={CELL_QUEUE_TASK_WIDTH}/>
    </FlexedBox2>;

const ScoreboardHeader2 = ({ problems, name }) => {
    const contestInfo = useSelector((state) => state.contestInfo.info);
    let color = name === "optimistic" ? SCOREBOARD_HEADER_TITLE_BG_GREEN_COLOR : undefined;

    return <ContesterRow2>
        <ScoreboardHeaderTitle2 color={color} marginLeft={QUEUE_PER_COLUMNS_PADDING2} marginRight={QUEUE_PER_COLUMNS_PADDING2}>
            {nameTable[name] + " STANDINGS"}
        </ScoreboardHeaderTitle2>
        {/*marginRight={QUEUE_PER_COLUMNS_PADDING2}*/}
        <FlexedBox2 flexGrow={1} flexShrink={1} flexBasis={0} align={"center"}>&#931;</FlexedBox2>
        {contestInfo?.resultType === "ICPC" && <FlexedBox2 flexGrow={1} flexShrink={1} flexBasis={0} align={"center"}>PEN</FlexedBox2>}
        {problems && problems.map((probData) => <ScoreboardProblemLabel2 probData={probData} key={probData.name}/>)}
    </ContesterRow2>;
};

ScoreboardHeader2.propTypes = {
    problems: PropTypes.arrayOf(PropTypes.object)
};

const ScoreboardRowWrap2 = styled.div.attrs((props) => ({
    style: {
        top: props.pos + "px"
    }
}))`
  left: 0;
  right: 0;
  height: ${props => props.rowHeight + 2}px; /* FIXME lol */
  transition: top ${SCOREBOARD_ROW_TRANSITION_TIME}ms ease-out;
  position: absolute;
`;
/**
 * Aligned vertically with zIndex
 * @type {StyledComponent<"div", AnyIfEmpty<DefaultTheme>, function({zIndex: *}): {style: {zIndex: *}}, keyof function({zIndex: *}): {style: {zIndex: *}}>}
 */
const PositionedScoreboardRowWrap2 = styled.div.attrs(({ zIndex }) => ({
    style: {
        zIndex: zIndex
    }
}
))`
  position: relative;
`;

const PositionedScoreboardRow2 = ({ zIndex, children, ...rest }) => {
    return <PositionedScoreboardRowWrap2 zIndex={zIndex}>
        <ScoreboardRowWrap2 {...rest}>
            {children}
        </ScoreboardRowWrap2>
    </PositionedScoreboardRowWrap2>;
};

PositionedScoreboardRow2.propTypes = {
    zIndex: PropTypes.number,
    children: PropTypes.node
};

export const Scoreboard2 = ({ widgetData: { settings, location } }) => {
    const optimismLevel = settings.optimismLevel;
    const teamsOnPage = settings.teamsOnPage;
    const startPageRow = settings.startFromRow - 1;
    const rows = extractScoreboardRows(
        useSelector((state) => state.scoreboard[optimismLevel]),
        settings.group);
    const contestInfo = useSelector((state) => state.contestInfo.info);
    const totalHeight = location.sizeY;
    const rowHeight = (totalHeight / (teamsOnPage + 1));
    const scrollPos = useScoller(rows.length, teamsOnPage, SCOREBOARD_SCROLL_INTERVAL, startPageRow, settings.numRows);
    const teams = _(rows).toPairs().sortBy("[1].teamId").value();
    return <ScoreboardWrap2>
        <ScoreboardHeader2 problems={contestInfo?.problems} rowHeight={rowHeight} name={optimismLevel} key={"header"}/>
        <div style={{ overflow: "hidden", height: "100%", marginTop: Math.max(0, rowHeight - QUEUE_ROW_HEIGHT + 1) }}>
            {teams.map(([ind, teamRowData]) =>
                <PositionedScoreboardRow2 key={teamRowData.teamId} pos={ind * rowHeight - scrollPos * rowHeight}
                    rowHeight={rowHeight} zIndex={rows.length - ind}>
                    <ScoreboardRow2 teamId={teamRowData.teamId} optimismLevel={optimismLevel}/>
                </PositionedScoreboardRow2>
            )}
        </div>
    </ScoreboardWrap2>;
};

Scoreboard2.propTypes = {
    widgetData: PropTypes.object.isRequired
};

export default Scoreboard2;
