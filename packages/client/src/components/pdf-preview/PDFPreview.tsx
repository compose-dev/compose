import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import { useCallback, useEffect, useRef, useState } from "react";

import useWidth from "./useWidth";
import Button from "../button";
import Icon from "../icon";
import { IOComponent } from "../io-component";
import { classNames } from "~/utils/classNames";

import { UI } from "@composehq/ts-public";

const isBoxAnnotation = (annotation: UI.Annotation): boolean => {
  return annotation.appearance === "box";
};

const isHighlightAnnotation = (annotation: UI.Annotation): boolean => {
  return annotation.appearance === "highlight" || !annotation.appearance;
};

const getAnnotationPage = (annotation: UI.Annotation): number => {
  return annotation.page || 1;
};

function PDFPreview({
  file,
  label,
  description,
  width,
  height,
  annotations,
  scroll,
}: {
  file: string;
  label?: string;
  description?: string;
  width?: string;
  height?: string;
  annotations?: UI.Annotation[];
  scroll?: "vertical" | "horizontal";
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    width: computedWidth,
    height: computedHeight,
    setContainerWidth,
    setContainerHeight,
    ignoreWidth,
    ignoreHeight,
  } = useWidth(width, height, scroll);

  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const updateContainerWidth = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const scrollbarWidth = containerRef.current.offsetWidth - containerWidth;
      setContainerWidth(containerWidth - scrollbarWidth);

      const containerHeight = containerRef.current.clientHeight;
      const scrollbarHeight =
        containerRef.current.offsetHeight - containerHeight;
      setContainerHeight(containerHeight - scrollbarHeight);
    }
  }, [setContainerWidth, setContainerHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateContainerWidth]);

  return (
    <div className="flex flex-col h-full max-w-full">
      {label && <IOComponent.Label>{label}</IOComponent.Label>}
      {description && (
        <IOComponent.Description>{description}</IOComponent.Description>
      )}
      <div
        className="relative overflow-auto outline outline-1 outline-brand-neutral rounded-brand max-w-full"
        style={{ scrollbarWidth: "thin" }}
      >
        <div ref={containerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="relative"
          >
            <Page
              pageNumber={pageNumber}
              width={ignoreWidth ? undefined : computedWidth}
              height={ignoreHeight ? undefined : computedHeight}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        {annotations && (
          <>
            {annotations
              .filter(
                (annotation) => getAnnotationPage(annotation) === pageNumber
              )
              .map((annotation, idx) => (
                <div key={idx}>
                  <div
                    className={classNames("absolute", {
                      "border-2": isBoxAnnotation(annotation),
                      "border-blue-700":
                        isBoxAnnotation(annotation) &&
                        (!annotation.color || annotation.color === "blue"),
                      "border-yellow-700":
                        isBoxAnnotation(annotation) &&
                        annotation.color === "yellow",
                      "border-green-700":
                        isBoxAnnotation(annotation) &&
                        annotation.color === "green",
                      "border-red-700":
                        isBoxAnnotation(annotation) &&
                        annotation.color === "red",
                      "border-purple-700":
                        isBoxAnnotation(annotation) &&
                        annotation.color === "purple",
                      "border-orange-700":
                        isBoxAnnotation(annotation) &&
                        annotation.color === "orange",
                      "border-gray-700":
                        isBoxAnnotation(annotation) &&
                        annotation.color === "gray",
                      "bg-opacity-30": isHighlightAnnotation(annotation),
                      "bg-blue-300":
                        isHighlightAnnotation(annotation) &&
                        (!annotation.color || annotation.color === "blue"),
                      "bg-yellow-300":
                        isHighlightAnnotation(annotation) &&
                        annotation.color === "yellow",
                      "bg-green-300":
                        isHighlightAnnotation(annotation) &&
                        annotation.color === "green",
                      "bg-red-300":
                        isHighlightAnnotation(annotation) &&
                        annotation.color === "red",
                      "bg-purple-300":
                        isHighlightAnnotation(annotation) &&
                        annotation.color === "purple",
                      "bg-orange-300":
                        isHighlightAnnotation(annotation) &&
                        annotation.color === "orange",
                      "bg-gray-300":
                        isHighlightAnnotation(annotation) &&
                        annotation.color === "gray",
                    })}
                    style={{
                      top: `${annotation.y1}px`,
                      left: `${annotation.x1}px`,
                      width: `${annotation.x2 - annotation.x1}px`,
                      height: `${annotation.y2 - annotation.y1}px`,
                    }}
                  ></div>
                  {annotation.label && (
                    <div
                      className={classNames(
                        "text-xs font-mono text-white p-0.5 px-1 absolute min-w-fit",
                        {
                          "bg-blue-700":
                            !annotation.color || annotation.color === "blue",
                          "bg-yellow-700": annotation.color === "yellow",
                          "bg-green-700": annotation.color === "green",
                          "bg-red-700": annotation.color === "red",
                          "bg-purple-700": annotation.color === "purple",
                          "bg-orange-700": annotation.color === "orange",
                          "bg-gray-700": annotation.color === "gray",
                        }
                      )}
                      style={{
                        top: `${annotation.y1}px`,
                        right:
                          !ignoreWidth && annotation.x1 < computedWidth / 2
                            ? undefined
                            : computedWidth - annotation.x1,
                        left:
                          ignoreWidth || annotation.x1 < computedWidth / 2
                            ? annotation.x2
                            : undefined,
                      }}
                    >
                      {annotation.label}
                    </div>
                  )}
                </div>
              ))}
          </>
        )}
      </div>
      {numPages > 1 && (
        <div
          className="flex items-center justify-center py-2"
          style={{ width }}
        >
          <Button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            aria-label="Previous page"
            disabled={pageNumber <= 1}
            variant="ghost"
          >
            <Icon
              name="chevron-left"
              color={pageNumber <= 1 ? "brand-neutral-2" : "black"}
            />
          </Button>
          <p className="px-4 text-sm">
            Page {pageNumber} of {numPages}
          </p>
          <Button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
            aria-label="Next page"
            disabled={pageNumber >= numPages}
            variant="ghost"
          >
            <Icon name="chevron-right" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default PDFPreview;
