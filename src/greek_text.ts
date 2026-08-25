import { encode, parse } from "./conversion.ts";
import {
  type ConversionResult,
  findConversionLosses,
} from "./losses.ts";
import type { Document, Format } from "./model.ts";
import type { ConversionOptions } from "./options.ts";
import {
  type PresetOptions,
  resolveConversionOptions,
} from "./presets.ts";

/** An immutable, reusable view of one semantically parsed Greek text. */
export class GreekText {
  readonly source: string;
  readonly sourceFormat: Format;

  readonly #document: Document;
  readonly #options: PresetOptions;
  readonly #outputs = new Map<Format, string>();

  constructor(
    source: string,
    sourceFormat: Format,
    options: ConversionOptions = {},
  ) {
    this.source = source;
    this.sourceFormat = sourceFormat;
    this.#options = resolveConversionOptions(options);
    this.#document = parse(source, sourceFormat, this.#options);
    Object.freeze(this);
  }

  /** Returns a detached canonical document; mutations cannot affect the text. */
  get document(): Document {
    return cloneDocument(this.#document);
  }

  /** Returns a detached copy of the resolved options. */
  get options(): PresetOptions {
    return resolveConversionOptions(this.#options);
  }

  get greek(): string {
    return this.to("greek");
  }

  get betaCode(): string {
    return this.to("beta-code");
  }

  get transliteration(): string {
    return this.to("transliteration");
  }

  /** Encodes the canonical document and caches the selected representation. */
  to(format: Format): string {
    const cached = this.#outputs.get(format);
    if (cached !== undefined) return cached;

    const output = encode(this.#document, format, this.#options);
    this.#outputs.set(format, output);
    return output;
  }

  /** Encodes once and reports information lost from the canonical source. */
  toDetailed(format: Format): ConversionResult {
    const output = this.to(format);
    const target = parse(output, format, this.#options);
    const losses = findConversionLosses(this.#document, target);

    return { output, lossy: losses.length > 0, losses };
  }
}

function cloneDocument(document: Document): Document {
  return document.map((token) =>
    token.kind === "literal"
      ? { ...token }
      : { ...token, diacritics: new Set(token.diacritics) }
  );
}
