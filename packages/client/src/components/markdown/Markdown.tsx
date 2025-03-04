import ReactMarkdown from "markdown-to-jsx";
import React from "react";
import { Code } from "~/components/code";
import { classNames } from "~/utils/classNames";

function Markdown({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <ReactMarkdown
      options={{
        createElement(type, props, children) {
          if (type === "h1") {
            // @ts-expect-error not sure why this is not typed
            props.className = "mb-6 mt-4";
            return React.createElement(type, props, children);
          }

          if (type === "h2") {
            // @ts-expect-error not sure why this is not typed
            props.className = "mb-4 mt-2";
            return React.createElement(type, props, children);
          }

          if (type === "h3") {
            // @ts-expect-error not sure why this is not typed
            props.className = "my-3";
            return React.createElement(type, props, children);
          }

          if (type === "blockquote") {
            // @ts-expect-error not sure why this is not typed
            props.className =
              "text-base border-l-4 border-brand-neutral pl-4 py-2 italic bg-brand-overlay my-4 w-full";
            return React.createElement(type, props, children);
          }

          if (type === "p") {
            // @ts-expect-error not sure why this is not typed
            props.className = "my-2";
            return React.createElement(type, props, children);
          }

          if (type === "ol") {
            // @ts-expect-error not sure why this is not typed
            props.className = "list-decimal list-inside my-4 ml-4 space-y-1";
            return React.createElement(type, props, children);
          }

          if (type === "ul") {
            // @ts-expect-error not sure why this is not typed
            props.className = "list-disc list-inside my-4 ml-4 space-y-1";
            return React.createElement(type, props, children);
          }

          if (type === "a") {
            // @ts-expect-error not sure why this is not typed
            props.className = "text-brand-primary underline";
            return React.createElement(type, props, children);
          }

          if (type === "hr") {
            // @ts-expect-error not sure why this is not typed
            props.className = "border-brand-neutral";
            return React.createElement(type, props, children);
          }

          if (
            type === "pre" &&
            // @ts-expect-error more stuff
            "type" in children &&
            children["type"] === "code"
          ) {
            // Guard it in a try catch in case children.props.children is not a string
            // or doesn't exist.
            try {
              return (
                <Code
                  code={children.props.children.toString()}
                  key={Math.random()}
                />
              );
            } catch (e) {
              return React.createElement(type, props, children);
            }
          }

          if (type === "code") {
            // @ts-expect-error more stuff
            props.className = "p-1 bg-brand-overlay rounded-brand";
            return React.createElement(type, props, children);
          }

          return React.createElement(type, props, children);
        },
      }}
      className={classNames("w-full", className)}
    >
      {children}
    </ReactMarkdown>
  );
}

export default Markdown;
