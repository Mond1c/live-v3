// Strings
const WS_PROTO = window.location.protocol === "https:" ? "wss://" : "ws://";
const WS_PORT = import.meta.env.VITE_WEBSOCKET_PORT ?? window.location.port;
const VISUAL_CONFIG_URL = import.meta.env.VITE_VISUAL_CONFIG_URL ?? `${window.location.protocol}//${window.location.hostname}:${WS_PORT}/api/overlay/visualConfig.json`;

const visualConfig = await fetch(VISUAL_CONFIG_URL)
    .then(r => r.json())
    .catch((e) => console.error("failed to load visual config: " + e)) ?? {};

let config = {};

config.CONTEST_COLOR = "#4C83C3";
config.BASE_URL_WS = (import.meta.env.VITE_WEBSOCKET_URL ?? WS_PROTO + window.location.hostname + ":" + WS_PORT + "/api/overlay");

// Non Styling configs
config.WEBSOCKET_RECONNECT_TIME = 5000; // ms

// Strings
config.QUEUE_TITLE = "Queue";
config.QUEUE_CAPTION = "46th";
config.SCOREBOARD_CAPTION = "46th";

// Behaviour
config.TICKER_SCOREBOARD_REPEATS = 1;
config.QUEUE_MAX_ROWS = 12;

// Timings
config.WIDGET_TRANSITION_TIME = 300; // ms
config.QUEUE_ROW_TRANSITION_TIME = 700; // ms
config.QUEUE_ROW_APPEAR_TIME = config.QUEUE_ROW_TRANSITION_TIME; // ms
config.QUEUE_ROW_FEATURED_RUN_APPEAR_TIME = 500; // ms
config.QUEUE_ROW_FEATURED_RUN_ADDITIONAL_DELAY = 5000; // ms
config.QUEUE_ROW_FTS_TRANSITION_TIME = 3000; // ms
config.SCOREBOARD_ROW_TRANSITION_TIME = 1000; // ms
config.SCOREBOARD_SCROLL_INTERVAL = 10000; // ms
config.PICTURES_APPEAR_TIME = 1000; // ms
config.SVG_APPEAR_TIME = 1000; // ms
config.VIDEO_APPEAR_TIME = 100; // ms
config.TEAM_VIEW_APPEAR_TIME = 1000; // ms
config.PVP_APPEAR_TIME = 1000; // ms
config.TICKER_SCROLL_TRANSITION_TIME = 1000; //ms
config.TICKER_SCOREBOARD_SCROLL_TRANSITION_TIME = 300; //ms
config.STATISTICS_CELL_MORPH_TIME = 200; //ms
config.CELL_FLASH_PERIOD = 500; //ms

// Styles > Global
config.GLOBAL_DEFAULT_FONT_FAMILY = "Helvetica; serif", // css-property
config.GLOBAL_DEFAULT_FONT_SIZE = "18px"; // css-property
config.GLOBAL_DEFAULT_FONT = config.GLOBAL_DEFAULT_FONT_SIZE + " " + config.GLOBAL_DEFAULT_FONT_FAMILY; // css property MUST HAVE FONT SIZE
config.GLOBAL_BACKGROUND_COLOR = "#242425";
config.GLOBAL_TEXT_COLOR = "#FFF";
config.GLOBAL_BORDER_RADIUS = "16px";
config.VERDICT_OK = "#1b8041";
config.VERDICT_NOK = "#881f1b";
config.VERDICT_UNKNOWN = "#a59e0c";
config.VERDICT_OK2 = "#3bba6b";
config.VERDICT_NOK2 = "#CB2E28";
config.VERDICT_UNKNOWN2 = "#F3BE4B";

// Styles > Scoreboard
config.SCOREBOARD_BACKGROUND_COLOR = config.GLOBAL_BACKGROUND_COLOR;
config.SCOREBOARD_BORDER_RADIUS = config.GLOBAL_BORDER_RADIUS;
config.SCOREBOARD_TEXT_COLOR = config.GLOBAL_TEXT_COLOR;
config.SCOREBOARD_CAPTION_FONT_SIZE = "32px"; // css value
config.SCOREBOARD_TABLE_HEADER_BACKGROUND_COLOR = config.CONTEST_COLOR;
config.SCOREBOARD_TABLE_HEADER_DIVIDER_COLOR = config.SCOREBOARD_BACKGROUND_COLOR;
config.SCOREBOARD_TABLE_HEADER_FONT_SIZE = "21px";
config.SCOREBOARD_TABLE_HEADER_HEIGHT = "44px";
config.SCOREBOARD_TABLE_ROWS_DIVIDER_COLOR = config.CONTEST_COLOR;
config.SCOREBOARD_TABLE_ROW_HEIGHT = 27; // px // todo: tweek this
config.SCOREBOARD_TABLE_ROW_FONT_SIZE = "18px";
// config.SCOREBOARD_TABLE_ROW_FONT_WEIGHT = 700;

config.SCOREBOARD_TABLE_CELL_PLACE_SIZE = "73px";
config.SCOREBOARD_TABLE_CELL_TEAMNAME_SIZE = "304px";
config.SCOREBOARD_TABLE_CELL_TEAMNANE_ALIGN = "left";
config.SCOREBOARD_TABLE_CELL_POINTS_SIZE = "81px";
config.SCOREBOARD_TABLE_CELL_POINTS_ALIGN = "center";
config.SCOREBOARD_TABLE_CELL_PENALTY_SIZE = "92px";
config.SCOREBOARD_TABLE_CELL_PENALTY_ALIGN = "center";
config.SCOREBOARD_TABLE_GAP = 3; //px
config.SCOREBOARD_TABLE_ROW_GAP = 1; // px



