export const formatCurrency = (e: number | undefined | null) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    e ?? 0
  );

export const wildCardFormatter = (e: string) => "%" + e + "%";

export const BOOLEAN_SELECT_VALUE: SelectValue[] = [
  { value: "false", name: "Tidak" },
  { value: "true", name: "Ya" },
];

export const selectExtractor = (e: {
  id: string;
  name: string;
}): SelectValue => {
  return { name: e.name, value: e.id };
};

export const selectObjectExtractor = (e: object) =>
  Object.keys(e).map((x) => {
    //@ts-ignore
    return { name: e[x] as string, value: e[x] as string };
  });

export const htmlStripper = (e: string) => e.replace(/(<([^>]+)>)/gi, "");

import ReactCrop, { Crop } from "react-image-crop";
import { SelectValue } from "../components/Forms/Form";

/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export function getCroppedImg(
  image: HTMLImageElement,
  crop: Crop,
  fileName: string
) {
  console.log(image);
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  // New lines to be added
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;

  if (!ctx) return;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL("image/jpeg");
  // return base64Image;

  return new Promise((resolve, reject) => {
    canvas.toBlob((e) => resolve(e as Blob));
  });
}

export function autocompleteMatch(input: string, arr: string[]) {
  if (input == "") {
    return [];
  }
  const reg = new RegExp(input);
  return arr.filter(function (term) {
    if (term.match(reg)) {
      return term;
    }
  });
}
