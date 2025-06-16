import { classNames } from "~/utils/classNames";
import {
  IconArrowUp,
  IconArrowDown,
  IconArrowsSort,
  IconHome,
  IconRefresh,
  IconCopy,
  IconLogout,
  IconSettings,
  IconArrowBackUp,
  IconPlus,
  IconUsers,
  IconBolt,
  IconWorld,
  IconArrowsDiff,
  IconStack2,
  IconCoin,
  IconDotsVertical,
  IconEyeOff,
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconChevronLeft,
  IconChevronRight,
  IconExclamationCircle,
  IconBrandTypescript,
  IconBrandJavascript,
  IconBrandPython,
  IconLayoutSidebarRight,
  IconClipboardText,
  IconSearch,
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconFilter,
  IconDownload,
  IconAdjustmentsHorizontal,
  IconMenu2,
  IconAdjustments,
  IconPin,
  IconPinned,
  IconAlignLeft2,
  IconServer,
} from "@tabler/icons-react";

const ICON_NAME = {
  at: "at",
  "arrow-back-up": "arrow-back-up",
  "arrows-diff": "arrows-diff",
  bolt: "bolt",
  checkmark: "checkmark",
  "clipboard-text": "clipboard-text",
  "chevron-down": "chevron-down",
  "chevron-left": "chevron-left",
  "chevron-right": "chevron-right",
  // These two are from the tabler package, instead of our own raw SVG
  "chevron-left-package": "chevron-left-package",
  "chevron-right-package": "chevron-right-package",
  "chevron-up": "chevron-up",
  "chevrons-down": "chevrons-down",
  "chevrons-left": "chevrons-left",
  "chevrons-right": "chevrons-right",
  "chevrons-up": "chevrons-up",
  "chevron-pipe-left": "chevron-pipe-left",
  "chevron-pipe-right": "chevron-pipe-right",
  coin: "coin",
  copy: "copy",
  dots: "dots",
  "dots-vertical": "dots-vertical",
  "exclamation-circle": "exclamation-circle",
  "eye-slash": "eye-slash",
  "google-with-color": "google-with-color",
  home: "home",
  lightning: "lightning",
  link: "link",
  lock: "lock",
  logout: "logout",
  number: "number",
  plus: "plus",
  refresh: "refresh",
  search: "search",
  settings: "settings",
  users: "users",
  x: "x",
  world: "world",
  stack: "stack",
  // directly from tabler (note: not yet accurate, but thought I'd the separation process...)
  "arrow-up": "arrow-up",
  "arrow-down": "arrow-down",
  "arrows-sort": "arrows-sort",
  eye: "eye",
  download: "download",
  typescript: "typescript",
  javascript: "javascript",
  python: "python",
  filter: "filter",
  "sidebar-right": "sidebar-right",
  "trending-up": "trending-up",
  "trending-down": "trending-down",
  adjustments: "adjustments",
  "hamburger-menu": "hamburger-menu",
  "adjustments-vertical": "adjustments-vertical",
  pin: "pin",
  "pin-vertical": "pin-vertical",
  format: "format",
  server: "server",
} as const;

const SIZE = {
  "0.5": "0.5",
  "0.625": "0.625",
  "0.75": "0.75",
  "0.875": "0.875",
  "1": "1",
  "1.125": "1.125",
  "1.25": "1.25",
  "1.375": "1.375",
  "1.5": "1.5",
} as const;

type Size = (typeof SIZE)[keyof typeof SIZE];

const SIZE_MULTIPLIER = {
  [SIZE["0.5"]]: 0.5,
  [SIZE["0.625"]]: 0.625,
  [SIZE["0.75"]]: 0.75,
  [SIZE["0.875"]]: 0.875,
  [SIZE["1"]]: 1,
  [SIZE["1.125"]]: 1.125,
  [SIZE["1.25"]]: 1.25,
  [SIZE["1.375"]]: 1.375,
  [SIZE["1.5"]]: 1.5,
} as const;

type IconName = (typeof ICON_NAME)[keyof typeof ICON_NAME];

const STROKE_WIDTH = {
  THIN: "thin",
  NORMAL: "normal",
  SEMI_BOLD: "semi-bold",
  BOLD: "bold",
} as const;

const ICON_COLOR = {
  black: "#000000",
  "brand-neutral": "var(--brand-neutral-text)",
  "brand-neutral-2": "var(--brand-neutral-text-2)",
  "brand-neutral-3": "var(--brand-bg-overlay-3)",
  "brand-success": "var(--brand-success)",
  "brand-warning": "var(--brand-warning)",
  "brand-warning-heavy": "var(--brand-warning-heavy)",
  "brand-error": "var(--brand-error)",
  "brand-error-heavy": "var(--brand-error-heavy)",
  "brand-bg": "var(--brand-bg-page)",
  "brand-primary": "var(--brand-primary)",
  "brand-green-tag-text": "var(--brand-green-tag-text)",
  "brand-red-tag-text": "var(--brand-red-tag-text)",
  "yellow-500": "#eab308",
} as const;

