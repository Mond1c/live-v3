import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { SCOREBOARD_TYPES } from "../../../consts";
import c from "../../../config";
import { ShrinkingBox } from "../../atoms/ShrinkingBox";
import { RankLabel } from "../../atoms/ContestLabels";
import {formatPenalty, formatScore, useFormatPenalty} from "../../atoms/ContestCells";


const rowFlashing = keyframes`
  from {
    filter: brightness(0.3);
  }
  to {
    filter: brightness(1);
  }
`;

const getContesterRowBackground = (background, medal, isEven) => {
    const base = background ?? ((isEven && c.CELL_BG_COLOR_ODD) || c.CELL_BG_COLOR2);
    if (c.MEDAL_COLORS[medal]) {
        return `linear-gradient(270deg, rgba(253, 141, 105, 0) 0, ${c.MEDAL_COLORS[medal]} 100%)` + base;
    }
    return base;
};

const borderRadius = ({
    round,
    roundT,
    roundB,
    roundTL,
    roundTR,
    roundBL,
    roundBR,
}) => {
    const borderRadiusTL = (roundTL ?? roundT ?? round ?? true) ? c.CONTESTER_ROW_BORDER_RADIUS : 0;
    const borderRadiusTR = (roundTR ?? roundT ?? round ?? true) ? c.CONTESTER_ROW_BORDER_RADIUS : 0;
    const borderRadiusBL = (roundBL ?? roundB ?? round ?? true) ? c.CONTESTER_ROW_BORDER_RADIUS : 0;
    const borderRadiusBR = (roundBR ?? roundB ?? round ?? true) ? c.CONTESTER_ROW_BORDER_RADIUS : 0;
    return `${borderRadiusTL} ${borderRadiusTR} ${borderRadiusBR} ${borderRadiusBL}`;
};
/**
 * @deprecated Do not use this component or inherit from this component. This is old design
 */
export const ContestantRow = styled.div`
  background-color: ${({ background, medal, isEven }) => getContesterRowBackground(background, medal, isEven)};
  background-size: 34px 100%; /* TODO: 34 is a magic number for gradient medal color */
  background-repeat: no-repeat;
  border-radius: ${props => borderRadius(props)};

  height: ${c.QUEUE_ROW_HEIGHT2}px;
  display: flex;
  flex-wrap: nowrap;
  max-width: 100%;
  opacity: ${c.CONTESTER_ROW_OPACITY};
  padding: 0 10px;

  animation: ${props => props.flashing ? rowFlashing : null} ${c.CELL_FLASH_PERIOD}ms linear infinite alternate-reverse;
`;

ContestantRow.propTypes = {
    background: PropTypes.string,
    medal: PropTypes.string,
    isEven: PropTypes.bool,
    flashing: PropTypes.bool,
    round : PropTypes.bool,
    roundT : PropTypes.bool,
    roundB : PropTypes.bool,
    roundTL : PropTypes.bool,
    roundTR : PropTypes.bool,
    roundBL : PropTypes.bool,
    roundBR : PropTypes.bool,
};

const ContestantInfoLabel = styled(RankLabel)`
  width: 32px;
  align-self: stretch;
  padding-left: 4px;
  flex-shrink: 0;
`;

const ContestantInfoTeamNameLabel = styled(ShrinkingBox)`
  flex-grow: 1;
  width: ${c.CONTESTER_NAME_WIDTH};
  //flex-shrink: 0;
`;


const ContestantInfoWrap = styled.div`
  width: 100%;
  height: ${c.CONTESTER_ROW_HEIGHT};
  background-color: ${c.CONTESTER_BACKGROUND_COLOR};
  display: flex;
  align-items: center;
  border-radius: 16px ${props => props.round ? "16px" : "0px"} 16px  16px ;
  overflow: hidden;
  gap: 5px;
  color: white;
  font-size: 18px;
`;

const ContestantInfoScoreLabel = styled(ShrinkingBox)`
  width: 51px;
  flex-shrink: 0;
  padding-right: 20px;
  box-sizing: content-box;
`;


export const ContestantInfo = ({ teamId, roundBR= true, className }) => {
    const contestInfo = useSelector((state) => state.contestInfo.info);
    const scoreboardData = useSelector((state) => state.scoreboard[SCOREBOARD_TYPES.normal].ids[teamId]);
    const teamData = useSelector((state) => state.contestInfo.info?.teamsId[teamId]);
    const formatPenalty = useFormatPenalty();
    return <ContestantInfoWrap round={roundBR} className={className}>
        <ContestantInfoLabel rank={scoreboardData?.rank} medal={scoreboardData?.medalType}/>
        <ContestantInfoTeamNameLabel text={teamData?.shortName ?? "??"}/>
        <ContestantInfoScoreLabel align={"right"}
            text={scoreboardData === null ? "??" : formatScore(scoreboardData?.totalScore ?? 0.0, 1)}/>
        {contestInfo?.resultType !== "IOI" && <ContestantInfoScoreLabel align={"right"}
            text={formatPenalty(scoreboardData?.penalty)}/>}
    </ContestantInfoWrap>;
};