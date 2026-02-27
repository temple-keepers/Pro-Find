import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ProFind Guyana — Find Trusted Tradespeople";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #001a0d 0%, #002e18 25%, #009E49 60%, #003d1e 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -40,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(252, 209, 22, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -40,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(0, 220, 90, 0.1)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🔍
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: -1,
            }}
          >
            Pro
            <span style={{ color: "#FCD116" }}>Find</span>
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          Find Trusted Tradespeople in Guyana
        </div>

        {/* Trade icons row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {["🔧", "⚡", "❄️", "🪚", "🧱", "🎨", "⚙️", "🔩"].map(
            (emoji, i) => (
              <div
                key={i}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                {emoji}
              </div>
            )
          )}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 32,
            color: "rgba(255,255,255,0.7)",
            fontSize: 16,
          }}
        >
          <span>✓ 50+ Verified Providers</span>
          <span>✓ 8 Trade Categories</span>
          <span>✓ 100% Free</span>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, background: "#009E49" }} />
          <div style={{ flex: 1, background: "#FCD116" }} />
          <div style={{ flex: 1, background: "#CE1126" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
