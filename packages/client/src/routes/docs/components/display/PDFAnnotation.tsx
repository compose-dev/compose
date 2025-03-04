import { useEffect, useState } from "react";
import { PDFPreview } from "~/components/pdf-preview";
import pdf from "/sample-pdf.pdf";

function PDFAnnotation() {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

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

  return (
    <div className="p-4">
      <div className="w-[500px]">
        {pdfBase64 && (
          <PDFPreview
            file={pdfBase64}
            width="500px"
            height="300px"
            annotations={[
              {
                x1: 50,
                y1: 50,
                x2: 100,
                y2: 100,
                label: "Hello World",
              },
              {
                x1: 220,
                y1: 405,
                x2: 255,
                y2: 455,
                appearance: "box",
                color: "red",
                label: "Red Box",
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}

export default PDFAnnotation;
