import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import {
    CELL_BG_COLOR,
    CELL_BG_COLOR_ODD,
    CELL_FLASH_PERIOD,
    CELL_FONT_FAMILY,
    CELL_FONT_SIZE, CELL_NAME_LEFT_PADDING, CELL_NAME_RIGHT_PADDING,
    CELL_TEXT_COLOR, GLOBAL_DEFAULT_FONT
} from "../../config";
import React, { useCallback, useEffect, useRef } from "react";
import { getTextWidth } from "./ContestCells";
import { Cell } from "./Cell";

const flash = keyframes`
  from {
    filter: brightness(0.3);
  }
  to {
    filter: brightness(1);
  }
`;

// FIXME: too overloaded with props.
export const Cell2 = styled.div`
  width: ${props => props.width};
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: ${props => (props.canShrink ?? false) ? 1 : 0};
  flex-grow: ${props => (props.canGrow ?? false) ? 1 : 0};
  flex-basis: ${props => props.basis};

  font-family: ${CELL_FONT_FAMILY};
  font-size: ${CELL_FONT_SIZE};

  box-sizing: border-box;

  color: ${CELL_TEXT_COLOR};
`;

Cell2.propTypes = {
    width: PropTypes.string,
    background: PropTypes.string,
    flex: PropTypes.string
};

const TextShrinkingContainer = styled.div`
  white-space: nowrap;
  transform-origin: left;
  text-align: left;
  position: relative;
  left: ${props => props.align === "center" ? "50%" : ""};
`;

const TextShrinkingWrap = styled(Cell2)`
  flex-grow: ${props => (props.canGrow ?? true) ? 1 : 0};
  flex-shrink: ${props => (props.canShrink ?? true) ? 1 : 0};
  overflow-x: hidden;
  justify-content: start;
  padding-left: ${CELL_NAME_LEFT_PADDING};
  padding-right: ${CELL_NAME_RIGHT_PADDING};
  color: ${props => props.color};
  font: ${props => props.font};
`;

export const TextShrinking = ({ text, font = GLOBAL_DEFAULT_FONT, align = "left", children, ...props }) => {
    const textWidth = getTextWidth(text, font);
    const cellRef = useRef(null);
    const updateScale = useCallback((newCellRef) => {
        if (newCellRef !== null) {
            cellRef.current = newCellRef;
            newCellRef.children[0].style.transform = "";
            const styles = getComputedStyle(newCellRef);
            const haveWidth = (parseFloat(styles.width) - (parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)));
            const scaleFactor = Math.min(1, haveWidth / textWidth);
            newCellRef.children[0].style.transform = `scaleX(${scaleFactor})${align === "center" ? " translateX(-50%)" : ""}`; // dirty hack, don't @ me
        }
    }, [align, font, text]);
    useEffect(() => {
        updateScale(cellRef.current);
    }, [text]);
    return <TextShrinkingWrap ref={updateScale} font={font} {...props}>
        <TextShrinkingContainer scaleY={0} align={align}>
            {text}
        </TextShrinkingContainer>
        {children}
    </TextShrinkingWrap>;
};
