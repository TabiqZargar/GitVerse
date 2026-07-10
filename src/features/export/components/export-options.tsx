"use client";

import { useExportStore } from "../store";
import { ASPECT_RATIO_PRESETS, RESOLUTION_SCALE, type AspectRatio, type ExportResolution } from "../types";

export function AspectRatioPicker() {
  const aspectRatio = useExportStore((s) => s.options.aspectRatio);
  const setAspectRatio = useExportStore((s) => s.setAspectRatio);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(ASPECT_RATIO_PRESETS) as [AspectRatio, typeof ASPECT_RATIO_PRESETS[AspectRatio]][]).map(
          ([key, preset]) => (
            <button
              key={key}
              onClick={() => setAspectRatio(key)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
                aspectRatio === key
                  ? "border-chart-1 bg-chart-1/10"
                  : "border-glass-border hover:border-glass-border/60"
              }`}
            >
              <div
                className="rounded border border-muted-foreground/20 bg-muted"
                style={{
                  width: preset.width > preset.height ? "32px" : "20px",
                  height: preset.width > preset.height ? "20px" : "32px",
                }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">{preset.label}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export function ResolutionPicker() {
  const resolution = useExportStore((s) => s.options.resolution);
  const setResolution = useExportStore((s) => s.setResolution);
  const aspectRatio = useExportStore((s) => s.options.aspectRatio);

  const preset = ASPECT_RATIO_PRESETS[aspectRatio];
  const base = preset.width;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Resolution
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(Object.entries(RESOLUTION_SCALE) as [ExportResolution, number][]).map(([key, scale]) => (
          <button
            key={key}
            onClick={() => setResolution(key)}
            className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
              resolution === key
                ? "border-chart-1 bg-chart-1/10 text-chart-1"
                : "border-glass-border text-muted-foreground hover:border-glass-border/60"
            }`}
          >
            <span className="block capitalize">{key}</span>
            <span className="block text-[10px] opacity-60">
              {Math.round(base * scale)}w
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FormatPicker() {
  const format = useExportStore((s) => s.options.format);
  const setFormat = useExportStore((s) => s.setFormat);

  const formats = [
    { key: "png" as const, label: "PNG", desc: "Highest quality" },
    { key: "gif" as const, label: "GIF", desc: "Animated" },
    { key: "mp4" as const, label: "MP4", desc: "Video recap" },
    { key: "pdf" as const, label: "PDF", desc: "Printable report" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Format
      </label>
      <div className="grid grid-cols-2 gap-2">
        {formats.map((f) => (
          <button
            key={f.key}
            onClick={() => setFormat(f.key)}
            className={`rounded-lg border px-3 py-2 text-left transition-all ${
              format === f.key
                ? "border-chart-1 bg-chart-1/10"
                : "border-glass-border hover:border-glass-border/60"
            }`}
          >
            <span className={`block text-xs font-semibold ${format === f.key ? "text-chart-1" : "text-foreground"}`}>
              {f.label}
            </span>
            <span className="block text-[10px] text-muted-foreground">{f.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
