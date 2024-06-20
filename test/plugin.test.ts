import { expect, test } from 'vitest';
import { rollup } from 'rollup';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import Plugin from '..';

test('test rollup', async () => {
  const bundle = await rollup({
    input: '../test-project/index.js',
    plugins: [
      Plugin({
        deleteFiles: ['**/*.js'],
        addFiles: [
          {
            fileName: 'newFile1.css',
            type: 'asset',
            source: 'newFile1',
          },
          {
            fileName: 'dir/newFile2.jsx',
            type: 'asset',
            source: 'newFile2',
          },
        ],
      }),
    ],
  });

  await bundle.write({
    dir: '../test-dist',
  });
  expect(
    fs.readFileSync(path.resolve(__dirname, '../test-dist/newFile1.css'), {
      encoding: 'utf-8',
    })
  ).toBe('newFile1');
  expect(
    fs.readFileSync(path.resolve(__dirname, '../test-dist/dir/newFile2.jsx'), {
      encoding: 'utf-8',
    })
  ).toBe('newFile2');
  expect(fs.existsSync(path.resolve(__dirname, '../test-dist/index.js'))).toBe(
    false
  );

  execSync('rm -rf test-dist', { cwd: path.resolve(__dirname, '../') });
});

test('test rollup function version of deleteFiles', async () => {
  const bundle = await rollup({
    input: '../test-project/index.js',
    plugins: [
      Plugin({
        deleteFiles: s => s === 'index.js',
      }),
    ],
  });

  await bundle.write({
    dir: '../test-dist2',
  });
  expect(fs.existsSync(path.resolve(__dirname, 'index.js'))).toBe(false);
  execSync('rm -rf test-dist2', { cwd: path.resolve(__dirname, '../') });
});
