import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

// func to check if the user has selected at least two files to merge
function validateMergeFiles(files: FileList | null): string | null {
  if (!files || files.length < 2) {
    return "Please select at least two PDF files to merge.";
  }

  return null;
}

function Merge() {
  // same state thing as compress but for merging
  const [merging, setMerging] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null); // State for validation message

  // big func for merging the pdfs and downloading it
  async function mergeFiles(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = (event.currentTarget.elements.namedItem("files") as HTMLInputElement).files;
    const errorMessage = validateMergeFiles(files);
    if (!files || errorMessage) {
      setValidationMessage(errorMessage);
      return;
    }
    setValidationMessage(null);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    setMerging(true);

    try {
      const response = await fetch(`${API_URL}/merge_pdfs`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Merge failed (${response.status})`);
      }

      const mergedPdf = await response.blob();
      const downloadUrl = URL.createObjectURL(mergedPdf);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "combined.pdf";
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setMerging(false);
    }
  }

  return (
    <form onSubmit={mergeFiles}>
      {/* Validation Message that pops up if less than two files are selected */}
      {validationMessage && (
        <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
          <span aria-hidden="true">!</span>
          <span>{validationMessage}</span>
        </div>
      )}
      <input name="files" type="file" accept="application/pdf" multiple required />
      <button type="submit" className="btn btn-secondary" disabled={merging}>
        {merging && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
        {merging ? "Merging" : "Merge PDFs"}
      </button>
    </form>
  );
}

export default Merge;