type CompressBtnProps = {
  file: File | null;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function CompressBtn({ file }: CompressBtnProps) {
  async function compressFile() {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // the big api call
    try {
      const response = await fetch(`${API_URL}/videoCompress`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Compression failed (${response.status})`);
      }

      const compressedVideo = await response.blob();
      const downloadUrl = URL.createObjectURL(compressedVideo);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "output.mp4";
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-secondary" onClick={compressFile} disabled={!file}>
        Compress
      </button>
    </div>
  );
}

export default CompressBtn;
