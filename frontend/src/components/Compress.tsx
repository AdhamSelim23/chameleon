import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function Compress() {
  // thing for disabling and displaying the spinner while compressing
  const [compressing, setCompressing] = useState(false);

  // big func for compressing the video and downloading it
  async function compressFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // get the file from the form and check if it exists
    const file = (
      event.currentTarget.elements.namedItem("file") as HTMLInputElement
    ).files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setCompressing(true);

    // do the api, download the vid, then unset the compressing state
    try {
      const response = await fetch(`${API_URL}/videoCompress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Compression failed (${response.status})`);
      }

      // download the compressed video with the same name as the original but with "-compressed"
      const compressedVideo = await response.blob();
      const downloadUrl = URL.createObjectURL(compressedVideo);
      const downloadLink = document.createElement("a");
      const extensionIndex = file.name.lastIndexOf(".");
      const baseName =
        extensionIndex > 0 ? file.name.slice(0, extensionIndex) : file.name;
      const extension =
        extensionIndex > 0 ? file.name.slice(extensionIndex) : "";
      downloadLink.href = downloadUrl;
      downloadLink.download = `${baseName}-compressed${extension}`;
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setCompressing(false);
    }
  }

  // the component in question
  return (
    <form onSubmit={compressFile}>
      <input name="file" type="file" accept="video/*" required />
      <button
        type="submit"
        className="btn btn-secondary"
        disabled={compressing}
      >
        {compressing && (
          <span
            className="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          />
        )}
        {compressing ? "Compressing" : "Compress"}
      </button>
    </form>
  );
}

export default Compress;
