import { useState, useEffect } from "react";

// ASP.NET API URL
const API_URL = "http://localhost:5000/random";
// Fetch every 1 minute
const FETCH_INTERVAL_MS = 1 * 60 * 1000;

export default function App() {
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Waiting for first fetch...");
  const [countdown, setCountdown] = useState(
    FETCH_INTERVAL_MS / 1000
  );

  // Fetch random number from API
  const fetchNumber = async () => {
    setStatus("Fetching...");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      // APPEND results (DO NOT OVERRIDE)
      setResults((prev) => [
        {
          id: Date.now(),
          number: data.number,
          generatedAt: data.generatedAt,
          fetchedAt: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);

      setStatus("Fetched successfully ✓");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  // Run once on page load
  useEffect(() => {
    // Immediate fetch
    fetchNumber();

    // Auto fetch every 1 mins
    const fetchInterval = setInterval(() => {
      fetchNumber();
      setCountdown(FETCH_INTERVAL_MS / 1000);
    }, FETCH_INTERVAL_MS);

    // Countdown every second
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Cleanup intervals
    return () => {
      clearInterval(fetchInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🎲 Random Number Feed
        </h1>

        {<p style={styles.subtitle}>Calls GET /random every 1 minutes</p> }

        {/* Status */}
        <div style={styles.statusBar}>
          <span>Status: {status}</span>

          <span style={styles.countdown}>
            Next fetch in: <strong>{countdown}s</strong>
          </span>
        </div>

      {/* Manual Fetch */}
{/* 
<button
  style={styles.button}
  onClick={fetchNumber}
>
  Fetch Now
</button> 
*/
}

        {/* Results */}
        <div style={styles.resultsList}>
          {results.length === 0 ? (
            <p style={styles.emptyText}>
              No results yet...
            </p>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                style={styles.resultItem}
              >
                <span style={styles.numberBadge}>
                  {item.number}
                </span>

                <div style={styles.resultMeta}>
                  <span>
                    Fetched at: {item.fetchedAt}
                  </span>

                  <span style={styles.dimText}>
                    Server time:{" "}
                    {new Date(
                      item.generatedAt
                    ).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <p style={styles.footer}>
          Total fetches: {results.length}
        </p>
      </div>
    </div>
  );
}

// Styles
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f4f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 16px",
    fontFamily: "'Segoe UI', sans-serif",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  title: {
    margin: "0 0 4px",
    fontSize: "28px",
    color: "#1a202c",
  },

  subtitle: {
    marginBottom: "20px",
    color: "#718096",
    fontSize: "14px",
  },

  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f7fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 14px",
    marginBottom: "16px",
    fontSize: "14px",
    color: "#4a5568",
  },

  countdown: {
    color: "#3182ce",
    whiteSpace: "nowrap",
  },

  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#3182ce",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    marginBottom: "24px",
  },

  resultsList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxHeight: "400px",
    overflowY: "auto",
  },

  emptyText: {
    textAlign: "center",
    color: "#a0aec0",
  },

  resultItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 14px",
    background: "#ebf8ff",
    border: "1px solid #bee3f8",
    borderRadius: "8px",
  },

  numberBadge: {
    minWidth: "70px",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#2b6cb0",
    fontFamily: "monospace",
  },

  resultMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    fontSize: "13px",
    color: "#4a5568",
  },

  dimText: {
    color: "#a0aec0",
  },

  footer: {
    marginTop: "16px",
    textAlign: "center",
    color: "#a0aec0",
    fontSize: "13px",
  },
};