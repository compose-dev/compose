import { UI } from "@composehq/ts-public";
import { appStore } from "~/utils/appStore";
import { Spinner } from "~/components/spinner";
import { Code } from "~/components/code";
import { Markdown } from "~/components/markdown";
import RenderText from "./RenderText";
import Json from "~/components/json";
import { PDFPreview } from "~/components/pdf-preview";
import { classNames } from "~/utils/classNames";
import { Statistic } from "~/components/statistic";
import { useShallow } from "zustand/react/shallow";
import { Divider } from "~/components/divider";

function DisplayInteractionComponent({
  componentId,
  renderId,
}: {
  componentId: string;
  renderId: string;
}) {
  const component = appStore.use(
    (state) => state.flattenedModel[renderId][componentId]
  );

  const componentNonWidthStyles = appStore.use(
    useShallow((state) => {
      const style = state.flattenedModel[renderId][componentId].model.style;

      if (!style) {
        return {};
      } else {
        return {
          ...style,
          width: undefined,
          minWidth: undefined,
          maxWidth: undefined,
        };
      }
    })
  );

  if (component.type === UI.TYPE.DISPLAY_TEXT) {
    const { whiteSpace } = component.model.style || {};

    // apply the whitespace style at the root of the text tree.
    const styles = {
      ...(whiteSpace ? { whiteSpace } : { whiteSpace: "pre-wrap" }),
    };

    return (
      <p>
        <RenderText
          text={component.model.properties.text}
          color={component.model.properties.color}
          size={component.model.properties.size}
          style={styles}
        />
      </p>
    );
  }

  if (component.type === UI.TYPE.DISPLAY_HEADER) {
    const size = component.model.properties.size;

    const className = classNames("whitespace-pre-wrap", {
      "text-brand-neutral":
        component.model.properties.color === UI.Appearance.TEXT.TEXT,
      "text-brand-neutral-2":
        component.model.properties.color === UI.Appearance.TEXT.TEXT_SECONDARY,
      "text-brand-primary":
        component.model.properties.color === UI.Appearance.TEXT.PRIMARY,
      "text-brand-warning":
        component.model.properties.color === UI.Appearance.TEXT.WARNING,
      "text-brand-error":
        component.model.properties.color === UI.Appearance.TEXT.DANGER,
      "text-brand-success":
        component.model.properties.color === UI.Appearance.TEXT.SUCCESS,
      "text-brand-bg":
        component.model.properties.color === UI.Appearance.TEXT.BACKGROUND,
    });

    // Apply these three styles directly to the header element so that they
    // override the default values for these properties.
    const { fontSize, fontWeight, lineHeight, whiteSpace } =
      component.model.style || {};

    const styles = {
      ...(fontSize && { fontSize }),
      ...(fontWeight && { fontWeight }),
      ...(lineHeight && { lineHeight }),
      ...(whiteSpace && { whiteSpace }),
    };

    if (size && size === UI.Size.HEADER.xs) {
      return (
        <h5 className={className} style={styles}>
          {component.model.properties.text}
        </h5>
      );
    }

    if (size && size === UI.Size.HEADER.sm) {
      return (
        <h4 className={className} style={styles}>
          {component.model.properties.text}
        </h4>
      );
    }

    if (size && size === UI.Size.HEADER.md) {
      return (
        <h3 className={className} style={styles}>
          {component.model.properties.text}
        </h3>
      );
    }

    if (size && size === UI.Size.HEADER.lg) {
      return (
        <h2 className={className} style={styles}>
          {component.model.properties.text}
        </h2>
      );
    }

    if (size && size === UI.Size.HEADER.xl) {
      return (
        <h1 className={className} style={styles}>
          {component.model.properties.text}
        </h1>
      );
    }

    // Default to md
    return (
      <h3 className={className} style={styles}>
        {component.model.properties.text}
      </h3>
    );
  }

  if (component.type === UI.TYPE.DISPLAY_JSON) {
    return (
      <Json
        label={component.model.properties.label}
        description={component.model.properties.description}
        json={component.model.properties.json}
      />
    );
  }

  if (component.type === UI.TYPE.DISPLAY_CODE) {
    return (
      <Code
        label={component.model.properties.label}
        description={component.model.properties.description}
        lang={component.model.properties.lang}
        code={component.model.properties.code}
      />
    );
  }

  if (component.type === UI.TYPE.DISPLAY_IMAGE) {
    return (
      <img
        src={component.model.properties.src}
        className="dark:bg-gray-50/80 p-2 rounded-brand"
      />
    );
  }

  if (component.type === UI.TYPE.DISPLAY_MARKDOWN) {
    return <Markdown>{component.model.properties.markdown}</Markdown>;
  }

  if (component.type === UI.TYPE.DISPLAY_DIVIDER) {
    return (
      <Divider
        orientation={component.model.properties.orientation}
        thickness={component.model.properties.thickness}
        style={component.model.style}
      />
    );
  }

  if (component.type === UI.TYPE.DISPLAY_PDF) {
    return (
      <PDFPreview
        file={component.model.properties.base64}
        annotations={component.model.properties.annotations}
        label={component.model.properties.label}
        description={component.model.properties.description}
        width={component.model.style?.width}
        height={component.model.style?.height}
        scroll={component.model.properties.scroll}
      />
    );
  }

  if (component.type === UI.TYPE.DISPLAY_STATISTIC) {
    return (
      <Statistic
        label={component.model.properties.label}
        value={component.model.properties.value}
        description={component.model.properties.description}
        format={component.model.properties.format}
        labelColor={component.model.properties.labelColor}
        valueColor={component.model.properties.valueColor}
        descriptionColor={component.model.properties.descriptionColor}
        decimals={component.model.properties.decimals}
        delta={component.model.properties.delta}
        deltaDecimals={component.model.properties.deltaDecimals}
        deltaFormat={component.model.properties.deltaFormat}
        isPositiveDelta={component.model.properties.isPositiveDelta}
        prefix={component.model.properties.prefix}
        suffix={component.model.properties.suffix}
        style={componentNonWidthStyles}
      />
    );
  }

  if (component.type === UI.TYPE.DISPLAY_SPINNER) {
    return <Spinner text={component.model.properties.text} />;
  }

  return null;
}

export default DisplayInteractionComponent;
