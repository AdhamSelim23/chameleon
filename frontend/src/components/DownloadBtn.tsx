const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function DownloadBtn() {
  async function downloadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = new FormData(event.currentTarget).get("url");

    if (typeof url !== "string" || !url.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/urltomp4`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(url.trim()),
      });

      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }

      const video = await response.blob();
      const downloadUrl = URL.createObjectURL(video);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "download.mp4";
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={downloadVideo}>
      <input name="url" type="url" placeholder="Video URL" required />
      <button type="submit" className="btn btn-secondary">Download video</button>
    </form>
  );
}

export default DownloadBtn;
