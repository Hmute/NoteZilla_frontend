import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  name?: string;
}

interface Summary {
  id: number;
  title: string;
  summary: string;
  createdAt: string;
  user?: User;
}

const SummaryList: React.FC = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/videos/summaries`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: 'include',
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data: any) => {
          setSummaries(
            data?.data.videos
          );

          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading)
    return (
      <div className="text-center text-muted mt-5">Loading summaries...</div>
    );

  if (error)
    return <div className="alert alert-danger text-center">Error: {error}</div>;

  return (
    <div className="container mt-2">
      <h2 className="mb-4 color-primary">Lecture Summaries</h2>

      {summaries.length === 0 ? (
        <div className="alert alert-info">No summaries found.</div>
      ) : (
        <div className="row">
          {summaries.map((summary) => (
            <div key={summary.id} className="col-md-4 mb-4">
              <div
                className="card shadow-sm h-100 summary-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/summery/${summary.id}`)}
              >
                <div className="card-body">
                  <p className="bold font-size-16px">
                    {summary.title}
                  </p>
                  <small className="text-muted">
                    {new Date(summary.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SummaryList;
