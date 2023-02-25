import styled from "styled-components";
import React from "react";
import { CELL_BG_COLOR, CELL_BG_COLOR_ODD, MEDAL_COLORS, QUEUE_OPACITY, QUEUE_ROW_HEIGHT } from "../../config";

export const DataRowWrap = styled.div`
  background: ${(props) => props.background};
  background-size: 34px 100%;
  background-repeat: no-repeat;
  border-radius: 16px;

  height: ${QUEUE_ROW_HEIGHT}px;
  display: flex;
  flex-wrap: nowrap;
  max-width: 100%;
  opacity: ${QUEUE_OPACITY};
  
`;

export const DataRow = ({ medal, ...props }) => {
    if (MEDAL_COLORS[medal]) {
        props.background = `linear-gradient(270deg, rgba(253, 141, 105, 0) 0, ${MEDAL_COLORS[medal]} 100%)` + CELL_BG_COLOR_ODD;
    } else {
        props.background = props.background ?? ((props.isEven && CELL_BG_COLOR_ODD) || CELL_BG_COLOR);
    }
    return <DataRowWrap {...props}/>;
};
