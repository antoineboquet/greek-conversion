import { build, emptyDir } from "@deno/dnt";
import denoConfig from "../deno.json" with { type: "json" };

const OUT_DIR = "./npm";
const DOCUMENTS = [
  "CHANGELOG.md",
  "LICENSE",
  "MIGRATION.md",
  "README.md",
  "RELEASING.md",
] as const;

if (denoConfig.name !== "@humanities/greek-conversion") {
  throw new Error(`Unexpected JSR package name: ${denoConfig.name}`);
}
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(denoConfig.version)) {
  throw new Error(`Invalid package version: ${denoConfig.version}`);
}

await emptyDir(OUT_DIR);

await build({
  entryPoints: [
    { name: ".", path: "./src/mod.ts" },
    { name: "./document", path: "./src/document.ts" },
  ],
  outDir: OUT_DIR,
  esModule: true,
  scriptModule: false,
  declaration: "separate",
  declarationMap: true,
  typeCheck: "single",
  test: false,
  shims: {},
  package: {
    name: "greek-conversion",
    version: denoConfig.version,
    description:
      "Bidirectional conversion between polytonic or monotonic Greek, Beta Code, and scientific transliteration.",
    author: "Antoine Boquet",
    license: "AGPL-3.0-or-later",
    homepage: "https://github.com/antoineboquet/greek-conversion#readme",
    repository: {
      type: "git",
      url: "git+https://github.com/antoineboquet/greek-conversion.git",
    },
    bugs: {
      url: "https://github.com/antoineboquet/greek-conversion/issues",
    },
    keywords: [
      "greek",
      "polytonic",
      "monotonic",
      "ancient-greek",
      "modern-greek",
      "beta-code",
      "transliteration",
      "romanization",
      "unicode",
      "humanities",
      "classics",
      "ala-lc",
      "bnf",
      "iso-843",
      "sbl",
      "tlg",
    ],
    engines: {
      node: ">=18",
    },
  },
  async postBuild(): Promise<void> {
    for (const document of DOCUMENTS) {
      await Deno.copyFile(document, `${OUT_DIR}/${document}`);
    }

    await Deno.mkdir(`${OUT_DIR}/docs`, { recursive: true });
    for await (const entry of Deno.readDir("docs")) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        await Deno.copyFile(
          `docs/${entry.name}`,
          `${OUT_DIR}/docs/${entry.name}`,
        );
      }
    }
  },
});
