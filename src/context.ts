import type { Document } from "./model.ts";

export function isWordInitial(document: Document, index: number): boolean {
  return index === 0 || document[index - 1].kind === "literal";
}

export function isWordFinal(document: Document, index: number): boolean {
  return index === document.length - 1 ||
    document[index + 1].kind === "literal";
}
