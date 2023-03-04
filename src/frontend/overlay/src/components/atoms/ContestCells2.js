import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import {
    CELL_NAME_LEFT_PADDING,
    CELL_NAME_RIGHT_PADDING,
    CELL_PROBLEM_LINE_WIDTH,
    GLOBAL_DEFAULT_FONT,
    MEDAL_COLORS,
    VERDICT_NOK,
    VERDICT_OK,
    VERDICT_UNKNOWN,
    SCORE_NONE_TEXT, CELL_TEXT_COLOR, CELL_QUEUE_RANK_WIDTH
} from "../../config";
import { StarIcon } from "./Star";
import { Box2, FlexedBox2, ShrinkingBox2, TextShrinking } from "./Box2";
import { getTeamTaskColor, TeamTaskColor, TeamTaskStatus } from "../../utils/statusInfo";
import { formatScore, ICPCVerdict, IOIVerdict } from "./ContestCells";

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
    return data.type === "icpc" ? <ICPCScoreCell score={score} color={data.isAccepted ? VERDICT_OK : VERDICT_NOK} {...props}/> :
        <ICPCScoreCell score={data.difference > 0 ? `+${formatScore(data.difference, 1)}` : (data.difference < 0 ? `-${formatScore(-data.difference, 1)}` : "=")} color={data.difference > 0 ? VERDICT_OK : (data.difference < 0 ? VERDICT_NOK : VERDICT_UNKNOWN)} {...props}/>;
};

const ICPCVerdictLabel = ({ runResult, ...props }) => {
    const color = runResult?.isAccepted ? VERDICT_OK : VERDICT_NOK;
    return <ShrinkingBox2 text={runResult?.result ?? "??"} color={color} {...{ Wrapper: FlexedBox2, ...props }}/>;
};
ICPCVerdictLabel.propTypes = {
    runResult: ICPCVerdict,
};

export const VerdictLabel2 = ({ runResult, ...props }) => {
    return <>
        {runResult.type === "icpc" && <ICPCVerdictLabel runResult={runResult} {...props}/>}
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
  
  background-color: ${VERDICT_UNKNOWN};
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
        result: PropTypes.oneOf([IOIVerdict, ICPCVerdict]),
        percentage: PropTypes.number.isRequired
    })
};
