import React from "react";
import { useSelector } from "react-redux";
import { Transition, TransitionGroup } from "react-transition-group";
import styled, { keyframes } from "styled-components";
import bg from "../../assets/images/bg.jpeg";
import { WIDGET_TRANSITION_TIME } from "../../config";
import { DEBUG } from "../../consts";
import { StatusLightbulbs } from "../organisms/status/StatusLightbulbs";
import Advertisement from "../organisms/widgets/Advertisement";
import Pictures from "../organisms/widgets/Pictures";
import Svg from "../organisms/widgets/Svg";
import Queue from "../organisms/widgets/Queue";
import Scoreboard from "../organisms/widgets/Scoreboard";
import Ticker from "../organisms/widgets/Ticker";
import Statistics from "../organisms/widgets/Statistics";
import TeamView from "../organisms/widgets/TeamView";
import Videos from "../organisms/widgets/Videos";
import PVP from "../organisms/widgets/PVP";
import Locator from "../organisms/widgets/Locator";
import { LOCATIONS } from "icpc-live-v3/src/locations";
import { OVERLAY_VERSION } from "icpc-live-v3/src/config";
import { Queue2 } from "../organisms/widgets/Queue2";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const WidgetWrap = styled.div.attrs(({ left, top, width, height }) => {
    return {
        style: {
            left: left + "px",
            top: top + "px",
            width: width + "px",
            height: height + "px"
        }
    };
})`
  position: absolute;
  overflow: hidden;
  animation: ${props => props.animation} ${WIDGET_TRANSITION_TIME}ms linear;
  animation-fill-mode: forwards;
`;

const MainLayoutWrap = styled.div`
  width: 1920px;
  height: 1080px;
  background: ${DEBUG ? `url(${bg})` : undefined};
`;

const transitionProps = {
    entering: { animation: fadeIn },
    entered: {},
    exiting: { animation: fadeOut },
    exited: {},
};

const WIDGETS = {
    AdvertisementWidget: Advertisement,
    ScoreboardWidget: Scoreboard,
    QueueWidget: Queue,
    PictureWidget: Pictures,
    SvgWidget: Svg,
    VideoWidget: Videos,
    TickerWidget: Ticker,
    StatisticsWidget: Statistics,
    TeamViewWidget: TeamView,
    TeamPVPWidget: PVP,
    TeamLocatorWidget: Locator
};

const WIDGETS2 = {
    AdvertisementWidget: Advertisement,
    ScoreboardWidget: Scoreboard,
    QueueWidget: Queue2,
    PictureWidget: Pictures,
    SvgWidget: Svg,
    VideoWidget: Videos,
    TickerWidget: Ticker,
    StatisticsWidget: Statistics,
    TeamViewWidget: TeamView,
    TeamPVPWidget: PVP,
    TeamLocatorWidget: Locator
};

export const MainLayout = () => {
    const widgets = useSelector(state => state.widgets.widgets);
    return <MainLayoutWrap>
        <StatusLightbulbs compact={true}/>
        <TransitionGroup component={null}>
            {Object.values(widgets).map((obj) => {
                //OVERLAY_VERSION ?
                const Widget = (OVERLAY_VERSION === "2" ? WIDGETS2 : WIDGETS)[obj.type];
                if (Widget === undefined) {
                    return null;
                }
                const overrideLocation = OVERLAY_VERSION === "2" ? (LOCATIONS[obj.type] ?? obj.location) : obj.location;
                return <Transition key={obj.widgetId} timeout={Widget.overrideTimeout ?? WIDGET_TRANSITION_TIME}>
                    {state =>
                        state !== "exited" && <WidgetWrap
                            left={overrideLocation.positionX}
                            top={overrideLocation.positionY}
                            width={overrideLocation.sizeX}
                            height={overrideLocation.sizeY}
                            {...(!Widget.ignoreAnimation && transitionProps[state])}
                        >
                            <Widget widgetData={obj} transitionState={state}/>
                        </WidgetWrap>
                    }
                </Transition>;
            })}
        </TransitionGroup>
    </MainLayoutWrap>;
};

export default MainLayout;
