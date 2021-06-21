/* eslint-env node */
import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
}

const name = 'reactTeleporter'
const buildName = pkg.name
const SOURCE_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')
const input = `${SOURCE_DIR}/index.js`
const external = (id) => !id.startsWith('.') && !id.startsWith('/')
const getBabelOptions = ({ useESModules }) => ({
  exclude: '**/node_modules/**',
  runtimeHelpers: true,
  configFile: path.join(__dirname, './babel.config.js'),
  plugins: [
    'babel-plugin-annotate-pure-calls',
    ['@babel/plugin-transform-runtime', { useESModules }],
  ],
})

const umdConfig = {
  input,
  output: {
    file: `${DIST_DIR}/${buildName}.umd.js`,
    format: 'umd',
    name,
    globals,
  },
  external: Object.keys(globals),
  plugins: [
    babel(getBabelOptions({ useESModules: false })),
    nodeResolve(),
    commonjs(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
  ],
}

const minConfig = {
  input,
  output: {
    file: `${DIST_DIR}/${buildName}.min.js`,
    format: 'umd',
    name,
    globals,
  },
  external: Object.keys(globals),
  plugins: [
    babel(getBabelOptions({ useESModules: true })),
    nodeResolve(),
    commonjs(),
    replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    terser(),
  ],
}

const cjsConfig = {
  input,
  output: { file: `${DIST_DIR}/${buildName}.cjs.js`, format: 'cjs' },
  external,
  plugins: [babel(getBabelOptions({ useESModules: false }))],
}

const esmConfig = {
  input,
  output: { file: `${DIST_DIR}/${buildName}.es.js`, format: 'esm' },
  external,
  plugins: [babel(getBabelOptions({ useESModules: true }))],
}

export default [esmConfig, cjsConfig, umdConfig, minConfig]
