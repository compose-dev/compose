import { UI } from "@composehq/ts-public";
import { classNames } from "~/utils/classNames";
import { u } from "@compose/ts";
import Icon from "../icon";

function formatValue(
  value: number,
  format?: UI.NumberFormat.Option,
  decimals?: number
) {
  function getRoundedNumber() {
    if (format === UI.NumberFormat.OPTION.PERCENT) {
      if (decimals === undefined) {
        return u.number.correctFloatingPoint(value * 100);
      } else {
        return u.number.roundWithoutPadding(value * 100, decimals);
      }
    }

    if (decimals === undefined) {
      return u.number.correctFloatingPoint(value);
    } else {
      return u.number.roundWithoutPadding(value, decimals);
    }
  }

  return u.string.addThousandsSeparator(getRoundedNumber());
}

function getFormattedSuffix(
  format?: UI.NumberFormat.Option,
  override?: string
) {
  if (override) {
    return override;
  }

  if (format === UI.NumberFormat.OPTION.PERCENT) {
    return "%";
  }

  return undefined;
}

function getFormattedPrefix(
  format?: UI.NumberFormat.Option,
  override?: string
) {
  if (override) {
    return override;
  }

  if (format === UI.NumberFormat.OPTION.CURRENCY) {
    return "$";
  }

  return undefined;
}

function getDeltaTrend(delta?: number, isPositiveDelta?: boolean) {
  if (isPositiveDelta !== undefined) {
    return isPositiveDelta ? "up" : "down";
  }

  if (delta === undefined || delta === 0) {
    return "neutral";
  }

  if (delta > 0) {
    return "up";
  }

  return "down";
}

export default function Statistic({
  label,
  value,
  description,
  labelColor,
  valueColor,
  descriptionColor,
  format,
  decimals,
  suffix,
  prefix,
  delta,
  deltaDecimals,
  deltaFormat,
  isPositiveDelta,
  style,
}: {
  label: string;
  value: number;
  description?: string;
  labelColor?: UI.Appearance.Text;
  valueColor?: UI.Appearance.Text;
  descriptionColor?: UI.Appearance.Text;
  format?: UI.NumberFormat.Option;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  delta?: number;
  deltaDecimals?: number;
  deltaFormat?: UI.NumberFormat.Option;
  isPositiveDelta?: boolean;
  style?: React.CSSProperties;
}) {
  const formattedValue = formatValue(value, format, decimals);
  const formattedPrefix = getFormattedPrefix(format, prefix);
  const formattedSuffix = getFormattedSuffix(format, suffix);

  const formattedDelta =
    delta !== undefined
      ? formatValue(Math.abs(delta), deltaFormat, deltaDecimals)
      : undefined;
  const formattedDeltaSuffix =
    delta !== undefined ? getFormattedSuffix(deltaFormat) : undefined;
  const formattedDeltaPrefix =
    delta !== undefined ? getFormattedPrefix(deltaFormat) : undefined;
  const deltaTrend = getDeltaTrend(delta, isPositiveDelta);

  return (
    <div
      className="flex flex-col gap-2 p-4 rounded-brand border border-brand-neutral bg-brand-io"
      style={style}
    >
      <p
        className={classNames({
          "text-brand-neutral":
            !labelColor || labelColor === UI.Appearance.TEXT.TEXT,
          "text-brand-warning": labelColor === UI.Appearance.TEXT.WARNING,
          "text-brand-success": labelColor === UI.Appearance.TEXT.SUCCESS,
          "text-brand-primary": labelColor === UI.Appearance.TEXT.PRIMARY,
          "text-brand-error": labelColor === UI.Appearance.TEXT.DANGER,
          "text-brand-neutral-2":
            labelColor === UI.Appearance.TEXT.TEXT_SECONDARY,
          "text-brand-bg": labelColor === UI.Appearance.TEXT.BACKGROUND,
        })}
      >
        {label}
      </p>
      <div className="flex flex-row gap-2 items-center">
        <div
          className={classNames("flex gap-0.5 h3 font-semibold", {
            "text-brand-neutral":
              !valueColor || valueColor === UI.Appearance.TEXT.TEXT,
            "text-brand-warning": valueColor === UI.Appearance.TEXT.WARNING,
            "text-brand-success": valueColor === UI.Appearance.TEXT.SUCCESS,
            "text-brand-error": valueColor === UI.Appearance.TEXT.DANGER,
            "text-brand-primary": valueColor === UI.Appearance.TEXT.PRIMARY,
            "text-brand-neutral-2":
              valueColor === UI.Appearance.TEXT.TEXT_SECONDARY,
            "text-brand-bg": valueColor === UI.Appearance.TEXT.BACKGROUND,
          })}
        >
          {formattedPrefix && (
            <span
              className={classNames({
                "mr-0.5": formattedPrefix.length > 1,
              })}
            >
              {formattedPrefix}
            </span>
          )}
          <span>{formattedValue}</span>
          {formattedSuffix && (
            <span
              className={classNames({
                "ml-0.5": formattedSuffix.length > 1,
              })}
            >
              {formattedSuffix}
            </span>
          )}
        </div>
        {formattedDelta !== undefined && (
          <div
            className={classNames(
              "p-0.5 px-1 rounded-brand font-medium text-sm flex flex-row gap-1 items-center",
              {
                "green-tag": deltaTrend === "up",
                "red-tag": deltaTrend === "down",
                "slate-tag": deltaTrend === "neutral",
              }
            )}
          >
            <Icon
              name={
                delta !== undefined && delta >= 0
                  ? "trending-up"
                  : "trending-down"
              }
              color={
                deltaTrend === "up"
                  ? "brand-green-tag-text"
                  : deltaTrend === "down"
                    ? "brand-red-tag-text"
                    : "brand-neutral"
              }
            />
            <p>
              {formattedDeltaPrefix && formattedDeltaPrefix}
              {formattedDelta}
              {formattedDeltaSuffix && formattedDeltaSuffix}
            </p>
          </div>
        )}
      </div>
      {description && (
        <div
          className={classNames("text-sm", {
            "text-brand-neutral-2":
              !descriptionColor ||
              descriptionColor === UI.Appearance.TEXT.TEXT_SECONDARY,
            "text-brand-neutral": descriptionColor === UI.Appearance.TEXT.TEXT,
            "text-brand-primary":
              descriptionColor === UI.Appearance.TEXT.PRIMARY,
            "text-brand-warning":
              descriptionColor === UI.Appearance.TEXT.WARNING,
            "text-brand-success":
              descriptionColor === UI.Appearance.TEXT.SUCCESS,
            "text-brand-error": descriptionColor === UI.Appearance.TEXT.DANGER,
            "text-brand-bg": descriptionColor === UI.Appearance.TEXT.BACKGROUND,
          })}
        >
          {description}
        </div>
      )}
    </div>
  );
}