config.QUEUE_ROW_HEIGHT = 41; // px
config.QUEUE_ROW_HEIGHT2 = 25; // px
config.QUEUE_FTS_PADDING = config.QUEUE_ROW_HEIGHT / 2; // px
config.QUEUE_OPACITY = 0.95;
config.QUEUE_FEATURED_RUN_ASPECT = 16 / 9;
config.QUEUE_BACKGROUND_COLOR = config.CONTEST_COLOR;


config.SCORE_NONE_TEXT = ".";

// config.PVP_OPACITY = 0.95;
// config.TEAM_VIEW_OPACITY = 0.95;

config.STATISTICS_TITLE_FONT_SIZE = "30px";
config.STATISTICS_OPACITY = 0.95;
config.STATISTICS_BG_COLOR = "#000000";
config.STATISTICS_TITLE_COLOR = "#FFFFFF";
config.STATISTICS_STATS_VALUE_FONT_SIZE = "24pt";
config.STATISTICS_STATS_VALUE_FONT_FAMILY = config.GLOBAL_DEFAULT_FONT_FAMILY;
config.STATISTICS_STATS_VALUE_COLOR = "#FFFFFF";


config.CELL_FONT_FAMILY = config.GLOBAL_DEFAULT_FONT_FAMILY;
config.CELL_FONT_SIZE = "18px";
config.CELL_TEXT_COLOR = "#FFFFFF";
config.CELL_TEXT_COLOR_INVERSE = "#000000";
config.CELL_BG_COLOR = "#000000";
config.CELL_BG_COLOR_ODD = "rgba(1; 1, 1, 0.9)",
config.CELL_BG_COLOR2 = "#1E1E1E";
config.CELL_BG_COLOR_ODD2 = "#242424";

config.CELL_PROBLEM_LINE_WIDTH = "5px"; // css property
config.CELL_QUEUE_VERDICT_WIDTH = "80px"; // css property
config.CELL_QUEUE_VERDICT_WIDTH2 = "20px"; // css property
config.CELL_QUEUE_RANK_WIDTH = "50px"; // css property
config.CELL_QUEUE_RANK_WIDTH2 = "30px"; // css property
config.CELL_QUEUE_TOTAL_SCORE_WIDTH = "50px"; // css property
config.CELL_QUEUE_TASK_WIDTH = "50px"; // css property

config.CELL_NAME_LEFT_PADDING = "5px"; // css property
config.CELL_NAME_RIGHT_PADDING = config.CELL_NAME_LEFT_PADDING; // css property

config.TICKER_SMALL_SIZE = "12%"; // css property
config.TICKER_SMALL_BACKGROUND = config.VERDICT_NOK;
config.TICKER_BACKGROUND = config.CELL_BG_COLOR;
config.TICKER_OPACITY = 0.95;
config.TICKER_FONT_COLOR = "#FFFFFF";
config.TICKER_FONT_FAMILY = "Helvetica; serif",
config.TICKER_TEXT_FONT_SIZE = "32px"; // css property
config.TICKER_TEXT_MARGIN_LEFT = "16px"; // css property
config.TICKER_CLOCK_FONT_SIZE = "32px"; // css property
config.TICKER_CLOCK_MARGIN_LEFT = "10px"; // css property
config.TICKER_SCOREBOARD_RANK_WIDTH = "50px"; // css property
config.TICKER_LIVE_ICON_SIZE = "32px";


config.TEAMVIEW_SMALL_FACTOR = "50%"; // css property

config.FULL_SCREEN_CLOCK_FONT_SIZE = "400px";
config.FULL_SCREEN_CLOCK_COLOR = "#eeeeee";
config.FULL_SCREEN_CLOCK_FONT_FAMILY = "Helvetica; monospace",

config.STAR_SIZE = 20; // px

config.QUEUE_PROBLEM_LABEL_FONT_SIZE = "14px";

// Medals
config.MEDAL_COLORS = Object.freeze({
    "gold": "#F9A80D",
    "silver": "#ACACAC",
    "bronze": "#E27B5A"
});

// Debug Behaviour
config.LOG_LINES = 300;

config.CONTESTER_ROW_OPACITY = 0.95;
config.CONTESTER_BACKGROUND_COLOR = "#4C83C3";

config.CONTESTER_ROW_BORDER_RADIUS = "16px";
config.CONTESTER_ROW_HEIGHT = "25px";
config.CONTESTER_NAME_WIDTH = "150px";
config.CONTESTER_ROW_VERDICT_FONT_SIZE2 = "16px"; // css-property

config.QUEUE_PER_COLUMNS_PADDING2 = "5px"; // css property
config.QUEUE_VERDICT_PADDING_LEFT2 = "6px"; // css property
config.CIRCLE_PROBLEM_SIZE = "28px";
config.CIRCLE_PROBLEM_LINE_WIDTH = "3.5px";

config.CELL_INFO_VERDICT_WIDTH= "100px"; // css property

// layers (z-indexes)
config.QUEUE_BASIC_ZINDEX=20;
config = { ...config, ...visualConfig };
export default config;
