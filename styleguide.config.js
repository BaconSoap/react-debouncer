module.exports = {
  components: 'src/components/**/*.{ts,tsx}',
  ignore: ['**/index.ts', '**/react-lifecycles-compat.d.ts'],
  propsParser: require('react-docgen-typescript').parse,
  webpackConfig: require('react-scripts-ts/config/webpack.config.dev.js')
}
