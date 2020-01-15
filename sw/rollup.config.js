import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
// import babel from 'rollup-plugin-babel';
import progress from 'rollup-plugin-progress';
import resources from './lib/resourceListPlugin';
import commonjs from '@rollup/plugin-commonjs';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
export default {
  input: './src/sw.ts',
  output: {
    file: '../public/dist/sw.js',
    format: 'esm'
  },
  plugins: [
    progress(),
    resolve({ extensions }),
    commonjs(),
    typescript(),
    // babel({
    //   runtimeHelpers: true,
    //   extensions,
    //   exclude: 'node_modules/**',
    //   presets: [
    //     [
    //       '@babel/preset-env',
    //       {
    //         targets: {
    //           node: 'current'
    //         }
    //       }
    //     ]
    //   ]
    // }),
    resources(),
    terser({
      output: {
        comments: false
      }
    })
  ]
};
