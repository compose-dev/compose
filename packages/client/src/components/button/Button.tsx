import { classNames } from "~/utils/classNames";

import { Button as HeadlessButton } from "@headlessui/react";
import { Spinner } from "../spinner";

const VARIANT = {
  // public marketing colors
  BRAND: "brand",
  PRIMARY: "primary",
  DANGER: "danger",
  WARNING: "warning",
  OUTLINE: "outline",
  SUBTLE_SECONDARY: "subtle-secondary",
  GHOST: "ghost",
  SUBTLE_DANGER: "subtle-danger",
  BARE_SECONDARY: "bare-secondary",
} as const;

type Variant = (typeof VARIANT)[keyof typeof VARIANT];

const SIZE = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
} as const;

type Size = (typeof SIZE)[keyof typeof SIZE];

function Button({
  children,
  onClick,
  variant,
  type = "button",
  size = "md",
  disabled = false,
  className = "",
  loading = false,
  style = undefined,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: string | React.ReactNode;
  variant: Variant;
  type?: "button" | "submit";
  size?: Size;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  style?: React.CSSProperties;
}) {
  const isGhostVariant = variant === VARIANT.GHOST;

  const isColoredVariant =
    variant === VARIANT.PRIMARY ||
    variant === VARIANT.DANGER ||
    variant === VARIANT.WARNING ||
    variant === VARIANT.BRAND;

  const isSubtleVariant =
    variant === VARIANT.SUBTLE_SECONDARY || variant === VARIANT.SUBTLE_DANGER;

  const isBareVariant = variant === VARIANT.BARE_SECONDARY;

  return (
    <HeadlessButton
      className={classNames(
        {
          // ALL BUTTONS
          "pointer-events-none": disabled || loading,
          "opacity-50": disabled,

          // BASIC STYLING + OUTLINE + ANIMATION
          "rounded-brand transition duration-100 text-base/6 space-x-2 flex items-center justify-center focus:outline-none focus:ring-2":
            !isGhostVariant,

          // SHADOW (only base buttons)
          "shadow-sm": !isGhostVariant && !isSubtleVariant && !isBareVariant,

          // BUTTON SIZING
          "text-xs/5": !isGhostVariant && size === SIZE.xs,
          "text-sm/6": !isGhostVariant && size === SIZE.sm,
          "text-base/6":
            !isGhostVariant && (size === SIZE.md || size === SIZE.lg),

          // PADDING + MIN WIDTH
          "px-[6px] py-0 min-w-12":
            !isGhostVariant && !isBareVariant && size === SIZE.xs,
          "px-[8px] py-0 min-w-16":
            !isGhostVariant && !isBareVariant && size === SIZE.sm,
          "px-[17px] py-[5px] min-w-24":
            !isGhostVariant && !isBareVariant && size === SIZE.md,
          "px-[17px] py-[11px] min-w-24":
            !isGhostVariant && !isBareVariant && size === SIZE.lg,

          // TEXT
          "text-white/95 font-medium": isColoredVariant,

          // STYLING
          "bg-brand-btn-primary hover:bg-brand-btn-primary-hover focus:ring-brand-primary-heavy":
            variant === VARIANT.PRIMARY,
          "bg-orange-500 hover:bg-orange-600 focus:ring-orange-700 dark:bg-orange-600 dark:hover:bg-orange-500 dark:focus:ring-orange-400":
            variant === VARIANT.BRAND,
          "bg-brand-btn-error hover:bg-brand-btn-error-hover focus:ring-brand-error-heavy":
            variant === VARIANT.DANGER,
          "bg-brand-btn-warning hover:bg-brand-btn-warning-hover focus:ring-brand-warning-heavy":
            variant === VARIANT.WARNING,
          "bg-transparent hover:bg-brand-page-inverted-5 text-brand-neutral-button border-brand border-brand-neutral focus:ring-brand-neutral-button":
            variant === VARIANT.OUTLINE,
          "bg-transparent hover:bg-brand-page-inverted-5 text-brand-neutral-2":
            variant === VARIANT.SUBTLE_SECONDARY,
          "bg-transparent hover:bg-brand-page-inverted-5 text-brand-error":
            variant === VARIANT.SUBTLE_DANGER,
          "bg-transparent text-brand-neutral-2 hover:text-brand-neutral":
            variant === VARIANT.BARE_SECONDARY,
        },
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      style={style}
    >
      {variant === VARIANT.GHOST ? (
        children
      ) : (
        <div className="relative">
          <div
            className={classNames("flex items-center gap-2", {
              invisible: loading,
            })}
          >
            {children}
          </div>
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <Spinner
                variant={isColoredVariant ? "white" : "neutral"}
                size="sm"
              />
            </div>
          )}
        </div>
      )}
    </HeadlessButton>
  );
}

export default Button;
