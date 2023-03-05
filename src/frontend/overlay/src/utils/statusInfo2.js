import { TeamTaskStatus } from "./statusInfo";
import { VERDICT_OK2, VERDICT_NOK2, VERDICT_UNKNOWN2, STATISTICS_BG_COLOR, CELL_BG_COLOR } from "../config";

export const TeamTaskColor2 = Object.freeze({
    [TeamTaskStatus.solved]: VERDICT_OK2,
    [TeamTaskStatus.failed]: VERDICT_NOK2,
    [TeamTaskStatus.untouched]: STATISTICS_BG_COLOR,
    [TeamTaskStatus.unknown]: VERDICT_UNKNOWN2,
    [TeamTaskStatus.first]: VERDICT_OK2,
});

export const getTeamTaskColor2 = (score, minScore, maxScore) => {
    if (score === undefined) {
        return CELL_BG_COLOR;
    }
    if (minScore !== undefined && maxScore !== undefined) {
        const [minRed, minGreen, minBlue] = [203, 46, 40];
        const [maxRed, maxGreen, maxBlue] = [46, 203, 104];

        const scoreDiff = maxScore - minScore;
        const redDiff = maxRed - minRed;
        const greenDiff = maxGreen - minGreen;
        const blueDiff = maxBlue - minBlue;

        const middleRange = mapNumber(score, minScore, maxScore, 0, Math.PI);
        const middleFactor = 90;

        const [red, green, blue] = [
            Math.min(minRed + score * (redDiff / scoreDiff) + (middleFactor * Math.sin(middleRange)), 255),
            Math.min(minGreen + score * (greenDiff / scoreDiff) + (middleFactor * Math.sin(middleRange)), 255),
            Math.min(minBlue + score * (blueDiff / scoreDiff) + ((middleFactor * Math.sin(middleRange)) / 10), 255)
        ];

        return `#${((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1, 7)}`;
    }

    return undefined;
};

const mapNumber = (value, oldMin, oldMax, newMin, newMax) => {
    const result = (value - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    return Math.min(Math.max(result, newMin), newMax);
};

