import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import {
    CELL_NAME_LEFT_PADDING,
    CELL_NAME_RIGHT_PADDING,
    CELL_PROBLEM_LINE_WIDTH,
    GLOBAL_DEFAULT_FONT,
    MEDAL_COLORS,
    VERDICT_NOK2,
    VERDICT_OK2,
    VERDICT_UNKNOWN2,
    SCORE_NONE_TEXT, CELL_TEXT_COLOR, CELL_QUEUE_RANK_WIDTH, VERDICT_OK, VERDICT_NOK, VERDICT_UNKNOWN
} from "../../config";
import { StarIcon } from "./Star";
import { Box2, FlexedBox2, ShrinkingBox2, TextShrinking } from "./Box2";
import { getStatus, getTeamTaskColor, TeamTaskStatus, TeamTaskSymbol } from "../../utils/statusInfo";
import { formatScore, ICPCVerdict, IOIVerdict } from "./ContestCells";
import { TeamTaskColor2, getTeamTaskColor2 } from "../../utils/statusInfo2";

export const ICPCTaskResult = PropTypes.shape({
    type: PropTypes.string.isRequired,
    pendingAttempts: PropTypes.number.isRequired,
    wrongAttempts: PropTypes.number.isRequired,
    isSolved: PropTypes.bool.isRequired,
    isFirstToSolve: PropTypes.bool.isRequired,
});

export const IOITaskResult = PropTypes.shape({
    type: PropTypes.string.isRequired,
    score: PropTypes.number,
});


export const ICPCScoreCell = ({ score, Wrapper = FlexedBox2, ...props }) => {
    return <ShrinkingBox2 Wrapper={FlexedBox2} text={ score ?? "??" } {...props}/>;
};

ICPCScoreCell.propTypes = {
    score: PropTypes.string,
    background: PropTypes.string,
    color: PropTypes.string,
};


export const IOIScoreCell = ({ score, minScore, maxScore, Wrapper = FlexedBox2, ...props }) => {
    return <Wrapper {...props}><TextShrinking canGrow={false} canShrink={false} text={ score ?? "??" } color={ getTeamTaskColor(score, props.minScore, props.maxScore) ?? CELL_TEXT_COLOR }
        background={getTeamTaskColor(score, props.minScore, props.maxScore)}/></Wrapper>;
};


export const QueueStatusCell = ({ data, score, ...props }) => {
    return data.type === "icpc" ? <ICPCScoreCell score={score} color={data.isAccepted ? VERDICT_OK2 : VERDICT_NOK2} {...props}/> :
        <ICPCScoreCell score={data.difference > 0 ? `+${formatScore(data.difference, 1)}` : (data.difference < 0 ? `-${formatScore(-data.difference, 1)}` : "=")} color={data.difference > 0 ? VERDICT_OK2 : (data.difference < 0 ? VERDICT_NOK2 : VERDICT_UNKNOWN2)} {...props}/>;
};

const ICPCVerdictLabel = ({ runResult, ...props }) => {
    const color = runResult?.isAccepted ? VERDICT_OK2 : VERDICT_NOK2;
    return <ShrinkingBox2 text={runResult?.result ?? "??"} color={color} {...{ Wrapper: FlexedBox2, ...props }}/>;
};

ICPCVerdictLabel.propTypes = {
    runResult: ICPCVerdict,
};

const IOIVerdictLabel = ({ runResult: { wrongVerdict, difference }, ...props }) => {
    const diffColor = difference > 0 ? VERDICT_OK : (difference < 0 ? VERDICT_NOK : VERDICT_UNKNOWN);
    const diffText = difference > 0 ? `+${formatScore(difference, 1)}` : (difference < 0 ? `-${formatScore(-difference, 1)}` : "=");
    return <>
        {wrongVerdict !== undefined && <ShrinkingBox2 text={wrongVerdict ?? "??"} color={VERDICT_NOK} {...{ Wrapper: FlexedBox2, ...props }}/>}
        {wrongVerdict === undefined && <ShrinkingBox2 text={diffText ?? "??"} color={diffColor} {...{ Wrapper: FlexedBox2, ...props }}/>}
    </>;
};
IOIVerdictLabel.propTypes = {
    runResult: IOIVerdict,
};

