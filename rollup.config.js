import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default [
  {
    input: "./index.ts",
    output: [
      {
        file: pkg.browser,
        format: "umd",
        name: "objectro",
        compact: true
      },
      { file: pkg.main, format: "cjs", compact: true },
      { file: pkg.module, format: "esm", compact: true }
    ],
    plugins: [
      resolve({
        extensions: [".js", ".mjs", ".json", ".ts"]
      }),
      commonjs(),
      babel({
        extensions: [".ts", ".js"],
        exclude: "node_modules/**"
      }),
      terser({
        sourcemap: true
      })
    ]
  }
];
