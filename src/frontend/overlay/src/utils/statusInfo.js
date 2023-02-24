import { CELL_BG_COLOR, STATISTICS_BG_COLOR, VERDICT_NOK, VERDICT_OK, VERDICT_UNKNOWN } from "../config";

export const TeamTaskStatus = Object.freeze({
    solved: 1,
    failed: 2,
    untouched: 3,
    unknown: 4,
    first: 5
});

export const TeamTaskSymbol = Object.freeze({
    [TeamTaskStatus.solved]: "+",
    [TeamTaskStatus.failed]: "-",
    [TeamTaskStatus.untouched]: "",
    [TeamTaskStatus.unknown]: "?",
    [TeamTaskStatus.first]: "+",
});
export const TeamTaskColor = Object.freeze({
    [TeamTaskStatus.solved]: VERDICT_OK,
    [TeamTaskStatus.failed]: VERDICT_NOK,
    [TeamTaskStatus.untouched]: STATISTICS_BG_COLOR,
    [TeamTaskStatus.unknown]: VERDICT_UNKNOWN,
    [TeamTaskStatus.first]: VERDICT_OK,
});

export function getStatus(isFirstToSolve, isSolved, pendingAttempts, wrongAttempts) {
    if (isFirstToSolve) {
        return TeamTaskStatus.first;
    } else if (isSolved) {
        return TeamTaskStatus.solved;
    } else if (pendingAttempts > 0) {
        return TeamTaskStatus.unknown;
    } else if (wrongAttempts > 0) {
        return TeamTaskStatus.failed;
    } else {
        return TeamTaskStatus.untouched;
    }
}

export const getTeamTaskColor = (score, minScore, maxScore) => {
    if (score === undefined) {
        return CELL_BG_COLOR;
    }
    if (minScore !== undefined && maxScore !== undefined) {
        const [minRed, minGreen, minBlue] = [136, 31, 27];
        const [maxRed, maxGreen, maxBlue] = [27, 128, 65];

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
