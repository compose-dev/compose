import { useState } from "react";
import FileUpload from "~/components/file-upload";

function FileDrop() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="p-4">
      <FileUpload
        label="Drop files here"
        value={files}
        setValue={setFiles}
        acceptedFileTypes={null}
        description={null}
      />
    </div>
  );
}

export default FileDrop;
