import denoConfig from "../deno.json" with { type: "json" };

const tag = Deno.args[0];
const expectedTag = `v${denoConfig.version}`;

if (tag !== expectedTag) {
  throw new Error(`Release tag ${tag} does not match ${expectedTag}.`);
}

const prerelease = denoConfig.version.split("-", 2)[1];
const npmTag = prerelease === undefined
  ? "latest"
  : prerelease.startsWith("beta")
  ? "beta"
  : "next";

const outputPath = Deno.env.get("GITHUB_OUTPUT");
if (outputPath === undefined) {
  throw new Error("GITHUB_OUTPUT is not available.");
}

await Deno.writeTextFile(
  outputPath,
  `version=${denoConfig.version}\nnpm_tag=${npmTag}\n`,
  { append: true },
);
