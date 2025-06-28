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
  IconArrowUpRight,
  IconCode,
  IconShieldCheckFilled,
  IconTrash,
  IconBook2,
  IconScript,
  IconFlag,
  IconBrandNextjs,
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
  fastify: "fastify",
  koa: "koa",
  "python-brand-color": "python-brand-color",
  django: "django",
  flask: "flask",
  "fastapi-brand-color": "fastapi-brand-color",
  hono: "hono",
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
  "external-link": "external-link",
  code: "code",
  "shield-check-filled": "shield-check-filled",
  trash: "trash",
  book: "book",
  script: "script",
  flag: "flag",
  nextjs: "nextjs",
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
  "white-btn": "rgba(255, 255, 255, 0.95)",
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
  "brand-primary-heavy": "var(--brand-primary-heavy)",
  "brand-orange-tag-text": "var(--brand-orange-tag-text)",
  "brand-green-tag-text": "var(--brand-green-tag-text)",
  "brand-red-tag-text": "var(--brand-red-tag-text)",
  "brand-blue-tag-text": "var(--brand-blue-tag-text)",
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

  if (name === ICON_NAME.script) {
    return (
      <IconScript
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.flag) {
    return (
      <IconFlag
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.book) {
    return (
      <IconBook2
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.trash) {
    return (
      <IconTrash
        size={16 * SIZE_MULTIPLIER[size]}
        color={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
      />
    );
  }

  if (name === ICON_NAME.code) {
    return (
      <IconCode
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

  if (name === ICON_NAME["external-link"]) {
    return (
      <IconArrowUpRight
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

  if (name === ICON_NAME["shield-check-filled"]) {
    return (
      <IconShieldCheckFilled
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

  if (name === ICON_NAME.nextjs) {
    return (
      <IconBrandNextjs
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

  if (name === ICON_NAME.fastify) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 128 128"
      >
        <path d="m89.663 24.816l-.162-.253l-.001.001l-.006.004l-.026.016l-.103.064a60 60 0 0 1-1.901 1.121a69 69 0 0 1-5.182 2.645c-4.196 1.919-9.503 3.791-14.045 3.691c-2.294-.051-4.2-.242-5.997-.431l-.294-.031c-1.686-.178-3.294-.347-5.041-.384c-3.707-.078-8.022.443-15.121 2.707c-7.158 2.282-11.743 6.925-15.043 11.348c-1.281 1.717-2.374 3.407-3.345 4.911q-.416.646-.806 1.241c-1.18 1.797-2.17 3.17-3.143 3.876c-2.054 1.489-6.299 4.657-10.029 7.45a4308 4308 0 0 0-4.874 3.656L3.03 67.586l-.415.313l-.108.082l-.028.021l-.007.005l-.002.001l.134.178l-.134-.177l-.145.109l.029.179l.028.172l.056.343l.331-.105l10.46-3.331c-.395.422-.931 1.01-1.611 1.792c-1.614 1.858-4.039 4.81-7.323 9.223l-.071-.066l-.664-.611l.167.886l.012.064l.011.059l.033.05l.073-.048l-.073.048l.001.002l.003.005l.012.019l.048.072a24 24 0 0 0 .882 1.198a24 24 0 0 0 2.483 2.721c1.026.954 2.232 1.872 3.533 2.453c1.303.582 2.717.834 4.138.425h.001c.52-.152 1.094-.39 1.709-.697c2.15 1.181 4.939 2.332 8.02 2.654l.751.079l-.492-.573l-.001-.001l-.004-.005l-.018-.02l-.068-.081a55 55 0 0 1-1.165-1.444a48 48 0 0 1-2.4-3.368l.833-.541l4.288 1.576l.458.168l-.057-.485l-.436-3.716l3.933 1.445l.471.173l-.071-.497l-.509-3.568q.726-.376 1.445-.708l.131-.059l.036-.137l4.498-17.014l17.815-12.152l-1.125 2.83v.001c-1.875 4.61-4.568 7.452-6.786 9.141a17 17 0 0 1-2.813 1.747a11 11 0 0 1-1.059.449l-.056.019l-.005.002l-.008.003l-.003.001l-.009.003l-.009.003l-2.975 1.128l-.073.026l-.05.059l-.345.405c-.926 1.084-1.643 1.923-2.202 3.389c-.621 1.628-1.046 4.02-1.425 8.409l-.036.419l.408-.103c1.753-.44 3.402-.539 4.879-.141c3.893 1.049 6.525 3.923 7.92 6.876c.697 1.476 1.08 2.961 1.159 4.231c.08 1.282-.152 2.293-.622 2.874c-.509.629-1.733 1.721-3.318 3.035h-3.433l-.005.295l-.042 2.487l-.002.002l-.138.107h-3.493l-.005.295l-.038 2.422l-.416.313l-.252.19c-1.454.002-3.115-.618-4.447-1.268a21 21 0 0 1-2.146-1.211l-.127-.084l-.032-.022l-.006-.004l-.001-.001l-.002-.001l-.47-.323v.571c0 1.295.534 2.905 1.048 4.164a28 28 0 0 0 .949 2.06l.002.003l-.123.088l.262.175l.085.157l.089-.042l.024.016l.277.175a32 32 0 0 0 4.483 2.301c1.378.569 2.931 1.078 4.477 1.314c1.544.236 3.102.201 4.476-.338c1.192-.467 2.838-1.417 4.781-2.632c1.336-.835 2.823-1.804 4.413-2.839q1.094-.714 2.246-1.459c4.885-3.159 10.465-6.638 15.63-8.874l31.427-8.279l.148-.039l.055-.143l4.147-10.744l.211-.547l-.567.15l-23.591 6.215V65.12l27.898-7.35l.148-.039l.055-.143l4.147-10.744l.211-.547l-.567.15L85.4 54.848v-9.032l36.183-9.534l.148-.039l.055-.143l3.863-10.004l.035-.092l-.026-.095l-.168-.62l-.078-.287l-.288.076l-37.453 9.868c1.73-2.73 2.328-5.184 2.48-7.005c.082-.982.033-1.778-.037-2.332a8 8 0 0 0-.147-.814l-.012-.046l-.004-.013l-.001-.004v-.001zm0 0l-.162-.253l.336-.214l.113.382zm-.288.085q0-.002 0 0M64.657 56.695l7.017-1.85l-2.232 5.783l-7.017 1.85zm4.357 6.619l-2.232 5.787l-7.017 1.851l2.233-5.788zm10.077-2.163l-2.232 5.787l-7.017 1.851l2.233-5.788z"></path>
        <path
          fill="#fff"
          d="M43.745 104.119a12 12 0 0 1-1.774-.142c-1.386-.211-2.916-.66-4.546-1.333a32.4 32.4 0 0 1-4.528-2.324l-.164-.103l-.196.093l-.184-.342l-.562-.374l.267-.19l-.122-.246c-.179-.367-.45-.944-.721-1.609c-.71-1.738-1.07-3.178-1.07-4.277V92.13l.978.673l.124.082a21 21 0 0 0 2.114 1.193c1.133.553 2.773 1.21 4.216 1.237l.076-.057l.095-.072l.299-.224l.045-2.866h3.631l.048-2.891h3.621c1.674-1.39 2.748-2.374 3.193-2.924c.426-.527.628-1.5.556-2.667c-.08-1.282-.481-2.746-1.131-4.121a13.3 13.3 0 0 0-2.956-4.06a11.3 11.3 0 0 0-4.772-2.655c-1.351-.364-2.897-.317-4.728.142l-.816.206l.073-.839c.374-4.321.792-6.781 1.444-8.49c.577-1.514 1.317-2.38 2.254-3.477l.089-.105l.254-.299l.101-.119l.144-.055l2.994-1.135l.031-.01l.049-.016a11 11 0 0 0 1.026-.436a16.4 16.4 0 0 0 2.762-1.716a19.5 19.5 0 0 0 3.469-3.422c1.282-1.621 2.359-3.484 3.2-5.539v-.007l.024-.052l.76-1.912l-16.915 11.537l-4.469 16.906l-.072.274l-.258.118c-.397.183-.805.381-1.243.604l.622 4.35l-4.418-1.623l.493 4.2l-5.064-1.861l-.456.296a47 47 0 0 0 2.222 3.095c.388.499.704.888.901 1.126l.257.309l.073.086l.007.009l.08.078v.016l.913 1.062l-1.502-.158c-2.609-.273-5.298-1.153-7.996-2.615a10.4 10.4 0 0 1-1.593.639l-.027.008l-.01.003l-.03.009c-1.345.376-2.792.225-4.304-.45c-1.175-.525-2.391-1.368-3.615-2.507a25 25 0 0 1-3.221-3.698l-.087-.124l-.006.004l-.159-.244l-.052-.069v-.011l-.019-.028l-.033-.181l-.331-1.775l1.155 1.062c3.307-4.431 5.702-7.32 7.138-8.973q.444-.511.855-.968L2.86 68.992l-.663.21L2 67.987l.435-.327l.193-.145l.79-.594l.948-.712c1.145-.86 2.92-2.192 4.874-3.656c3.399-2.546 7.899-5.905 10.033-7.453c.912-.661 1.886-1.996 3.068-3.797c.259-.395.528-.811.805-1.239c.97-1.501 2.069-3.201 3.356-4.927c1.971-2.642 3.975-4.778 6.126-6.531a27.6 27.6 0 0 1 9.067-4.924c6.269-2 10.82-2.813 15.218-2.721c1.76.037 3.366.206 5.066.386l.294.031c1.957.206 3.757.38 5.972.429c2.044.045 4.421-.317 7.063-1.077c2.132-.613 4.437-1.484 6.851-2.587a70 70 0 0 0 5.159-2.633a56 56 0 0 0 1.962-1.16l.072-.046l.66-.421l.311 1.052l-.015.004c.029.14.069.356.104.634c.095.753.108 1.559.038 2.394c-.182 2.191-.9 4.374-2.137 6.501l37.311-9.83l.376 1.382l-.07.183l-3.973 10.291l-.297.078l-35.96 9.475v8.412l32.642-8.602l-.422 1.095l-4.257 11.03l-.297.078l-27.675 7.292v8.408l23.215-6.115l1.135-.299l-.422 1.095l-4.257 11.031l-.297.078l-31.404 8.273c-5.05 2.189-10.465 5.543-15.565 8.842c-.732.473-1.45.941-2.145 1.394l-.124.081c-1.575 1.025-3.063 1.994-4.394 2.826c-2.262 1.415-3.752 2.234-4.831 2.657c-.844.33-1.8.496-2.857.496M32.944 99.64l.271.171a32 32 0 0 0 4.439 2.278c1.586.655 3.068 1.091 4.407 1.295c1.674.255 3.128.147 4.321-.321c1.043-.409 2.502-1.213 4.732-2.607c1.327-.83 2.812-1.797 4.385-2.821l.124-.081a706 706 0 0 1 2.147-1.395c5.129-3.317 10.578-6.691 15.674-8.898l.021-.009l.022-.006l31.427-8.279l4.146-10.744l-23.967 6.314v-9.649l28.122-7.409l4.147-10.744L85.1 55.237v-9.653l36.407-9.593l3.863-10.004l-.168-.619L87.01 35.43l.409-.645c1.423-2.245 2.242-4.556 2.434-6.869c.082-.989.026-1.78-.036-2.269a8 8 0 0 0-.087-.538l-.2.059l-.122-.19l-.002-.003l-.043.027l-.034.196l-.174-.026l-.013-.035l-.023.014c-.471.285-.978.581-1.508.88a70 70 0 0 1-5.204 2.657c-2.441 1.116-4.774 1.997-6.935 2.618c-2.7.776-5.137 1.146-7.242 1.1c-2.238-.049-4.051-.225-6.021-.432l-.294-.031c-1.687-.178-3.281-.346-5.016-.382c-4.328-.091-8.821.714-15.023 2.693c-3.268 1.042-6.17 2.618-8.87 4.818c-2.112 1.721-4.083 3.822-6.024 6.424c-1.276 1.71-2.369 3.401-3.333 4.894c-.277.428-.547.846-.807 1.242c-1.253 1.909-2.229 3.237-3.218 3.954c-2.131 1.545-6.628 4.903-10.025 7.447a4107 4107 0 0 0-4.873 3.656l-.947.712l-.79.594l-.192.144l-.142.106l-.006-.008l.03.184l11.557-3.68l-.788.84a65 65 0 0 0-1.603 1.784c-1.459 1.679-3.911 4.638-7.309 9.205l-.198.266l-.183-.167v.121l.122.174q.318.449.689.92c.54.688 1.404 1.712 2.451 2.687c1.176 1.094 2.337 1.901 3.451 2.399c1.383.618 2.697.758 3.907.418l.038-.019h.028a10.5 10.5 0 0 0 1.619-.665l.14-.07l.138.076c2.648 1.454 5.284 2.333 7.835 2.611v-.078l-.021-.025a49 49 0 0 1-1.172-1.454a47 47 0 0 1-2.416-3.39l-.162-.251l.251-.162l.832-.541l.126-.082l4.43 1.628l-.493-4.201l4.391 1.613l-.54-3.779l.19-.098c.518-.267.995-.5 1.457-.714l4.526-17.122l18.717-12.767l-1.466 3.687v.009l-.025.053c-.865 2.126-1.977 4.056-3.305 5.734a20 20 0 0 1-3.576 3.528a17 17 0 0 1-2.864 1.778a12 12 0 0 1-1.091.463l-.061.021l-.021.007l-2.974 1.128l-.255.3l-.09.105c-.935 1.094-1.61 1.884-2.15 3.301c-.63 1.654-1.038 4.067-1.407 8.328c1.932-.485 3.578-.531 5.03-.14a11.9 11.9 0 0 1 5.023 2.793a13.9 13.9 0 0 1 3.091 4.244c.682 1.443 1.103 2.984 1.187 4.34c.083 1.334-.161 2.429-.688 3.081c-.484.599-1.583 1.605-3.36 3.078l-.083.069H42.36l-.044 2.613l-.123.118l-.014.007l-.02.015l-.094.073l-.082.064h-3.302l-.04 2.568l-.116.088q-.21.16-.418.314l-.095.072l-.156.117l-.08.061h-.107c-.874 0-2.374-.226-4.572-1.299a21 21 0 0 1-2.178-1.229l-.131-.087l-.044-.029c0 1.007.355 2.408 1.026 4.05a26 26 0 0 0 .916 1.995l.006.006l.021.047l.089.177l.009.006l.003.006l.101.063zm26.33-28.249l2.499-6.478l7.732-2.038l-2.498 6.477zm2.948-5.976l-1.966 5.097l6.302-1.662l1.966-5.096zm7.128 3.813l2.499-6.478l7.732-2.039l-2.498 6.477zm2.949-5.976l-1.966 5.097l6.302-1.662l1.966-5.096zm-10.366-.334l2.499-6.474l7.732-2.039l-2.499 6.473zm2.948-5.972l-1.966 5.092l6.302-1.662l1.965-5.092z"
        ></path>
      </svg>
    );
  }

  if (name === ICON_NAME.koa) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M0 5.587v12.757h1.19v-4.099l.46-.527l3.147 4.626h1.19L2.33 12.97l2.773-3.13h-.17L1.19 14.058v-8.47zm11.039 4.185q-1.785 0-2.96 1.173q-1.155 1.175-1.156 3.3q0 2.127 1.122 3.147t2.909 1.02q1.803 0 2.96-1.173q1.173-1.174 1.173-3.3t-1.122-3.147t-2.926-1.02m8.896 0a7.3 7.3 0 0 0-3.079.697l.068.12q.392-.222 1.225-.443q.85-.238 1.48-.238t1.02.17q.39.153.545.374q.152.221.238.46q.102.22.068.374c.007.97 0 1.988 0 2.976a9 9 0 0 0-.834-.034q-.459 0-1.003.051q-2.195.136-2.841.749q-.323.306-.391.561q-.069.255-.068.476q0 .204.034.409q.289 1.939 2.432 1.939q1.838 0 2.67-1.514v.357q0 .272.392.646q.424.443 1.582.443H24v-.136h-.527l-.187-.034q-.204-.018-.409-.273q-.186-.271-.187-.765v-5.698q0-.544-.442-1.038c-.498-.557-1.564-.624-2.313-.63zm-8.862.136q1.292 0 2.075.986q.783.987.783 3.045q0 2.04-.85 3.198q-.852 1.14-2.144 1.14t-2.075-.987t-.783-3.028q0-2.058.85-3.198q.851-1.155 2.144-1.156m9.491 4.456q.477 0 .936.034v2.058q-.051.58-.783 1.208a2.42 2.42 0 0 1-1.616.613q-1.36 0-1.513-1.803a3 3 0 0 1-.02-.307q0-.748.392-1.173q.39-.426 1.684-.579c.314-.038.64-.039.92-.05z"
        ></path>
      </svg>
    );
  }

  if (name === ICON_NAME["python-brand-color"]) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 24 24"
      >
        <path
          fill="#0288d1"
          d="M9.86 2A2.86 2.86 0 0 0 7 4.86v1.68h4.29c.39 0 .71.57.71.96H4.86A2.86 2.86 0 0 0 2 10.36v3.781a2.86 2.86 0 0 0 2.86 2.86h1.18v-2.68a2.85 2.85 0 0 1 2.85-2.86h5.25c1.58 0 2.86-1.271 2.86-2.851V4.86A2.86 2.86 0 0 0 14.14 2zm-.72 1.61c.4 0 .72.12.72.71s-.32.891-.72.891c-.39 0-.71-.3-.71-.89s.32-.711.71-.711"
        ></path>
        <path
          fill="#fdd835"
          d="M17.959 7v2.68a2.85 2.85 0 0 1-2.85 2.859H9.86A2.85 2.85 0 0 0 7 15.389v3.75a2.86 2.86 0 0 0 2.86 2.86h4.28A2.86 2.86 0 0 0 17 19.14v-1.68h-4.291c-.39 0-.709-.57-.709-.96h7.14A2.86 2.86 0 0 0 22 13.64V9.86A2.86 2.86 0 0 0 19.14 7zM8.32 11.513l-.004.004l.038-.004zm6.54 7.276c.39 0 .71.3.71.89a.71.71 0 0 1-.71.71c-.4 0-.72-.12-.72-.71s.32-.89.72-.89"
        ></path>
      </svg>
    );
  }

  if (name === ICON_NAME["django"]) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 32 32"
      >
        <path d="M22 2h4v4h-4zm0 8v12.13A3.88 3.88 0 0 1 18.13 26H18v4h.13A7.866 7.866 0 0 0 26 22.13V10Zm-8-8h4v20h-4z"></path>
        <path d="M11.838 12A2.165 2.165 0 0 1 14 14.162v4.955l-.77.257a5.03 5.03 0 0 1-2.812.108A3.19 3.19 0 0 1 8 16.384v-.547A3.84 3.84 0 0 1 11.838 12m0-4A7.84 7.84 0 0 0 4 15.837v.547a7.19 7.19 0 0 0 5.448 6.978a9.03 9.03 0 0 0 5.047-.194L18 22v-7.838A6.16 6.16 0 0 0 11.838 8"></path>
      </svg>
    );
  }

  if (name === ICON_NAME["flask"]) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M153.001 434.531c-53.682-31.457-99.53-107.4-123.226-174.012c-9.518-28.896-12.778-59.876-25.048-87.656c-12.835-20.176 2.2-42.233 24.3-48.646c9.84-1.889 27.142-11.17 6.257-4.536c-18.723 13.737-20.535-12.47-1.336-14.13c13.103-1.74 17.927-12.467 13.446-22.123c-14.065-9.172 34.106-19.253 9.868-32.939c-25.25-27.24 35.318-32.485 20.375-1.547c-3.577 23.79 42.322-4.36 31.673 23.111c10.824 13.193 40.533 3.003 39.796 21.512c15.768 1.084 21.18 14.35 35.982 15.37c15.34 6.927 43.151 12.386 48.371 29.674c-15.22 12.05-50.463-24.89-52.156 8.464c6.422 117.654 12.507 158.22 69.32 219.855c38.268 43.3 90.852 63.719 135.244 70.988c9.562-7.314 26.444-34.505 41.36-23.04c.709 12.884-29.606 26.932-1.425 25.509c16.547-4.992 28.025 12.797 41.651-3.25c12.555 14.872 52.18-9.5 43.248 20.896c-12.078 7.792-29.695 3.083-41.793 13.804c-19.948-9.963-35.83 8.915-57.913 6.527c-85.133 14.9-196.073 1.46-257.994-43.831m100.061 36.821c37.114 5.162 75.442 13.102 112.689 5.86c-16.858-7.613-34.286 2.965-51.08-5.444c-20.142 4.335-41.757-1.104-62.234-3.781c-23.286-10.373-48.416-17.505-70.222-30.968c-27.248-9.953 14.092 12.763 21.45 14.603c17.034 9.668-18.73-4.957-23.773-8.976c-14.266-8.003-16.445-6.137-1.773 1.99c22.878 14.173 51.55 23.782 74.943 26.716m-106.228-50.599c20.684 7.662-.092-14.546-9.57-13.255c-4.2-7.286-16.044-11.888-7.689-15.802c-15.03 5.218-15.744-19.842-22.81-16.262c-15.9-5.02-6.188-22.806-25.128-33.729c-1.729-11.508-18.818-21.49-24.268-38.85c-2.408-8.888-19.307-34.412-8.926-10.658c8.84 22.866 24.392 42.449 37.334 62.01c10.05 18.623 21.916 38.087 40.218 49.705c6.17 5.918 12.126 14.986 20.839 16.841m26.638-36.043c-11.317-6.033-35.955-9.155-18.569 4.646c11.161 4.51 39.606 6.698 18.57-4.646m18.97 23.984c24.306 6.876-20.44-15.371-5.998-2.53zm.205-12.88c17.658 2.277-21.01-12.01-3.874-1.278zm61.37 37.735c16.486-9.856 11.051 23.08 27.97 2.782c16.688-12.185-14.412 15.065 6.156 2.173c14.874-9.949 36.845 4.716 50.724 9.5c9.982-.49 19.685 8.632 29.917 3.083c19.698-5.306-38.518-7.87-23.257-17.282c-18.024 5.245-31.34-6.254-40.209-17.798c-20.217-4.669-43.592-15.005-53.682-32.896c-4.114-6.718 5.943.946-3.55-10.034c-12.183-10.836-18.266-23.136-26.444-36.307c-9.77-5.212-10.908-20.552-11.896-.514c.078-12.646-11.795-21.158-14.693-17.62c-.052-12.18 12.706-6.074 3.775-15.086c-1.922-12.623-8.252-25.777-10.154-40.029c-2.956-6.87-.416-21.584-10.089-6.032c-3.524 16.437-1.17-20.198 4.31-8.118c7.193-12.327-2.582-10.877-2.982-9.165c4.685-10.402 2.966-25.155-1.223-19.527c2.497-11.023 3.945-40.57-3.736-35.335c4.656-11.527 8.83-52.748-11.382-37.032c-8.192.115-22.377 2.974-29.082 6.308c21.024 11.59-2.115 4.186-10.673 2.344c-1.116 10.723-9.592 6.085-20.182 6.19c16.914 2.093-8.237 17.3-17.94 11.393c-12.603 6.023 10.875 21.058.252 25.706c1.306 7.008-19.306-2.53-17.688 13.654c-12.234-5.147-1.684 19.198 4.437 10.965c20.808 5.631 14.648 18.47 15.178 30.667c-3.39 7.107-16.739-16.705-2.973-15.602c-10.86-17.642-12.013-6.377-21.038 1.819c-2.099.595 23.02 11.66 7.256 17.133c13.869 2.14 14.263 14.276 17.087 21.956c8.335 8.682 6.63-9.587 16.603.846c-6.311-9.295-33.431-26.19-11.596-20.771c-.117-9.356-3.95-16.9 2.74-16.717c6.625-11.997-6.938 29.58 7.995 14.333c4.133-1.805 5.157-12.012 12.587.964c10.792 10.616 3.898 18.309-11.325 8.588c2.724 9.24 20.364 12.541 17.05 26.99c3.514 12.706 8.43 8.026 12.716 7.291c3.362 12.347 5.271 3.268 5.43-2.607c15.395 3.295 11.789 12.395 16.606 18.752c10.607 4.788-15.183-32.454 3.028-11.198c19.16 17.298 7.29 23.261-10.009 21.748c14.388 1.178 14.69 13.994 28.005 14.165c11.572 5.967 20.693 28.354-.704 18.913c-12.065-7.486-33.558-14.714-12.108-1.987c5.077 3.214 35.545 14.663 54.652 26.178c10.579 7.232 19.582 20.943 24.765 23.156c-11.493 5.49-34.634-4.383-17.45-7.409c-10.719-1.952-22.402-7.45-12.508 5.982c8.508 7.779 30.928 6.517 34.907 7.342c-3.373 7.433-9.162 8.024.139 8.6c-10.376 5.53 3.327 6.386 4.288 9.545m-22.337-68.123c-6.824-10.76-5.192 1.606 1.12 8.207c10.09 12 2.379-6.802-1.12-8.207m-37.672-55.658s1.682-11.35-3.507-12.605c-5.19-1.256-2.33.834 1.822 9.819c.99 2.143 1.602 2.886 1.594 2.837m-56.712-43.072c-5.155-11.545 2.453-5.276 1.345-10.2c-2.38-4.95-25.508-31.236-14.973-11.391c9.534 23.673-5.998-2.972-7.618-11.038c-1.791 4.953 3.772 21.176 7.135 26.705c8.561 13.185 4.71-7.22 14.11 5.924m-47.363-45.524c-13.386-11.26 4.127 5.55-1.309 5.338c-14.107-10.303-8.34-3.004-.372 4.914c8.632 12.827 15.757-7.686 1.681-10.252m6.873 1.936c25.322 6.957-26.949-24.436-3.785-3.822zm70.076 29.93c-7.268.147 3.014-15.827-6.73-12.675c-3.419-24.828-10.786 11.474-.762 17.484c3.095 8.893 6.346 5.27 7.492-4.81m-59.785-35.319c33.717 15.562-24.413-25.739-9.532-5.207c1.769 3.957 6.008 4.286 9.532 5.207m3.864-8.066c25.537 10.556-2.272-6.869-11.116-4.977c2.23 3.263 8.278 1.836 11.116 4.977m3.42-9.555c8.29-1.656-1.1-4.314-6.054-8.25c-11.465-17.223 1.705 1.39-1.898 6.677c4.771 4.69 20.99 13.075 7.951 1.573m58.647-26.721c-3.385 17.891-6.838 10.43-1.985-2.91c-1.161-17.12-11.565 10.484-6.967 18.587c7.602 12.109 15.204-29.758 8.952-15.677m10.109 213.016c13.167 3.379 13.1-2.048 1.2-3.66c-6.402-5.955-26.599-12.271-8.521-.74c1.197 3.033 4.98 2.963 7.32 4.4m-46.75-31.05c7.254 5.409 27.323 15.33 10.334 2.058c5.728-6.654-10.963-10.197-5.426-14.648c-14.084-8.618-11.11-7.852-1.244-7.58c-16.925-7.566 2.444-7 1.532-10.877c-6.527-1.289-32.417-11.508-17.186.84c-15.484-7.895-3.69 2.94-8.37 1.795c-15.833-4.317 14.1 12.059-2.514 7.994c9.083 7.198 24.449 18.438 3.84 7.617c-2.716 3.909 14.748 9.834 19.034 12.8m164.515 96.479c6.945-6.73.284 10.72 11.508-1.648c.121-8.853-.346-14.082-12.898-3.328c-3.46 1.92-5.005 10.079 1.39 4.976m-113.73-73.02c7.725 6.863 35.482 5.036 9.383.845c-3.866-5.715-24.545-4.34-9.383-.844M59.833 293.379c-11.223-16.012-6.976-23.21-17.799-36.283c-2.048-9.998-18.565-32.685-8.543-8.65c9.18 14.057 11.909 35.822 26.342 44.933M392.335 451.41c10.919-2.213 35.8 5.558 39.821-2.895c-13.259-.321-45.873-9.354-47.417 2.156zm-371.8-275.906c-1.99-11.407-4.396-31.43 14.638-24.664c-25.407 5.044 17.584 31.579 12.155 10.629c10.683.523 20.899-6.314 15.293 4.062c21.048-2.325 35.641-20.578 55.973-18.02c15.838-2.096 33.154-3.685 50.22-10.06c14.033-1.011 27.541-16.12 19.85-25.074c-19.136-1.619-39.168.775-60.318 4.98c-23.438 4.872-44.727 14.129-68.375 18.102c-23.05 3.096 4.637 8.531-1.966 9.742c-12.028 4.173 14.344 6.988-1.56 11.387c-9.82-1.867-20.044-5.242-15.849-15.592c-22.08 2.865-41.481 12.029-24.037 34.498zm59.011-24.563c19.25 13.16-3.308-21.605-8.485-2.533c2.405-.592 6.186.812 8.485 2.533m5.48-8.819c18.248 1.836-2.796-11.586-3.47-3.159zm30.583-11.176c26.935-5.127-9.864-8.558-17.755.925c5 2.28 10.535-6.36 17.755-.925m46.2-9.176c17.028-2.615 2.677-10.431-2.305 2.623c1.806 4.116 2.675-1.234 2.305-2.623m-91.595 69.56c9.624-.66 15.057-10.616-1.862-10.044c-26.221-2.714 23.135 8.979-3.363 5.635c-3.561 2.358 5.018 5.062 5.225 4.41M56.737 115.31c17.176-5.843 38.86-10.806 48.527 3.286c-7.272-10.259-3.083-20.122 4.712-5.598c11.024 14.696 14.979-3.775 9.372-11.613c5.335 8.437 25.138 26.808 5.47.642c13.033-15.677-26.094 2.053-34.987 1.874c-4.28 1.92-44.177 10.175-33.094 11.41m10.066-19.278c9.796-7.394 33.88 4.398 18.425-7.348c-1.51-1.335-33.844 8.907-18.425 7.348m35.713 1.474c11.464.293-4.946-15.401 8.716-8.29c-2.244-7.33-15.906-8.702-22.585-11.63c-3.778 6.701 7.69 20.01 13.869 19.92m-42.109-50.25C47.4 30.274 84.872 50.11 71.655 32.33c-11.124-8.858-21.813 9.969-11.248 14.926m166.945 89.921c5.967-10.576-24.633-14.257-4.02-3.748c1.898.634 1.469 4.48 4.02 3.748"
        ></path>
      </svg>
    );
  }

  if (name === ICON_NAME["fastapi-brand-color"]) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 128 128"
      >
        <path
          fill="#049688"
          d="M56.813 127.586c-1.903-.227-3.899-.52-4.434-.652a48 48 0 0 0-2.375-.5a36 36 0 0 1-2.703-.633c-4.145-1.188-4.442-1.285-7.567-2.563c-2.875-1.172-8.172-3.91-9.984-5.156c-.496-.344-.96-.621-1.031-.621s-1.23-.816-2.578-1.813c-8.57-6.343-15.004-14.043-19.653-23.527c-.8-1.629-1.453-3.074-1.453-3.21c0-.134-.144-.505-.32-.817c-.363-.649-.88-2.047-1.297-3.492a20 20 0 0 0-.625-1.813c-.195-.46-.352-1.02-.352-1.246c0-.227-.195-.965-.433-1.645c-.238-.675-.43-1.472-.43-1.77c0-.296-.187-1.32-.418-2.276C.598 73.492 0 67.379 0 63.953c0-3.422.598-9.535 1.16-11.894c.23-.957.418-2 .418-2.32c0-.321.145-.95.32-1.4c.18-.448.41-1.253.516-1.788c.11-.535.36-1.457.563-2.055l.59-1.726c.433-1.293.835-2.387 1.027-2.813c.11-.238.539-1.21.957-2.16c.676-1.535 2.125-4.43 2.972-5.945c.309-.555.426-.739 2.098-3.352c2.649-4.148 7.176-9.309 11.39-12.988c1.485-1.297 6.446-5.063 6.669-5.063c.062 0 .53-.281 1.043-.625c1.347-.902 2.668-1.668 4.39-2.531a53 53 0 0 0 1.836-.953c.285-.164.82-.41 3.567-1.64c.605-.27 1.257-.516 3.136-1.173c.414-.144 1.246-.449 1.84-.672c.598-.222 1.301-.406 1.563-.406c.258 0 .937-.18 1.508-.402c.57-.223 1.605-.477 2.304-.563c.696-.082 1.621-.277 2.055-.43c.43-.148 1.61-.34 2.621-.425a73 73 0 0 0 3.941-.465c2.688-.394 8.532-.394 11.192 0a75 75 0 0 0 3.781.445c.953.079 2.168.278 2.703.442c.535.16 1.461.36 2.055.433c.594.079 1.594.325 2.222.551c.63.23 1.344.414 1.59.414s.754.137 1.125.309c.375.168 1.168.449 1.766.625c.594.18 1.613.535 2.27.797c.652.261 1.527.605 1.945.761c.77.29 6.46 3.137 7.234 3.622c6.281 3.917 9.512 6.476 13.856 10.964c5.238 5.414 8.715 10.57 12.254 18.16c.25.536.632 1.329.851 1.758c.215.434.395.942.395 1.13c0 .19.18.76.402 1.269c.602 1.383 1.117 2.957 1.36 4.16c.12.59.343 1.32.495 1.621c.153.3.332 1.063.403 1.688c.07.624.277 1.648.453 2.269c1.02 3.531 1.527 13.934.91 18.535c-.183 1.367-.39 3.02-.46 3.672c-.118 1.117-.708 4.004-1.212 5.945l-.52 2.055c-.98 3.957-3.402 9.594-6.359 14.809c-1.172 2.07-5.101 7.668-5.843 8.324c-.067.058-.399.45-.735.863c-.336.418-1.414 1.586-2.39 2.594c-4.301 4.441-7.77 7.187-13.86 10.969c-.722.449-6.847 3.441-7.992 3.906c-.594.238-1.586.64-2.203.89c-.613.247-1.297.454-1.512.458c-.215.003-.781.195-1.258.425c-.476.23-1.082.422-1.351.426c-.266.004-1.043.192-1.727.418c-.683.23-1.633.477-2.11.55c-.476.075-1.495.278-2.269.45c-.773.172-3.11.508-5.187.746a59 59 0 0 1-13.945-.031m4.703-12.5c.3-.234.609-.7.691-1.027c.18-.723 29.234-58.97 29.781-59.7c.461-.617.504-1.605.082-1.953c-.222-.187-3.004-.246-10.43-.234c-5.57.012-10.253.016-10.406.012c-.226-.008-.273-3.73-.25-19.672c.016-10.817-.035-19.766-.113-19.89c-.078-.126-.383-.227-.68-.227c-.418 0-.613.18-.87.808c-.485 1.168-1.825 3.82-8.348 16.485a3555 3555 0 0 0-4.055 7.89c-1.156 2.262-2.98 5.813-4.047 7.89a8751 8751 0 0 0-8.598 16.759c-4.933 9.636-5.53 10.785-5.742 11.039c-.41.496-.633 1.64-.402 2.07c.21.394.629.41 11.043.394c5.953-.007 10.863.024 10.914.07c.137.141.086 37.31-.055 38.196c-.093.582-.031.89.235 1.156c.46.461.586.457 1.25-.066m0 0"
        ></path>
      </svg>
    );
  }

  if (name === ICON_NAME["hono"]) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={(16 * SIZE_MULTIPLIER[size]).toString()}
        height={(16 * SIZE_MULTIPLIER[size]).toString()}
        fill={ICON_COLOR[color]}
        strokeWidth={STROKE_WIDTH_TO_VALUE[stroke]}
        viewBox="0 0 24 24"
      >
        <path d="M12.445.002a45.5 45.5 0 0 0-5.252 8.146a9 9 0 0 1-.555-.53a28 28 0 0 0-1.205-1.542a8.8 8.8 0 0 0-1.251 2.12a20.7 20.7 0 0 0-1.448 5.88a8.9 8.9 0 0 0 .338 3.468q1.968 5.22 7.445 6.337q4.583.657 8.097-2.312q4.015-3.885 2.047-9.132a33.3 33.3 0 0 0-2.988-5.59A91 91 0 0 0 12.615.053a.22.22 0 0 0-.17-.051m-.336 3.906a51 51 0 0 1 4.794 6.552q.672 1.15 1.108 2.41q.91 3.579-1.951 5.904q-2.768 1.947-6.072 1.156q-3.564-1.105-4.121-4.794a5.1 5.1 0 0 1 .242-2.266q.536-1.361 1.3-2.601l1.446-2.121a397 397 0 0 0 3.254-4.24"></path>
      </svg>
    );
  }
}

export default Icon;
