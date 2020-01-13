import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import progress from 'rollup-plugin-progress';
import resources from './lib/resourceListPlugin.js';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
export default {
  input: './sw/src/sw.ts',
  output: {
    file: './public/dist/sw.js',
    format: 'esm'
  },
  plugins: [
    progress(),
    resolve({ extensions }),
    typescript(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env']]
    }),
    resources(),
    terser({
      output: {
        comments: false
      }
    })
  ]
};