import { classNames } from "~/utils/classNames";

import { Button as HeadlessButton } from "@headlessui/react";
import { Spinner } from "../spinner";

const VARIANT = {
  PRIMARY: "primary",
  DANGER: "danger",
  WARNING: "warning",
  OUTLINE: "outline",
  SUBTLE_SECONDARY: "subtle-secondary",
  GHOST: "ghost",
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
  onClick: () => void;
  children: string | React.ReactNode;
  variant: Variant;
  type?: "button" | "submit";
  size?: Size;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  style?: React.CSSProperties;
}) {
  const isColoredVariant =
    variant === VARIANT.PRIMARY ||
    variant === VARIANT.DANGER ||
    variant === VARIANT.WARNING;

  return (
    <HeadlessButton
      className={classNames(
        {
          "pointer-events-none": disabled || loading,
          "opacity-50": disabled,
          "rounded-brand transition duration-100 text-base/6 space-x-2 flex items-center justify-center focus:outline-none focus:ring-2":
            variant !== VARIANT.GHOST,
          "shadow-sm":
            variant !== VARIANT.GHOST && variant !== VARIANT.SUBTLE_SECONDARY,
          "px-[6px] py-0 min-w-12 text-xs/5":
            variant !== VARIANT.GHOST && size === SIZE.xs,
          "px-[8px] py-0 min-w-16 text-sm/6":
            variant !== VARIANT.GHOST && size === SIZE.sm,
          "px-[17px] py-[5px] min-w-24 text-base/6":
            variant !== VARIANT.GHOST && size === SIZE.md,
          "px-[17px] py-[11px] min-w-24 text-base/6":
            variant !== VARIANT.GHOST && size === SIZE.lg,
          "text-white/95 font-medium": isColoredVariant,
          "bg-brand-btn-primary hover:bg-brand-btn-primary-hover focus:ring-brand-primary-heavy":
            variant === VARIANT.PRIMARY,
          "bg-brand-btn-error hover:bg-brand-btn-error-hover focus:ring-brand-error-heavy":
            variant === VARIANT.DANGER,
          "bg-brand-btn-warning hover:bg-brand-btn-warning-hover focus:ring-brand-warning-heavy":
            variant === VARIANT.WARNING,
          "bg-transparent hover:bg-brand-page-inverted-5 text-brand-neutral-button border-brand border-brand-neutral focus:ring-brand-neutral-button":
            variant === VARIANT.OUTLINE,
          "bg-transparent hover:bg-brand-page-inverted-5 text-brand-neutral-2":
            variant === VARIANT.SUBTLE_SECONDARY,
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
