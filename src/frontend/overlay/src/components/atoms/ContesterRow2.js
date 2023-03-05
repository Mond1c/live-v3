import styled from "styled-components";
import React from "react";
import {
    CELL_BG_COLOR,
    CELL_BG_COLOR_ODD,
    CONTESTER_ROW_OPACITY,
    MEDAL_COLORS,
    QUEUE_OPACITY,
    QUEUE_ROW_HEIGHT
} from "../../config";
import PropTypes from "prop-types";

const getContesterRowBackground = (background, medal, isEven) => {
    const base = background ?? ((isEven && CELL_BG_COLOR_ODD) || CELL_BG_COLOR);
    if (MEDAL_COLORS[medal]) {
        return `linear-gradient(270deg, rgba(253, 141, 105, 0) 0, ${MEDAL_COLORS[medal]} 100%)` + base;
    }
    return base;
};

export const ContesterRow2 = styled.div`
  background: ${({ background, medal, isEven }) => getContesterRowBackground(background, medal, isEven)};
  background-size: 34px 100%; // why 34
  background-repeat: no-repeat;
  border-radius: 16px;

  height: ${QUEUE_ROW_HEIGHT}px;
  display: flex;
  flex-wrap: nowrap;
  max-width: 100%; // why?
  opacity: ${CONTESTER_ROW_OPACITY};
  
  padding: 0 10px;
`;

ContesterRow2.propTypes = {
    medal: PropTypes.string,
    isEven: PropTypes.bool,
};
