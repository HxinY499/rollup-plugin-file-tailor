import type { EmittedFile, Plugin } from 'rollup';
import { minimatch } from 'minimatch';

type MayArray<T> = T | T[];

interface Options {
  addFiles?: MayArray<EmittedFile>;
  deleteFiles?:
    | MayArray<string | RegExp>
    | ((name: string) => boolean | undefined);
  exact?: false;
}
interface OptionsWithExact {
  addFiles?: MayArray<EmittedFile>;
  deleteFiles?: MayArray<string>;
  exact?: true;
}

export const matchNameWith = (
  patternsFun: (name: string) => boolean | undefined,
  names: string[],
  callback?: (str: string) => void
) => {
  for (const name of names) {
    if (patternsFun(name)) {
      callback(name);
    }
  }
};
export const matchName = (
  patterns: Array<string | RegExp> = [],
  names: string[],
  callback?: (str: string) => void
) => {
  for (const name of names) {
    for (const pattern of patterns) {
      if (typeof pattern === 'string') {
        minimatch(name, pattern) && callback(name);
      } else {
        pattern.test(name) && callback(name);
      }
    }
  }
};
export const exactMatchName = (
  patterns: Array<string> = [],
  names: string[],
  callback?: (str: string) => void
) => {
  for (const name of names) {
    const index = patterns.findIndex(pattern => name === pattern);
    if (index !== -1) {
      callback(name);
      patterns.splice(index, 1);
    }

    if (patterns.length === 0) break;
  }
};

export default function Plugin({
  addFiles,
  deleteFiles,
  exact,
}: Options): Plugin;
export default function Plugin({
  addFiles,
  deleteFiles,
  exact,
}: OptionsWithExact): Plugin;
export default function Plugin({
  addFiles,
  deleteFiles,
  exact,
}: Options | OptionsWithExact): Plugin {
  return {
    name: 'file-tailor',
    async generateBundle(opts, bundle) {
      if (addFiles) {
        const _addFiles = Array.isArray(addFiles) ? addFiles : [addFiles];
        _addFiles.forEach(file => {
          this.emitFile(file);
        });
      }

      if (deleteFiles) {
        if (typeof deleteFiles === 'function') {
          matchNameWith(deleteFiles, Object.keys(bundle), bundleName => {
            delete bundle[bundleName];
          });
        } else {
          const _deleteFiles = Array.isArray(deleteFiles)
            ? deleteFiles
            : [deleteFiles];
          if (exact) {
            exactMatchName(
              _deleteFiles as string[],
              Object.keys(bundle),
              bundleName => {
                delete bundle[bundleName];
              }
            );
          } else {
            matchName(
              _deleteFiles as (string | RegExp)[],
              Object.keys(bundle),
              bundleName => {
                delete bundle[bundleName];
              }
            );
          }
        }
      }
    },
  };
}
