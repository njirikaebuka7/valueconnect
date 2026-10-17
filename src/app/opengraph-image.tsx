import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Valueconnect Consulting — Estate Surveyors & Valuers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const root = process.cwd();
  const [oswald, serif, mark] = await Promise.all([
    readFile(join(root, "node_modules/@fontsource/oswald/files/oswald-latin-600-normal.woff")),
    readFile(join(root, "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff")),
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
          background:
            "radial-gradient(60% 80% at 90% 0%, rgba(3,203,250,0.35), transparent 60%), radial-gradient(50% 70% at 0% 100%, rgba(18,63,179,0.7), transparent 60%), linear-gradient(160deg, #051c58, #04123a)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${mark}`} width={120} height={100} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Oswald", fontSize: 44, letterSpacing: 1 }}>
              VALUECONNECT <span style={{ color: "#3dd6fb", marginLeft: 12 }}>CONSULTING</span>
            </div>
            <div style={{ fontSize: 22, color: "#9eebfd", marginTop: 4 }}>Estate Surveyors &amp; Valuers</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Oswald", fontSize: 76, lineHeight: 1.05 }}>The true worth of property,</div>
          <div style={{ fontFamily: "Instrument Serif", fontSize: 92, color: "#3dd6fb", lineHeight: 1.05 }}>
            signed and sealed.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#d9e4ff" }}>
          <span>ESVARBON-registered</span>
          <span style={{ color: "#3dd6fb" }}>·</span>
          <span>Valuations · Agency · Facility management</span>
          <span style={{ color: "#3dd6fb" }}>·</span>
          <span>Nationwide</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Oswald", data: oswald, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
