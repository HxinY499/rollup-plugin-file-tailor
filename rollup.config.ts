import ts from '@rollup/plugin-typescript';
import fs from 'fs';
import { defineConfig } from 'rollup';

function getPackageJSON() {
  const str = fs.readFileSync('./package.json', { encoding: 'utf-8' });
  return JSON.parse(str);
}

const pkg = getPackageJSON();

export default defineConfig({
  input: './index.ts',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      exports: 'named',
      footer: 'module.exports = Object.assign(exports.default, exports);',
    },
    {
      format: 'es',
      file: pkg.module,
    },
  ],
  plugins: [
    ts({
      exclude: ['rollup.config.ts', './test/*.ts'],
    }),
  ],
  external: Object.keys({
    ...pkg.dependencies,
    ...pkg.peerDependencies,
    ...pkg.devDependencies,
  }),
});