type IconColor = keyof typeof ICON_COLOR;

const STROKE_WIDTH_TO_VALUE = {
  [STROKE_WIDTH.THIN]: 1.5,
  [STROKE_WIDTH.NORMAL]: 2,
  [STROKE_WIDTH.SEMI_BOLD]: 2.5,
  [STROKE_WIDTH.BOLD]: 3,
} as const;

type StrokeWidth = (typeof STROKE_WIDTH)[keyof typeof STROKE_WIDTH];

function Icon({
  name,
  stroke = STROKE_WIDTH.NORMAL,
  color = "brand-neutral",
  size = "1",
}: {
  name: IconName;
  stroke?: StrokeWidth;
  color?: IconColor;
  size?: Size;
}) {
  if (name === ICON_NAME["sidebar-right"]) {
    return (
      <IconLayoutSidebarRight
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.pin) {
    return (
      <IconPin
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.format) {
    return (
      <IconAlignLeft2
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.server) {
    return (
      <IconServer
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["pin-vertical"]) {
    return (
      <IconPinned
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["adjustments-vertical"]) {
    return (
      <IconAdjustments
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.adjustments) {
    return (
      <IconAdjustmentsHorizontal
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["hamburger-menu"]) {
    return (
      <IconMenu2
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }
  if (name === ICON_NAME.download) {
    return (
      <IconDownload
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.filter) {
    return (
      <IconFilter
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.eye) {
    return (
      <IconEye
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["arrow-up"]) {
    return (
      <IconArrowUp
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["arrow-down"]) {
    return (
      <IconArrowDown
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["arrows-sort"]) {
    return (
      <IconArrowsSort
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["trending-up"]) {
    return (
      <IconTrendingUp
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["trending-down"]) {
    return (
      <IconTrendingDown
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.search) {
    return (
      <IconSearch
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.at) {
    return (
      <svg
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 8C5 8.79565 5.31607 9.55871 5.87868 10.1213C6.44129 10.6839 7.20435 11 8 11C8.79565 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79565 5 8 5C7.20435 5 6.44129 5.31607 5.87868 5.87868C5.31607 6.44129 5 7.20435 5 8Z"
          stroke={ICON_COLOR[color]}
          strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.1111 8.00899V9.17566C11.1111 9.69136 11.316 10.1859 11.6806 10.5506C12.0453 10.9152 12.5399 11.1201 13.0555 11.1201C13.5712 11.1201 14.0658 10.9152 14.4305 10.5506C14.7951 10.1859 15 9.69136 15 9.17566V8.00899C15.0019 6.50485 14.5193 5.04009 13.6236 3.8317C12.728 2.62331 11.4669 1.73556 10.0272 1.29996C8.5875 0.864365 7.04579 0.904091 5.63045 1.41325C4.2151 1.92242 3.00141 2.87394 2.16916 4.12685C1.33691 5.37977 0.930367 6.86744 1.00976 8.36949C1.08916 9.87153 1.65026 11.3081 2.60996 12.4663C3.56966 13.6245 4.8769 14.4427 6.33804 14.7998C7.79917 15.157 9.33647 15.0339 10.7222 14.449"
          stroke={ICON_COLOR[color]}
          strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === ICON_NAME.bolt) {
    return (
      <svg
        width={(12.8 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 1V8H15L7 19V12H1L9 1Z"
          stroke={ICON_COLOR[color]}
          strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (
    name === ICON_NAME["chevron-down"] ||
    name === ICON_NAME["chevron-up"] ||
    name === ICON_NAME["chevron-left"] ||
    name === ICON_NAME["chevron-right"]
  ) {
    return (
      <div
        className={classNames({
          "rotate-90": name === ICON_NAME["chevron-left"],
          "rotate-180": name === ICON_NAME["chevron-up"],
          "rotate-[270deg]": name === ICON_NAME["chevron-right"],
        })}
      >
        <svg
          width={14 * SIZE_MULTIPLIER[size]}
          viewBox="0 0 14 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L7 7L13 1"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (name === ICON_NAME["chevron-left-package"]) {
    return (
      <IconChevronLeft
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["chevron-right-package"]) {
    return (
      <IconChevronRight
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["clipboard-text"]) {
    return (
      <IconClipboardText
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (
    name === ICON_NAME["chevrons-down"] ||
    name === ICON_NAME["chevrons-up"] ||
    name === ICON_NAME["chevrons-left"] ||
    name === ICON_NAME["chevrons-right"]
  ) {
    return (
      <div
        className={classNames({
          "rotate-90": name === ICON_NAME["chevrons-left"],
          "rotate-180": name === ICON_NAME["chevrons-up"],
          "rotate-[270deg]": name === ICON_NAME["chevrons-right"],
        })}
      >
        <svg
          width={15 * SIZE_MULTIPLIER[size]}
          viewBox="0 0 15 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_240_2)">
            <path
              d="M1.23077 1.23077L7.38461 7.38462L13.5385 1.23077"
              stroke={ICON_COLOR[color]}
              strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.23077 8.61539L7.38461 14.7692L13.5385 8.61539"
              stroke={ICON_COLOR[color]}
              strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    );
  }

  if (name === ICON_NAME["chevron-pipe-left"]) {
    return (
      <IconChevronLeftPipe
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["chevron-pipe-right"]) {
    return (
      <IconChevronRightPipe
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.copy) {
    return (
      <IconCopy
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["dots-vertical"]) {
    return (
      <IconDotsVertical
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.dots) {
    return (
      <svg
        width={18 * SIZE_MULTIPLIER[size]}
        height={5 * SIZE_MULTIPLIER[size]}
        viewBox="0 0 18 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M1.8 2.69999C1.8 2.93868 1.89482 3.1676 2.0636 3.33638C2.23239 3.50517 2.4613 3.59999 2.7 3.59999C2.93869 3.59999 3.16761 3.50517 3.3364 3.33638C3.50518 3.1676 3.6 2.93868 3.6 2.69999C3.6 2.46129 3.50518 2.23237 3.3364 2.06359C3.16761 1.89481 2.93869 1.79999 2.7 1.79999C2.4613 1.79999 2.23239 1.89481 2.0636 2.06359C1.89482 2.23237 1.8 2.46129 1.8 2.69999Z"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.1 2.69999C8.1 2.93868 8.19482 3.1676 8.3636 3.33638C8.53239 3.50517 8.76131 3.59999 9 3.59999C9.2387 3.59999 9.46761 3.50517 9.6364 3.33638C9.80518 3.1676 9.9 2.93868 9.9 2.69999C9.9 2.46129 9.80518 2.23237 9.6364 2.06359C9.46761 1.89481 9.2387 1.79999 9 1.79999C8.76131 1.79999 8.53239 1.89481 8.3636 2.06359C8.19482 2.23237 8.1 2.46129 8.1 2.69999Z"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.4 2.69999C14.4 2.93868 14.4948 3.1676 14.6636 3.33638C14.8324 3.50517 15.0613 3.59999 15.3 3.59999C15.5387 3.59999 15.7676 3.50517 15.9364 3.33638C16.1052 3.1676 16.2 2.93868 16.2 2.69999C16.2 2.46129 16.1052 2.23237 15.9364 2.06359C15.7676 1.89481 15.5387 1.79999 15.3 1.79999C15.0613 1.79999 14.8324 1.89481 14.6636 2.06359C14.4948 2.23237 14.4 2.46129 14.4 2.69999Z"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  if (name === ICON_NAME["exclamation-circle"]) {
    return (
      <IconExclamationCircle
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["eye-slash"]) {
    return (
      <IconEyeOff
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.home) {
    return (
      <IconHome
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.link) {
    return (
      <svg
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_217_2)">
          <path
            d="M5.33334 10.6667L10.6667 5.33334"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7.11111 2.66666L7.52267 2.19022C8.35628 1.35673 9.48684 0.888528 10.6657 0.888611C11.8445 0.888694 12.975 1.35706 13.8084 2.19066C14.6419 3.02427 15.1101 4.15483 15.1101 5.33364C15.11 6.51245 14.6416 7.64295 13.808 8.47644L13.3333 8.88888"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.88889 13.3333L8.536 13.808C7.69267 14.6419 6.55448 15.1097 5.36845 15.1097C4.18241 15.1097 3.04422 14.6419 2.20089 13.808C1.78521 13.397 1.4552 12.9076 1.22997 12.3681C1.00474 11.8287 0.888763 11.2499 0.888763 10.6653C0.888763 10.0808 1.00474 9.50199 1.22997 8.96254C1.4552 8.4231 1.78521 7.93369 2.20089 7.52267L2.66667 7.11111"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_217_2">
            <rect
              width={(16 * SIZE_MULTIPLIER[size]).toString()}
              height={(16 * SIZE_MULTIPLIER[size]).toString()}
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (name === ICON_NAME.lock) {
    return (
      <svg
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(20 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_243_2)">
          <path
            d="M1 11C1 10.4696 1.21071 9.96086 1.58579 9.58579C1.96086 9.21071 2.46957 9 3 9H13C13.5304 9 14.0391 9.21071 14.4142 9.58579C14.7893 9.96086 15 10.4696 15 11V17C15 17.5304 14.7893 18.0391 14.4142 18.4142C14.0391 18.7893 13.5304 19 13 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V11Z"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 14C7 14.2652 7.10536 14.5196 7.29289 14.7071C7.48043 14.8946 7.73478 15 8 15C8.26522 15 8.51957 14.8946 8.70711 14.7071C8.89464 14.5196 9 14.2652 9 14C9 13.7348 8.89464 13.4804 8.70711 13.2929C8.51957 13.1054 8.26522 13 8 13C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14Z"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 9V5C4 3.93913 4.42143 2.92172 5.17157 2.17157C5.92172 1.42143 6.93913 1 8 1C9.06087 1 10.0783 1.42143 10.8284 2.17157C11.5786 2.92172 12 3.93913 12 5V9"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  if (name === ICON_NAME.refresh) {
    return (
      <IconRefresh
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.lightning) {
    return (
      <IconBolt
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.x) {
    return (
      <svg
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 1L1 17"
          stroke={ICON_COLOR[color]}
          strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1 1L17 17"
          stroke={ICON_COLOR[color]}
          strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === ICON_NAME.number) {
    return (
      <svg
        width={(15 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_219_16)">
          <path
            d="M0.9375 5.33334H14.0625"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0.9375 10.6667H14.0625"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5625 0.888885L2.8125 15.1111"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.1875 0.888885L8.4375 15.1111"
            stroke={ICON_COLOR[color]}
            strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_219_16">
            <rect
              width={(15 * SIZE_MULTIPLIER[size]).toString()}
              height={(16 * SIZE_MULTIPLIER[size]).toString()}
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (name === ICON_NAME.checkmark) {
    return (
      <svg
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 17 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 6L6 11L16 1"
          stroke={ICON_COLOR[color]}
          strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === ICON_NAME["google-with-color"]) {
    return (
      <svg
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_222_2)">
          <path
            d="M15.68 8.18181C15.68 7.61453 15.6291 7.06909 15.5346 6.54541H8V9.63997H12.3054C12.12 10.64 11.5564 11.4872 10.7091 12.0545V14.0618H13.2946C14.8073 12.6691 15.68 10.6181 15.68 8.18181Z"
            fill="#4285F4"
          />
          <path
            d="M8 16C10.16 16 11.9709 15.2836 13.2945 14.0619L10.709 12.0546C9.99272 12.5346 9.07632 12.8182 8 12.8182C5.91632 12.8182 4.15272 11.4109 3.5236 9.52002H0.850876V11.5927C2.16728 14.2073 4.87272 16 8 16Z"
            fill="#34A853"
          />
          <path
            d="M3.5236 9.52001C3.3636 9.04001 3.27272 8.52729 3.27272 8.00001C3.27272 7.47273 3.3636 6.96001 3.5236 6.48001V4.40729H0.85088C0.30912 5.48729 0 6.70913 0 8.00001C0 9.29089 0.30912 10.5127 0.85088 11.5927L3.5236 9.52001Z"
            fill="#FBBC04"
          />
          <path
            d="M8 3.18184C9.17448 3.18184 10.229 3.58544 11.0582 4.37816L13.3527 2.0836C11.9673 0.79272 10.1563 0 8 0C4.87272 0 2.16728 1.79272 0.850876 4.40728L3.5236 6.48C4.15272 4.58912 5.91632 3.18184 8 3.18184Z"
            fill="#E94235"
          />
        </g>
        <defs>
          <clipPath id="clip0_222_2">
            <rect
              width={(16 * SIZE_MULTIPLIER[size]).toString()}
              height={(16 * SIZE_MULTIPLIER[size]).toString()}
              fill="white"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (name === ICON_NAME.logout) {
    return (
      <IconLogout
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.settings) {
    return (
      <IconSettings
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["arrow-back-up"]) {
    return (
      <IconArrowBackUp
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.plus) {
    return (
      <IconPlus
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.users) {
    return (
      <IconUsers
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.world) {
    return (
      <IconWorld
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME["arrows-diff"]) {
    return (
      <IconArrowsDiff
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.stack) {
    return (
      <IconStack2
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.coin) {
    return (
      <IconCoin
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.typescript) {
    return (
      <IconBrandTypescript
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.javascript) {
    return (
      <IconBrandJavascript
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.python) {
    return (
      <IconBrandPython
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }
}

export default Icon;
