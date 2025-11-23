import React, { ChangeEvent, DragEvent, RefObject, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

type Props = {
  file: File | null;
  fileType: "video" | "audio" | null;
  previewUrl: string | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (file: File) => void;
  onOpenFileDialog: () => void;
};

const FileUploader: React.FC<Props> = ({
  file,
  fileType,
  previewUrl,
  inputRef,
  onFileSelect,
  onOpenFileDialog,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const withAuthGuard =
    <T extends (...args: any[]) => any>(fn: T) =>
    (...args: Parameters<T>): ReturnType<T> | void => {
      if (!isAuthenticated) {
        Swal.fire({
          title: "Login Required",
          text: "Please log in to continue.",
          icon: "warning",
          background: "var(--dark)",
          color: "#fff",

          showCancelButton: true,
          confirmButtonText: "Login",

          confirmButtonColor: "var(--primary)",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
        });

        return;
      }
      console.log("Authenticated, proceeding with action.");
      return fn(...args);
    };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onFileSelect(selectedFile);
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  };

  return (
    <div
      className={`dashed d-flex flex-column justify-content-center align-items-center drop-zone p-3 text-center ${
        dragActive ? "drag-active" : ""
      }`}
      onDragOver={withAuthGuard(handleDragOver)}
      onDragLeave={withAuthGuard(handleDragLeave)}
      onDrop={withAuthGuard(handleDrop)}
    >
      {!file && (
        <>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="90"
              height="90"
              fill="currentColor"
              className="bi bi-cloud-arrow-up-fill icon-color mb-3"
              viewBox="0 0 16 16"
            >
              <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
            </svg>
          </div>
          <h4 className="extraBold">Drag & drop a .mp4 or .mp3 file</h4>
          <p className="text-muted">or</p>
        </>
      )}

      {file && (
        <div className="mt-4">
          <strong>Selected file:</strong> {file.name}
        </div>
      )}

      {previewUrl && fileType === "video" && (
        <div className="mt-3">
          <video key={previewUrl} controls width="100%">
            <source src={previewUrl} />
          </video>
        </div>
      )}

      {previewUrl && fileType === "audio" && (
        <div className="mt-3">
          <audio key={previewUrl} controls>
            <source src={previewUrl} />
          </audio>
        </div>
      )}

      {file && (
        <button
          type="submit"
          className="btn primary-button min-width extraBold mt-3"
        >
          Upload
        </button>
      )}
      
      <button
        type="button"
        className="btn choose-file-btn py-2 px-3 m-3 bold min-width"
        onClick={withAuthGuard(onOpenFileDialog)}
      >
        {!file ? "Select Video" : "Select Another Video"}
      </button>
      <input
        type="file"
        accept="video/*,audio/*"
        className="d-none"
        ref={inputRef}
        onChange={handleFileChange}
      />

    </div>
  );
};

export default FileUploader;
