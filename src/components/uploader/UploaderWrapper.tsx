import React, { useState, useEffect, useRef, FormEvent } from "react";

import Summery from "./Summery";
import UploaderLoader from "./UploaderLoader";
import FileUploader from "./Uploader";
import thinking from "../../assets/images/thinking.png";

import "../../assets/styles/uploader.css";
import { useAuth } from "../../context/AuthContext";

type FileType = "video" | "audio" | null;

const UploaderWrapper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [step, setStep] = useState<"uploading" | "summarizing">("uploading");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setStep("summarizing");
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setFileType(selectedFile.type.startsWith("video") ? "video" : "audio");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null); // clear old error

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/videos/upload`,
        {
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText:any = await response.text();
        setError(JSON.parse(errorText)?.message || "Upload failed");
        setLoading(false);
        return;
      }

      const json = await response.json();
      setData(json.data);
      setLoading(false);
    } catch (err: any) {
      console.log(err, 'djskljdlksjflksjdflj')
      setError(err.message || "Unexpected upload error");
      setLoading(false);
    }
  };

  return (
    <div className="container mb-5">
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="py-2 px-5 position-relative">
        {!loading && !data ? (
          <FileUploader
            file={file}
            fileType={fileType}
            previewUrl={previewUrl}
            inputRef={inputRef}
            onFileSelect={handleFile}
            onOpenFileDialog={() => inputRef.current?.click()}
          />
        ) : loading && !data ? (
          <UploaderLoader step={step} />
        ) : (
          <Summery data={data} />
        )}

        <div className="img-abs-fr">
          <img src={thinking} width={260} height={260} />
        </div>
      </form>
    </div>
  );
};

export default UploaderWrapper;
