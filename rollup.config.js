import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const entries = ["src/index.ts"];

const plugins = [
  esbuild({
    target: "node14",
  }),
];

export default [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace("src/", "dist/").replace(".ts", ".mjs"),
        format: "esm",
      },
      {
        file: input.replace("src/", "dist/").replace(".ts", ".cjs"),
        format: "cjs",
        exports: "named",
      },
    ],
    external: [],
    plugins,
  })),
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace("src/", "dist/").replace(".ts", ".d.mts"),
        format: "esm",
      },
      {
        file: input.replace("src/", "dist/").replace(".ts", ".d.ts"),
        format: "esm",
      },
      {
        file: input.replace("src/", "dist/").replace(".ts", ".d.cts"),
        format: "cjs",
      },
    ],
    external: [],
    plugins: [dts({ respectExternal: true })],
  })),
];
