import slugify from "slugify";
import { EMPTY_TEXT } from "../const/index.js";

export function sleep(s) {
  return new Promise((r) => setTimeout(r, s * 1000));
}

export function getNumberForText(text) {
  const regex = /\d+/g;
  const numbers = text.match(regex);
  return numbers.join(EMPTY_TEXT) ?? EMPTY_TEXT;
}

export function getIdentifierByName(txt) {
  const textStandards = txt.toLowerCase();
  return slugify(textStandards, {
    replacement: "",
    remove: undefined,
    lower: false,
    strict: false,
    locale: "vi",
    trim: true,
  });
}