export const VerdictLabel2 = ({ runResult, ...props }) => {
    return <>
        {runResult.type === "icpc" && <ICPCVerdictLabel runResult={runResult} {...props}/>}
        {runResult.type === "ioi" && <IOIVerdictLabel runResult={runResult} {...props}/>}
    </>;
    // return data.type === "icpc" ? <ICPCScoreCell score={score} color={} {...props}/> :
    //     <IOIScoreCell score={score} maxScore={props.maxScore} minScore={props.minScore}/>;
};


export const RankLabel2 = ({ rank, ...props }) => {
    return <ShrinkingBox2 text={rank ?? "??"} width={CELL_QUEUE_RANK_WIDTH} align={"center"} Wrapper={FlexedBox2} {...props}>
    </ShrinkingBox2>;
};

RankLabel2.propTypes = {
    ...Box2.propTypes,
    rank: PropTypes.number
};

const VerdictCellProgressBar2 = styled.div`
  width: ${({ width }) => width};
  height: 13px;
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  
  background-color: ${VERDICT_UNKNOWN2};
`;


const VerdictCellInProgressWrap2 = styled(FlexedBox2)`
  //position: relative;
  //left: 6px;
  //display: flex;
  margin-top: 9px;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
`;

const VerdictCellInProgress2 = ({ percentage, ...props }) => {
    return <VerdictCellInProgressWrap2 {...props} >
        {percentage !== 0 && <VerdictCellProgressBar2 width={percentage * 100 * 0.6 + "%"}/>}
    </VerdictCellInProgressWrap2>;
};

VerdictCellInProgress2.PropTypes = {
    percentage: PropTypes.number.isRequired
};

export const RunStatusLabel2 = ({ Wrapper, runInfo, ...props }) => {
    return <>
        {runInfo.result === undefined && <VerdictCellInProgress2 percentage={runInfo.percentage} align={"center"} {...props}/>}
        {runInfo.result !== undefined && <VerdictLabel2 runResult={runInfo.result} score={runInfo.result.result} align={"center"} {...props}/>}
    </>;
};

RunStatusLabel2.propTypes = {
    ...Box2.propTypes,
    runInfo: PropTypes.shape({
        // result: PropTypes.oneOf([IOIVerdict.type, ICPCVerdict.type]),
        percentage: PropTypes.number.isRequired
    })
};

// TODO: fts
const ICPCTaskResultLabel2 = ({ problemResult: r }) => {
    const status = getStatus(r.isFirstToSolve, r.isSolved, r.pendingAttempts, r.wrongAttempts);
    const attempts = r.wrongAttempts + r.pendingAttempts;
    return <>
        {/*{status === TeamTaskStatus.first && <StarIcon/>}*/}
        <Box2 color={TeamTaskColor2[status]} fontWeight={"bold"}>
            {TeamTaskSymbol[status]}
            {status !== TeamTaskStatus.untouched && attempts > 0 && attempts}
        </Box2>
    </>;
};

ICPCTaskResultLabel2.propTypes = {
    problemResult: ICPCTaskResult,
};

const IOITaskResultLabel2 = ({ problemResult: r, minScore, maxScore }) => {
    // const status = getStatus(r.isFirstToSolve, r.isSolved, r.pendingAttempts, r.wrongAttempts);
    // const attempts = r.wrongAttempts + r.pendingAttempts;
    return <Box2 color={getTeamTaskColor2(r.score, minScore, maxScore)} fontWeight={"bold"}>
        {formatScore(r?.score)}
    </Box2>;
};

IOITaskResultLabel2.propTypes = {
    problemResult: IOITaskResult,
    minScore: PropTypes.number,
    maxScore: PropTypes.number,
};

export const TaskResultLabel2 = ({ problemResult, minScore, maxScore, ...props }) => {
    return <>
        {problemResult.type === "icpc" && <ICPCTaskResultLabel2 problemResult={problemResult} {...props}/>}
        {problemResult.type === "ioi" && <IOITaskResultLabel2 problemResult={problemResult} minScore={minScore} maxScore={maxScore} {...props}/>}
    </>;
};
