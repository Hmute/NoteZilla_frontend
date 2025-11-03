import "../../assets/styles/summery.css";

type SummeryProps = {
  data: {
    message?: string;
    videoId?: number;
    title?: string;
    videoUrl?: string;
    transcript?: string;
    transcriptLength?: number;
    apiCalls?: number;
    remainingCalls?: number;
  };
};

const Summery = ({ data }: SummeryProps) => {
  return (
    <>
      <div className="dashed p-4">
        <div className="mb-4">
          <h3 className="extraBold mb-3">Upload Successful! ✅</h3>
          {data?.title && (
            <div className="mb-3">
              <strong>Title:</strong> {data.title}
            </div>
          )}
          {data?.videoId && (
            <div className="mb-3">
              <strong>Video ID:</strong> {data.videoId}
            </div>
          )}
          {data?.apiCalls !== undefined && (
            <div className="mb-3">
              <strong>API Calls Used:</strong> {data.apiCalls}
            </div>
          )}
          {data?.remainingCalls !== undefined && (
            <div className="mb-3">
              <strong>Remaining Calls:</strong> {data.remainingCalls}
            </div>
          )}
        </div>

        {data?.transcript && (
          <div className="transcript-section">
            <h4 className="extraBold mb-3">Transcript:</h4>
            <div
              className="transcript-content p-3"
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                maxHeight: "400px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                lineHeight: "1.6",
                color: "#212529",
              }}
            >
              {data.transcript}
            </div>
            {data?.transcriptLength && (
              <div className="mt-2" style={{ color: "#6c757d" }}>
                <small>Length: {data.transcriptLength} characters</small>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Summery;
