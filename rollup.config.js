import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

const bundle = (config) => ({
  ...config,
  input: "src/index.tsx",
  external: (id) => !/^[./]/.test(id),
});

const esbuildConfig = {
  target: "es2022",
  minify: true,
};

export default [
  bundle({
    plugins: [esbuild(esbuildConfig)],
    output: [
      {
        file: `dist/index.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: "es",
    },
  }),
];
