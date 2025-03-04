import { UI } from "@composehq/ts-public";
import { classNames } from "~/utils/classNames";

function RenderText({
  text,
  color,
  size,
  style,
}: {
  text: UI.HooksOmittedComponents.DisplayText["model"]["properties"]["text"];
  color: UI.HooksOmittedComponents.DisplayText["model"]["properties"]["color"];
  size: UI.HooksOmittedComponents.DisplayText["model"]["properties"]["size"];
  style: object | null;
}) {
  const isComponent =
    typeof text === "object" &&
    text !== null &&
    "type" in text &&
    text.type === UI.TYPE.DISPLAY_TEXT;

  const className = classNames({
    "text-xs": size === UI.Size.TEXT.xs,
    "text-sm": size === UI.Size.TEXT.sm,
    "text-base": size === UI.Size.TEXT.md,
    "text-lg": size === UI.Size.TEXT.lg,
    "text-xl": size === UI.Size.TEXT.xl,
    "text-brand-neutral": color === UI.Appearance.TEXT.TEXT,
    "text-brand-neutral-2": color === UI.Appearance.TEXT.TEXT_SECONDARY,
    "text-brand-primary": color === UI.Appearance.TEXT.PRIMARY,
    "text-brand-warning": color === UI.Appearance.TEXT.WARNING,
    "text-brand-error": color === UI.Appearance.TEXT.DANGER,
    "text-brand-success": color === UI.Appearance.TEXT.SUCCESS,
    "text-brand-bg": color === UI.Appearance.TEXT.BACKGROUND,
  });

  const finalStyle = style ? style : undefined;

  if (isComponent) {
    return (
      <span style={finalStyle} className={className}>
        <RenderText
          text={text.model.properties.text}
          color={text.model.properties.color}
          size={text.model.properties.size}
          style={text.model.style}
        />
      </span>
    );
  }

  if (Array.isArray(text)) {
    return (
      <span style={finalStyle} className={className}>
        {text.map((item, index) => (
          <RenderText
            key={index}
            text={item}
            color={color}
            size={size}
            style={
              isComponent
                ? (item as UI.ComponentGenerators.DisplayText).model.style
                : null
            }
          />
        ))}
      </span>
    );
  }

  return (
    <span style={finalStyle} className={className}>
      {text as React.ReactNode}
    </span>
  );
}

export default RenderText;
