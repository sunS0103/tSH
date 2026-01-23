import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface SyllabusAndTopicsProps {
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
  topics: { id: string; value: string }[];
  sample_question_pdf_link?: string;
}

export default function SyllabusAndTopics({
  isConfirmed,
  onConfirmChange,
  topics,
  sample_question_pdf_link,
}: SyllabusAndTopicsProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex gap-2">
          <Icon
            icon="material-symbols:menu-book-outline"
            className="text-primary-500 size-6"
          />
          <h1 className="text-lg font-semibold text-gray-900 mb-4">
            Syllabus and Topics Covered
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {topics?.map((item) => (
            <div
              key={item.id}
              className="text-center bg-primary-50 text-primary-500 text-xs px-4 py-3 rounded-lg"
            >
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        {sample_question_pdf_link && (
          <Button
            variant="secondary"
            className="mt-3 group text-xs md:text-sm"
            onClick={
              () => {
                window.open(
                  sample_question_pdf_link,
                  "_blank",
                  "noopener noreferrer"
                );
              }
              // async () => {
              //   const response = await fetch(sample_question_pdf_link);
              //   const blob = await response.blob();
              //   const blobUrl = window.URL.createObjectURL(blob);

              //   // Your original code, just change href to blobUrl
              //   const link = document.createElement("a");
              //   link.href = blobUrl; // Changed from sample_question_pdf_link
              //   link.setAttribute("download", "Sample-Questions.pdf");
              //   link.rel = "noopener noreferrer";
              //   document.body.appendChild(link);
              //   link.click();
              //   document.body.removeChild(link);

              //   // Clean up
              //   window.URL.revokeObjectURL(blobUrl);
              //   // const downloadPDF = async (
              //   //   pdfUrl = sample_question_pdf_link,
              //   //   filename = "Sample-Questions.pdf"
              //   // ) => {
              //   //   try {
              //   //     // Fetch the PDF as a blob
              //   //     const response = await fetch(pdfUrl, {
              //   //       method: "GET",
              //   //       headers: {
              //   //         Accept: "application/pdf",
              //   //       },
              //   //     });

              //   //     // Check if the request was successful
              //   //     if (!response.ok) {
              //   //       throw new Error(
              //   //         `Failed to download PDF: ${response.status} ${response.statusText}`
              //   //       );
              //   //     }

              //   //     // Convert response to blob
              //   //     const blob = await response.blob();

              //   //     // Create object URL from blob
              //   //     const blobUrl = window.URL.createObjectURL(blob);

              //   //     // Create temporary anchor element
              //   //     const link = document.createElement("a");
              //   //     link.href = blobUrl;
              //   //     link.setAttribute("download", filename);
              //   //     link.rel = "noopener noreferrer";

              //   //     // Append to body, click, and remove
              //   //     document.body.appendChild(link);
              //   //     link.click();
              //   //     document.body.removeChild(link);

              //   //     // Clean up object URL after a short delay
              //   //     setTimeout(() => {
              //   //       window.URL.revokeObjectURL(blobUrl);
              //   //     }, 100);

              //   //   } catch (error) {
              //   //     console.error("Error downloading PDF:", error);
              //   //     // You can show a user-friendly error message here
              //   //     // alert(`Failed to download PDF: ${error.message}`);
              //   //     // throw error;
              //   //   }
              //   // };
              //   // downloadPDF();
              // }
            }
          >
            <Icon
              icon="humbleicons:download-alt"
              className="text-primary-500 size-4.5 group-hover:text-white"
            />
            Download Sample Questions.
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-10">
        <Checkbox
          id="syllabus-and-topics"
          checked={isConfirmed}
          onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
        />
        <Label htmlFor="syllabus-and-topics" className="inline">
          I have reviewed and understood the syllabus.
        </Label>
      </div>
    </div>
  );
}
