import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Valueconnect Consulting — Estate Surveyors & Valuers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const root = process.cwd();
  const [oswald, mark] = await Promise.all([
    readFile(join(root, "node_modules/@fontsource/oswald/files/oswald-latin-600-normal.woff")),
    readFile(join(root, "public/brand/logo-mark-white.png"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "#051c58",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={`data:image/png;base64,${mark}`} width={120} height={100} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "Oswald", fontSize: 44, letterSpacing: 1 }}>
              <span>VALUECONNECT</span>
              <span style={{ color: "#3dd6fb", marginLeft: 12 }}>CONSULTING</span>
            </div>
            <div style={{ fontSize: 22, color: "#9eebfd", marginTop: 4 }}>Estate Surveyors &amp; Valuers</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Oswald", fontSize: 76, lineHeight: 1.08 }}>Valuation, estate agency &amp; auctioneering</div>
          <div style={{ fontFamily: "Oswald", fontSize: 76, color: "#3dd6fb", lineHeight: 1.08 }}>you can trust.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#d9e4ff" }}>
          <span>ESVARBON-registered</span>
          <span style={{ color: "#3dd6fb" }}>·</span>
          <span>Land · Buildings · Plant &amp; machinery</span>
          <span style={{ color: "#3dd6fb" }}>·</span>
          <span>Nationwide</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Oswald", data: oswald, weight: 600, style: "normal" },
      ],
    },
  );
}
