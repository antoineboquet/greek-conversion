import * as esbuild from 'esbuild';

const sharedSettings = {
  logLevel: 'info',
  entryPoints: ['./src/index.ts'],
  bundle: true,
  sourcemap: true,
  minify: true,
  mangleProps: /^LETTER|^PUNCT|^DIA/
};

await esbuild.build({
  ...sharedSettings,
  format: 'esm',
  outfile: './dist/esbuild.min.js'
});

await esbuild.build({
  ...sharedSettings,
  format: 'cjs',
  outfile: './dist/esbuild.min.cjs'
});
