import { useEffect, useState } from "react";
import { PDFPreview } from "~/components/pdf-preview";
import pdf from "/invoice-example.pdf";
import { TextAreaInput } from "~/components/input";
import Button from "~/components/button";
import { u } from "@compose/ts";
import { toast } from "~/utils/toast";

type Annotation = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  label?: string;
  color?:
    | "red"
    | "green"
    | "blue"
    | "yellow"
    | "purple"
    | "orange"
    | "gray"
    | undefined;
};

const baseAnnotations: Annotation[] = [
  {
    x1: 25,
    x2: 150,
    y1: 40,
    y2: 60,
    label: "company_name",
  },
  {
    x1: 25,
    x2: 150,
    y1: 205,
    y2: 218,
    label: "item_1",
    color: "red",
  },
  {
    x1: 25,
    x2: 150,
    y1: 218,
    y2: 230,
    label: "item_2",
    color: "red",
  },
  {
    x1: 25,
    x2: 150,
    y1: 230,
    y2: 240,
    label: "item_3",
    color: "red",
  },
  {
    x1: 25,
    x2: 150,
    y1: 240,
    y2: 250,
    label: "item_4",
    color: "red",
  },
  {
    x1: 270,
    x2: 305,
    y1: 295,
    y2: 305,
    label: "total",
    color: "green",
  },
];

function DataLabelingApp() {
  const { addToast } = toast.useStore();

  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([
    ...baseAnnotations,
  ]);
  const [textAnnotations, setTextAnnotations] = useState<string | null>(
    JSON.stringify(annotations, null, 2)
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(pdf);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setPdfBase64(base64data);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, []);

  function handleAnnotationsChange() {
    setError(null);

    if (!textAnnotations) {
      setAnnotations([]);
      return;
    }

    if (u.string.isValidJSON(textAnnotations)) {
      setAnnotations(JSON.parse(textAnnotations));
    } else {
      setError("Please enter valid JSON.");
    }
  }

  function handleSubmit() {
    addToast({
      message: "Annotations saved!",
      appearance: "success",
    });
    setAnnotations([...baseAnnotations]);
    setTextAnnotations(JSON.stringify(annotations, null, 2));
    setError(null);
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex flex-row gap-4 overflow-y-auto">
        <div className="w-[325px]">
          {pdfBase64 && (
            <PDFPreview
              file={pdfBase64}
              annotations={annotations}
              width="325px"
            />
          )}
        </div>
        <div className="flex-1 h-full min-h-full flex flex-col gap-4 pr-4">
          <TextAreaInput
            label="Annotations Editor"
            value={textAnnotations}
            setValue={setTextAnnotations}
            inputClassName="h-[343px] min-w-[15rem]"
            onEnter={handleAnnotationsChange}
            errorMessage={error}
            hasError={!!error}
          />
          <Button
            variant="primary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save to database
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataLabelingApp;
