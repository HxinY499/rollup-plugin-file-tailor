import { expect, test } from 'vitest';
import { matchName, exactMatchName, matchNameWith } from '..';

const names = [
  'components/box/index.js',
  'components/box/index.css',
  'font/all-font.js',
  'font/all-font.css',
];

test('test matchName with glob', async () => {
  let matchCount = 0;
  matchName(['**/*.js'], names, str => {
    matchCount++;
    expect(str).toSatisfy<string>(s =>
      ['components/box/index.js', 'font/all-font.js'].includes(s)
    );
  });
  expect(matchCount).toBe(2);
});

test('test matchName with RegExp', async () => {
  let matchCount = 0;
  matchName([/.js/], names, str => {
    matchCount++;
    expect(str).toSatisfy<string>(s =>
      ['components/box/index.js', 'font/all-font.js'].includes(s)
    );
  });
  expect(matchCount).toBe(2);
});

test('test exactMatchName', async () => {
  let matchCount = 0;
  const patterns = ['font/all-font.js'];
  exactMatchName(patterns, names, str => {
    matchCount++;
    expect(str).toBe('font/all-font.js');
  });
  expect(matchCount).toBe(1);
  expect(patterns.length).toBe(0);
});

test('test matchNameWith', async () => {
  let matchCount = 0;
  matchNameWith(
    s => s === 'font/all-font.js',
    names,
    str => {
      matchCount++;
      expect(str).toBe('font/all-font.js');
    }
  );
  expect(matchCount).toBe(1);
});
