/** Only near-pure studio black (not character linework or pack art). */
const BLACK_THRESHOLD = 28;

function isRemovableBackground(r: number, g: number, b: number, a: number) {
  if (a < 8) return true;
  return r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD;
}

/**
 * Flood-fill from image edges: studio-black borders become transparent.
 * Interior black (outlines, text) is left intact.
 * Only used for product pack shots — not character art.
 */
export function stripEdgeBlackBackground(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: width, naturalHeight: height } = img;
      if (!width || !height) {
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const visited = new Uint8Array(width * height);
      const queue: number[] = [];

      const index = (x: number, y: number) => y * width + x;

      const enqueueIfBackground = (x: number, y: number) => {
        const i = index(x, y);
        if (visited[i]) return;
        const p = i * 4;
        if (!isRemovableBackground(data[p], data[p + 1], data[p + 2], data[p + 3])) return;
        visited[i] = 1;
        queue.push(i);
      };

      for (let x = 0; x < width; x++) {
        enqueueIfBackground(x, 0);
        enqueueIfBackground(x, height - 1);
      }
      for (let y = 0; y < height; y++) {
        enqueueIfBackground(0, y);
        enqueueIfBackground(width - 1, y);
      }

      let removed = false;
      while (queue.length > 0) {
        const i = queue.pop()!;
        const p = i * 4;
        if (data[p + 3] > 0) removed = true;
        data[p + 3] = 0;

        const x = i % width;
        const y = Math.floor(i / width);
        if (x > 0) enqueueIfBackground(x - 1, y);
        if (x < width - 1) enqueueIfBackground(x + 1, y);
        if (y > 0) enqueueIfBackground(x, y - 1);
        if (y < height - 1) enqueueIfBackground(x, y + 1);
      }

      if (!removed) {
        resolve(file);
        return;
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const base = file.name.replace(/\.[^.]+$/, "") || "image";
          resolve(new File([blob], `${base}.png`, { type: "image/png" }));
        },
        "image/png",
        1
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };

    img.src = url;
  });
}

/** Product pack shots only — character art has black linework that must not be stripped. */
export function shouldStripBackground(bucket: string) {
  return bucket === "product-images";
}
