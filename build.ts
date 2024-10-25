import { BuildConfig } from 'bun';
import fs from 'node:fs/promises';

const name = 'greekConversion.min';
const outdir = './dist';

await fs.rm(outdir, { recursive: true, force: true });

// @fixme: variable names mangling is missing (for mapping schemas).
const commonBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  minify: true,
  outdir: outdir,
  sourcemap: 'linked',
  target: 'browser'
};

const results = await Promise.all([
  Bun.build({
    ...commonBuildConfig,
    naming: `[dir]/${name}.cjs`,
    format: 'cjs'
  }),
  Bun.build({
    ...commonBuildConfig,
    naming: `[dir]/${name}.mjs`,
    format: 'esm'
  })
]);

for (const result of results) {
  if (!result.success) {
    throw new AggregateError(result.logs, 'Build failed');
  }
}
