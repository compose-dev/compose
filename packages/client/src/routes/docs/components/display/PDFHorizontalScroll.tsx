import { useEffect, useState } from "react";
import { PDFPreview } from "~/components/pdf-preview";
import pdf from "/sample-pdf.pdf";

function PDFComponent() {
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
      <div className="w-[200px] h-[500px]">
        {pdfBase64 && (
          <PDFPreview
            file={pdfBase64}
            width="200px"
            height="500px"
            scroll="horizontal"
          />
        )}
      </div>
    </div>
  );
}

export default PDFComponent;
