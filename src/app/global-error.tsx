"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ProFind global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#FAFAF7",
          color: "#111827",
        }}
      >
        <div style={{ textAlign: "center", padding: "1rem", maxWidth: "28rem" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            ProFind encountered an unexpected error. Please try again.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: "#009E49",
                color: "white",
                fontWeight: 600,
                padding: "0.625rem 1.5rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                backgroundColor: "white",
                color: "#111827",
                fontWeight: 500,
                padding: "0.625rem 1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid #E5E7EB",
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
