import { DEFAULT_PACK_ENLARGE_SCALE } from "./productPackImage";

/**
 * Scale image content up on the same canvas (centered). Transparent edges stay transparent.
 * Used in admin to bake in pack zoom before upload.
 */
export function enlargeImage(
  file: File,
  scale = DEFAULT_PACK_ENLARGE_SCALE,
): Promise<File> {
  if (scale <= 1) return Promise.resolve(file);

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

      const scaledW = width * scale;
      const scaledH = height * scale;
      const offsetX = (width - scaledW) / 2;
      const offsetY = (height - scaledH) / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);

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
        1,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };

    img.src = url;
  });
}
