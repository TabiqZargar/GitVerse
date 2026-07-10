"use client";

import { useCallback } from "react";
import { useExportStore } from "../store";
import { createExportJob, getExportFilename, calculateExportDimensions, triggerDownload } from "../engine/export-engine";
import type { ExportOptions } from "../types";

export function useExport() {
  const addJob = useExportStore((s) => s.addJob);
  const updateJob = useExportStore((s) => s.updateJob);
  const setActiveJob = useExportStore((s) => s.setActiveJob);
  const setPreviewUrl = useExportStore((s) => s.setPreviewUrl);

  const executeExport = useCallback(
    async (options: ExportOptions, canvas?: HTMLCanvasElement) => {
      const job = createExportJob(options);
      addJob(job);
      setActiveJob(job.id);

      try {
        updateJob(job.id, { status: "processing", progress: 10 });

        const dims = calculateExportDimensions(options.aspectRatio, options.resolution);

        let dataUrl: string;

        if (canvas) {
          const captureCanvas = document.createElement("canvas");
          captureCanvas.width = dims.width;
          captureCanvas.height = dims.height;
          const ctx = captureCanvas.getContext("2d");
          if (!ctx) throw new Error("Failed to get canvas context");

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(canvas, 0, 0, dims.width, dims.height);

          updateJob(job.id, { progress: 50 });
          dataUrl = captureCanvas.toDataURL(
            options.format === "png" ? "image/png" : "image/jpeg",
            options.quality
          );
        } else {
          dataUrl = "";
        }

        updateJob(job.id, { progress: 80 });

        const filename = getExportFilename(options);
        triggerDownload(dataUrl, filename);

        updateJob(job.id, {
          status: "complete",
          progress: 100,
          resultUrl: dataUrl,
        });

        setPreviewUrl(dataUrl);
        setActiveJob(null);

        return dataUrl;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Export failed";
        updateJob(job.id, { status: "error", error: message });
        setActiveJob(null);
        throw err;
      }
    },
    [addJob, updateJob, setActiveJob, setPreviewUrl]
  );

  return { executeExport };
}
