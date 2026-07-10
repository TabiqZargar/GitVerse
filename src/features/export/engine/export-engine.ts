import type { ExportOptions, ExportJob, AspectRatio, ExportResolution } from "../types";
import { ASPECT_RATIO_PRESETS, RESOLUTION_SCALE } from "../types";
import { THEME_DEFINITIONS, type ExportTheme } from "../types";

export function calculateExportDimensions(
  aspectRatio: AspectRatio,
  resolution: ExportResolution
): { width: number; height: number } {
  const preset = ASPECT_RATIO_PRESETS[aspectRatio];
  const scale = RESOLUTION_SCALE[resolution];
  return {
    width: Math.round(preset.width * scale),
    height: Math.round(preset.height * scale),
  };
}

export function getThemeStyles(theme: ExportTheme) {
  return THEME_DEFINITIONS[theme];
}

export function createExportJob(options: ExportOptions): ExportJob {
  return {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    status: "pending",
    options,
    progress: 0,
    createdAt: new Date().toISOString(),
  };
}

export function getExportFilename(options: ExportOptions): string {
  const viz = options.visualization;
  const theme = options.theme;
  const resolution = options.resolution;
  const ext = options.format;
  const timestamp = new Date().toISOString().slice(0, 10);
  return `gitverse-${viz}-${theme}-${resolution}-${timestamp}.${ext}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function getMimeType(format: string): string {
  switch (format) {
    case "png": return "image/png";
    case "gif": return "image/gif";
    case "mp4": return "video/mp4";
    case "pdf": return "application/pdf";
    default: return "image/png";
  }
}

export function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: string = "image/png", quality: number = 0.95): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      format === "png" ? "image/png" : "image/jpeg",
      quality
    );
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
