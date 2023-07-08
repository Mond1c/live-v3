import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import {
    VERDICT_NOK2,
    VERDICT_OK2,
    VERDICT_UNKNOWN2,
    CELL_TEXT_COLOR,
} from "../../config";
import { Box2, FlexedBox2, ShrinkingBox2, TextShrinking2 } from "./Box2";
import { formatScore, ICPCResult, IOIResult } from "./ContestCells";
import {
    TeamTaskColor2,
    TeamTaskSymbol,
    TeamTaskStatus,
    getStatus2,
    getTeamTaskColor2,
} from "../../utils/statusInfo2";
import { CircleCell } from "./CircleCellsProblem";

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
    return <ShrinkingBox2 Wrapper={Wrapper} text={ score ?? "??" } {...props}/>;
};

ICPCScoreCell.propTypes = {
    score: PropTypes.string,
    background: PropTypes.string,
    color: PropTypes.string,
};


export const IOIScoreCell = ({ score, Wrapper = FlexedBox2, ...props }) => {
    return <Wrapper {...props}>
        <TextShrinking2
            text={ score ?? "??" }
            color={ getTeamTaskColor2(score, props.minScore, props.maxScore) ?? CELL_TEXT_COLOR }
            background={getTeamTaskColor2(score, props.minScore, props.maxScore)}
        />
    </Wrapper>;
};


export const QueueStatusCell = ({ data, score, ...props }) => {
    return data.type === "icpc" ? <ICPCScoreCell score={score} color={data.isAccepted ? VERDICT_OK2 : VERDICT_NOK2} {...props}/> :
        <ICPCScoreCell score={data.difference > 0 ? `+${formatScore(data.difference, 1)}` : (data.difference < 0 ? `-${formatScore(-data.difference, 1)}` : "=")}
            color={data.difference > 0 ? VERDICT_OK2 : (data.difference < 0 ? VERDICT_NOK2 : VERDICT_UNKNOWN2)} {...props}/>;
};

const ICPCVerdictLabel = ({ runResult, ...props }) => {
    const color = runResult?.verdict.isAccepted ? VERDICT_OK2 : VERDICT_NOK2;
    return <ShrinkingBox2 text={runResult?.verdict.shortName ?? "??"} color={color} Wrapper={FlexedBox2} {...props}/>;
};

ICPCVerdictLabel.propTypes = {
    runResult: ICPCResult,
};

const IOIVerdictLabel = ({ runResult: { wrongVerdict, difference }, ...props }) => {
    const diffColor = difference > 0 ? VERDICT_OK2 : (difference < 0 ? VERDICT_NOK2 : VERDICT_UNKNOWN2);
    const diffText = difference > 0 ? `+${formatScore(difference, 1)}` : (difference < 0 ? `-${formatScore(-difference, 1)}` : "=");
    return <>
        {wrongVerdict !== undefined && <ShrinkingBox2 text={wrongVerdict ?? "??"} color={VERDICT_NOK2} {...{ Wrapper: FlexedBox2, ...props }}/>}
        {wrongVerdict === undefined && <ShrinkingBox2 text={diffText ?? "??"} color={diffColor} {...{ Wrapper: FlexedBox2, ...props }}/>}
    </>;
};
IOIVerdictLabel.propTypes = {
    runResult: IOIResult,
};

export const VerdictLabel2 = ({ runResult, ...props }) => {
    return <>
        {runResult.type === "ICPC" && <ICPCVerdictLabel runResult={runResult} {...props}/>}
        {runResult.type === "IOI" && <IOIVerdictLabel runResult={runResult} {...props}/>}
    </>;
};


export const RankLabel2 = ({ rank, ...props }) => {
    return <ShrinkingBox2 text={rank ?? "??"} align={"center"} Wrapper={FlexedBox2} {...props}>
    </ShrinkingBox2>;
};

RankLabel2.propTypes = {
    ...Box2.propTypes,
    rank: PropTypes.number
};

const VerdictCellProgressBar2 = styled.div`
  width: ${({ width }) => width};
  height: 12px;
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  
  background-color: ${VERDICT_UNKNOWN2};
`;


const VerdictCellInProgressWrap2 = styled(FlexedBox2)`
  margin-top: 12px;
  flex-direction: row;
  justify-content: flex-start;
  align-content: center;
`;

const VerdictCellInProgress2 = ({ percentage, ...props }) => {
    return <VerdictCellInProgressWrap2 {...props} >
        {percentage !== 0 && <VerdictCellProgressBar2 width={percentage * 100 * 0.6 + "%"}/>}
    </VerdictCellInProgressWrap2>;
};

VerdictCellInProgress2.propTypes = {
    percentage: PropTypes.number.isRequired
};

export const RunStatusLabel2 = ({ runInfo, ...props }) => {
    return <>
        {runInfo.result === undefined && <VerdictCellInProgress2 percentage={runInfo.percentage} align={"center"} {...props}/>}
        {runInfo.result !== undefined && <VerdictLabel2 runResult={runInfo.result} score={runInfo.result.result} align={"center"} {...props}/>}
    </>;
};

RunStatusLabel2.propTypes = {
    ...Box2.propTypes,
    runInfo: PropTypes.shape({
        result: PropTypes.oneOf([IOIResult, IOIResult]),
        percentage: PropTypes.number.isRequired,
    }),
};

// TODO: fts start
const ICPCTaskResultLabel2 = ({ problemResult: r, ...props }) => {
    const status = getStatus2(r.isFirstToSolve, r.isSolved, r.pendingAttempts, r.wrongAttempts);
    const attempts = r.wrongAttempts + r.pendingAttempts;
    return <>
        {/*{status === TeamTaskStatus.first && <StarIcon/>}*/}
        <Box2 color={TeamTaskColor2[status]} fontWeight={"bold"} {...props}>
            {TeamTaskSymbol[status]}
            {status !== TeamTaskStatus.untouched && attempts > 0 && attempts}
        </Box2>
    </>;
};

ICPCTaskResultLabel2.propTypes = {
    problemResult: ICPCTaskResult,
};

const IOITaskResultLabel2 = ({ problemResult: r, minScore, maxScore,  ...props }) => {
    return <Box2 color={getTeamTaskColor2(r.score, minScore, maxScore)} fontWeight={"bold"} { ...props}>
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
        {problemResult.type === "ICPC" && <ICPCTaskResultLabel2 problemResult={problemResult} {...props}/>}
        {problemResult.type === "IOI" && <IOITaskResultLabel2 problemResult={problemResult} minScore={minScore} maxScore={maxScore} {...props}/>}
    </>;
};

export const ProblemCircleLabel = ({ letter, problemColor }) => {
    return (
        <Box2 width={"30px"} marginBottom={"8px"} paddingTop={"4px"}>
            <CircleCell content={letter ?? "??"} backgroundColor={problemColor ?? "#000000"} />
        </Box2>
    );
};