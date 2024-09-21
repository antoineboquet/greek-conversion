import { BuildConfig } from 'bun';

const name = 'greekConversion.min';
const outdir = './dist';

// @fixme: variable names mangling is missing (for mapping schemas).
const commonBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  minify: true,
  naming: `[dir]/${name}.[ext]`,
  outdir: outdir,
  sourcemap: 'linked',
  target: 'browser'
};

// @fixme: Cjs format isn't supported yet in Bun 1.1.29.
const results = await Promise.all([
  /*Bun.build({
    ...commonBuildConfig,
    format: 'cjs'
  }),*/
  Bun.build({
    ...commonBuildConfig,
    format: 'esm'
  })
]);

for (const result of results) {
  if (!result.success) {
    throw new AggregateError(result.logs, 'Build failed');
  }
}
