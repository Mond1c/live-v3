import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import {
    CELL_BG_COLOR,
    CELL_BG_COLOR_ODD,
    CELL_FLASH_PERIOD,
    CELL_FONT_FAMILY,
    CELL_FONT_SIZE, CELL_NAME_LEFT_PADDING, CELL_NAME_RIGHT_PADDING, CELL_QUEUE_RANK_WIDTH,
    CELL_TEXT_COLOR, GLOBAL_DEFAULT_FONT, GLOBAL_DEFAULT_FONT_FAMILY, GLOBAL_DEFAULT_FONT_SIZE
} from "../../config";
import React, { useCallback, useEffect, useRef } from "react";
import { getTextWidth } from "./ContestCells";

// FIXME: too overloaded with props.
export const Box2 = styled.div`
  width: ${props => props.width};
  height: ${props => props.height ?? "100%"};
  
  font-family: ${GLOBAL_DEFAULT_FONT_FAMILY};
  font-size: ${GLOBAL_DEFAULT_FONT_SIZE};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ color }) => color ?? CELL_TEXT_COLOR};
  text-align: ${({ align }) => align};
  box-sizing: border-box; /*why we use it?*/

    //line-height: ${props => props.height ?? "100%"};
  display: ${({ display }) => display};
    // flex-shrink: ${props => (props.canShrink ?? false) ? 1 : 0};
    // flex-grow: ${props => (props.canGrow ?? false) ? 1 : 0};
    //flex-basis: ${props => props.basis};

  margin-left: ${({ marginLeft }) => marginLeft};
  margin-right: ${({ marginRight }) => marginRight};
  
  overflow-x: hidden;
  white-space: nowrap; // should it here?
`;

Box2.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    background: PropTypes.string,
    // flex: PropTypes.string
    align: PropTypes.string,
};

export const FlexedBox2 = styled(Box2)`
  flex-grow: ${({ flexGrow }) => flexGrow ?? 0};
  flex-shrink: ${({ flexShrink }) => flexShrink ?? 0};
  flex-basis: ${({ flexBasis }) => flexBasis};
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent ?? "center"};
  flex-basis: ${props => props.basis};
`;

export const ShrinkingBox2 = ({ text, children, font = GLOBAL_DEFAULT_FONT, align = "left", color, Wrapper = Box2, ...props }) => {
    if (text.length > 10) { // TODO: delete
        // text += " 12345678";
    }
    const boxRef = useRef(null);
    const updateScale = useCallback((newCellRef) => {
        if (newCellRef !== null) {
            boxRef.current = newCellRef;
            newCellRef.children[0].style.transform = "";
            const styles = getComputedStyle(newCellRef);
            const textWidth = getTextWidth(text, font);
            const haveWidth = (parseFloat(styles.width) - (parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)));
            const scaleFactor = Math.min(1, haveWidth / textWidth);
            newCellRef.children[0].style.transform = `scaleX(${scaleFactor})`;
        }
    }, [align, font, text]);
    useEffect(() => {
        updateScale(boxRef.current);
    }, [text]);
    return <Wrapper ref={updateScale} {...props}>
        <TextShrinkingContainer2 align={align} color={color}>
            {text}
        </TextShrinkingContainer2>
    </Wrapper>;
};


const TextShrinkingContainer2 = styled.div`
  //width: 100%;
  //white-space: nowrap;
  transform-origin: left;
  position: relative;
  text-align: ${({ align }) => align};
  color: ${({ color }) => color};
  //left: 0;
  // left: ${props => props.align === "center" ? "50%" : ""};
`;

const TextShrinkingWrap = styled(Box2)`
  // flex-grow: ${props => (props.canGrow ?? true) ? 1 : 0};
  // flex-shrink: ${props => (props.canShrink ?? true) ? 1 : 0};
  //display: flex;
  //overflow-x: hidden;
  //justify-content: start;
  // padding-left: ${CELL_NAME_LEFT_PADDING};
  // padding-right: ${CELL_NAME_RIGHT_PADDING};
  // color: ${props => props.color};
  // font: ${props => props.font};
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
        <TextShrinkingContainer2 scaleY={0} align={align}>
            {text}
        </TextShrinkingContainer2>
        {children}
    </TextShrinkingWrap>;
};
