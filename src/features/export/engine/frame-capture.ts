export interface CaptureResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export interface FrameCaptureOptions {
  width: number;
  height: number;
  quality: number;
  format: string;
}

export async function captureCanvasElement(
  canvas: HTMLCanvasElement,
  options: FrameCaptureOptions
): Promise<CaptureResult> {
  const { width, height, quality, format } = options;

  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = width;
  captureCanvas.height = height;
  const ctx = captureCanvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get 2D context for capture");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, width, height);

  const mimeType = format === "png" ? "image/png" : format === "gif" ? "image/gif" : "image/jpeg";
  const blob = await new Promise<Blob>((resolve, reject) => {
    captureCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mimeType,
      quality
    );
  });

  const dataUrl = captureCanvas.toDataURL(mimeType, quality);

  return { dataUrl, blob, width, height };
}

export async function captureDomElement(
  element: HTMLElement,
  options: FrameCaptureOptions
): Promise<CaptureResult> {
  const { width, height } = options;

  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = width;
  captureCanvas.height = height;
  const ctx = captureCanvas.getContext("2d");

  if (!ctx) throw new Error("Failed to get 2D context for capture");

  const svgDataUrl = await domToSvgDataUrl(element, width, height);
  const img = await loadImage(svgDataUrl);
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    captureCanvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png",
      options.quality
    );
  });

  const dataUrl = captureCanvas.toDataURL("image/png", options.quality);
  return { dataUrl, blob, width, height };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function domToSvgDataUrl(
  element: HTMLElement,
  width: number,
  height: number
): Promise<string> {
  const clone = element.cloneNode(true) as HTMLElement;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreign.setAttribute("width", "100%");
  foreign.setAttribute("height", "100%");

  const styleCopy = document.createElement("style");
  styleCopy.textContent = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return "";
      }
    })
    .join("\n");

  foreign.appendChild(styleCopy);
  foreign.appendChild(clone);
  svg.appendChild(foreign);

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}
