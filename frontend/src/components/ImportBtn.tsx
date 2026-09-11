import { useRef, useState } from "react";

function ImportBtn() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openFilePicker}>
        Import
      </button>
      <input ref={fileInputRef} type="file" onChange={handleFileChange} hidden />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </>
  );
}

export default ImportBtn;
