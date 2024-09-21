import { BuildConfig } from 'bun';

const name = 'greekConversion.min';
const outdir = './dist';

const commonBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  minify: true,
  naming: `[dir]/${name}.[ext]`,
  outdir: outdir,
  sourcemap: 'linked',
  target: 'browser'
};

// CJS output isn't supported as for Bun 1.1.29.
/*const cjsBuild = new Promise(() =>
  Bun.build({
    ...commonBuildConfig,
    format: "cjs"
  })
);*/

const esmBuild = new Promise(() =>
  Bun.build({
    ...commonBuildConfig,
    format: 'esm'
  })
);

Promise.all([/*cjsBuild,*/ esmBuild]);
