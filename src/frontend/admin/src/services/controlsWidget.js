import { AbstractWidgetService } from "shared-code/abstractWidget";
import { useMemo } from "react";
import { BASE_URL_BACKEND, ADMIN_ACTIONS_WS_URL } from "../config";

const controlElements = [
    { text: "Scoreboard", id: "scoreboard" },
    { text: "Queue", id: "queue" },
    { text: "Statistics", id: "statistics" },
    { text: "Ticker", id: "ticker" },
    // { text: "SplitScreen", id: "splitScreen" },
    { text: "Full screen clock", id: "fullScreenClock" },
];

export class ControlsWidgetService extends AbstractWidgetService {
    constructor(errorHandler, listenWS = true) {
        super(BASE_URL_BACKEND, ADMIN_ACTIONS_WS_URL, "", errorHandler, listenWS);
    }

    isMessageRequireReload(data) {
        return controlElements.some(({ id }) => data.startsWith("/api/admin/" + id));
    }

    loadOne(element) {
        return this.apiGet("/" + element).catch(this.errorHandler("Failed to load " + element + " info"));
    }

    loadPresets() {
        return Promise.all(
            controlElements.map(({ id, text }) =>
                this.loadOne(id).then(r => ({ id: id, settings: { text: text }, shown: r.shown }))));
    }
}

export const useControlsWidgetService = (errorHandler, listenWS) => useMemo(
    () => new ControlsWidgetService(errorHandler, listenWS),
    []);
