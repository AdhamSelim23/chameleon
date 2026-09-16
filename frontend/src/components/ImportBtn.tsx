import { useRef } from "react";

type ImportBtnProps = {
  selectedFile: File | null;
  onFileSelected: (file: File | null) => void;
};

function ImportBtn({ selectedFile, onFileSelected }: ImportBtnProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    onFileSelected(file);
  }

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openFilePicker}>
        Import
      </button>
      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileChange} hidden />
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </>
  );
}

export default ImportBtn;
