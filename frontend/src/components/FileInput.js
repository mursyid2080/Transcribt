import React, { useRef, useState } from "react";
import "./FileInput.css";

const FileInput = ({ onFileChange, accept }) => {
  const inputRef = useRef();

  const [selectedFile, setSelectedFile] = useState(null);

  // Handle the change event when a file is selected
  const handleOnChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div>
      {/* Hidden file input element */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: "none" }}
      />

      {/* Button to trigger the file input dialog */}
      <button className="file-btn" onClick={onChooseFile}>
        <span class="material-symbols-rounded">upload</span>
      </button>

      {selectedFile && (
        <div className="selected-file">
          <p>{selectedFile.name}</p>

          <button onClick={removeFile}>
            <span class="material-symbols-rounded">delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;