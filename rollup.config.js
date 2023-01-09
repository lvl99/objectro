const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const terser = require("@rollup/plugin-terser");
const banner = require("rollup-plugin-banner").default;
const pkg = require("./package.json");

module.exports = [
  {
    input: "./index.ts",
    output: [
      {
        file: pkg.browser,
        format: "umd",
        name: "objectro",
        // compact: true,
        exports: "named"
      },
      {
        file: pkg.main,
        format: "cjs",
        // compact: true,
        exports: "named"
      },
      {
        file: pkg.module,
        format: "esm",
        // compact: true,
        exports: "named"
      }
    ],
    plugins: [
      resolve({
        extensions: [".js", ".mjs", ".json", ".ts"]
      }),
      commonjs(),
      babel({
        extensions: [".ts", ".js"],
        exclude: "node_modules/**",
        babelHelpers: "bundled"
      }),
      terser({
        sourceMap: true
      }),
      banner(
        `Objectro v<%= pkg.version %>\n© <%= pkg.author %> (<%= pkg.license %>)`
      )
    ]
  }
];
