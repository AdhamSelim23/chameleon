const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function MergeBtn() {
  async function mergeFiles(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const files = (event.currentTarget.elements.namedItem("files") as HTMLInputElement).files;
    if (!files?.length) {
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

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
    }
  }

  return (
    <form onSubmit={mergeFiles}>
      <input name="files" type="file" accept="application/pdf" multiple required />
      <button type="submit" className="btn btn-secondary">Merge PDFs</button>
    </form>
  );
}

export default MergeBtn;
