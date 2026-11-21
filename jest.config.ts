/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { JestConfigWithTsJest } from 'ts-jest';

import type {Config} from 'jest';

const config: JestConfigWithTsJest = {
  transform: {
    // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
    // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
    '^.+\\.tsx?$': [
    'ts-jest',
     {
       tsconfig: {
          module: 'commonjs',
        },
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(uuid)/)" // Говорим Jest: игнорируй всё, КРОМЕ папки uuid
  ],
};

export default config;


