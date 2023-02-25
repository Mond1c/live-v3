import React from "react";
import styled from "styled-components";
import star from "../../assets/icons/star.svg";
import { STAR_SIZE } from "../../config";


const StarIconWrap2 = styled.img`
    position: absolute;
    top: 0;
    right: 0;
    width: ${STAR_SIZE}px;
    height: ${STAR_SIZE}px;
`;
export const StarIcon2 = () => {
    return <StarIconWrap2 src={star} alt="first"/>;
};
