import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { Ace } from "ace-builds";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

import { theme } from "~/utils/theme";
import { IOComponent } from "../io-component";
import Button from "../button";
import { classNames } from "~/utils/classNames";
import { toast } from "~/utils/toast";
import Icon from "../icon";

function ActionButtons({
  onClickFormat,
  onClickSearch,
  isScrollbarVisible,
}: {
  onClickFormat: () => void;
  onClickSearch: () => void;
  isScrollbarVisible: boolean;
}) {
  return (
    <>
      <div
        className={classNames(
          "flex items-center gap-2 absolute top-2.5 bg-brand-overlay rounded-brand border border-brand-neutral p-1 gap-x-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 duration-150 transition-opacity",
          {
            "right-2.5": !isScrollbarVisible,
            "right-6": isScrollbarVisible,
          }
        )}
      >
        <div className="flex relative">
          <Button variant="ghost" onClick={onClickSearch}>
            <div
              data-tooltip-content="Search"
              data-tooltip-id="top-tooltip-offset8"
            >
              <Icon name="search" size="0.875" color="brand-neutral-2" />
            </div>
          </Button>
        </div>
        <div className="flex relative">
          <Button
            variant="ghost"
            className={classNames("duration-150 transition-opacity")}
            onClick={onClickFormat}
          >
            <div
              data-tooltip-content="Format"
              data-tooltip-id="top-tooltip-offset8"
            >
              <Icon name="format" size="0.875" color="brand-neutral-2" />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}

interface JsonEditorProps {
  id: string;
  value: string | null;
  label: string | null;
  description: string | null;
  errorMessage: string | null;
  hasError: boolean;
  onChange: (value: string | null) => void;
  height?: string;
  width?: string;
  readOnly?: boolean;
  inputStyle?: React.CSSProperties;
  onEnter?: () => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  id,
  value,
  onChange,
  label,
  description,
  errorMessage,
  hasError,
  height = "300px",
  width = "100%",
  readOnly = false,
  inputStyle,
  onEnter,
}) => {
  const { addToast } = toast.useStore();
  const editorRef = useRef<AceEditor>(null);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [observer, setObserver] = useState<MutationObserver | null>(null);
  const didSubmit = !hasError && attemptedSubmit;

  const showErrorMessage = errorMessage !== null && hasError;
  const showOnEnterMessage = !!onEnter && !showErrorMessage && isFocused;

  const isDark = theme.useIsDarkMode();

  const onEnterRef = useRef(onEnter);

  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  const handleLoad = (editor: Ace.Editor) => {
    // Locate the vertical scrollbar element
    const scrollbar = editor.container.querySelector(".ace_scrollbar-v");
    if (!scrollbar) return;

    // Set up the MutationObserver to watch for style attribute changes
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const displayStyle = (mutation.target as HTMLElement).style.display;
        setIsScrollbarVisible(displayStyle !== "none");
      }
    });

    // Start observing changes to attributes, filtering on the 'style' attribute
    observer.observe(scrollbar, {
      attributes: true,
      attributeFilter: ["style"],
    });

    setObserver(observer);
  };

  useEffect(() => {
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer]);

  return (
    <div className="flex flex-col">
      {label && <IOComponent.Label>{label}</IOComponent.Label>}
      {description && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      <div
        className={classNames(
          "rounded-brand border border-brand-neutral overflow-clip relative group",
          {
            "ring-brand-primary-heavy ring-2 ring-offset-0": isFocused,
          }
        )}
      >
        <AceEditor
          ref={editorRef}
          name={id}
          mode="json"
          theme={isDark ? "gruvbox" : "github"}
          value={value ?? ""}
          onChange={(value) => {
            if (value === "") {
              onChange(null);
            } else {
              onChange(value);
            }
          }}
          onLoad={handleLoad}
          height={height}
          width={width}
          readOnly={readOnly}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            useWorker: false,
            showPrintMargin: false,
            tabSize: 2,
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ ...inputStyle, scrollbarGutter: "none" }}
          commands={[
            {
              name: "submit",
              bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
              exec: () => {
                setAttemptedSubmit(true);
                if (onEnterRef.current) {
                  onEnterRef.current();
                }
              },
            },
          ]}
        />
        <ActionButtons
          onClickFormat={() => {
            try {
              if (value === "" || value === null) {
                return;
              }

              const parsed = JSON.parse(value);
              onChange(JSON.stringify(parsed, null, 2));
            } catch (error) {
              addToast({
                title: "Failed to format JSON",
                message:
                  error instanceof Error ? error.message : "Unknown error",
                appearance: "error",
              });
            }
          }}
          onClickSearch={() => {
            if (editorRef.current) {
              const editor = editorRef.current.editor;
              if (!editor.searchBox) {
                editor.commands.exec("find", editor, null);
                return;
              }

              editor.searchBox.show("");
            }
          }}
          isScrollbarVisible={isScrollbarVisible}
        />
      </div>
      {showErrorMessage && (
        <IOComponent.Error>{errorMessage}</IOComponent.Error>
      )}
      {showOnEnterMessage && (
        <IOComponent.HelpMessage>
          Press {/Mac/i.test(navigator.userAgent) ? "⌘" : "ctrl"} + enter to
          submit{didSubmit ? " again" : ""}
        </IOComponent.HelpMessage>
      )}
    </div>
  );
};
