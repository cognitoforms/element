const browserslist = require('browserslist');

module.exports = function(api) {
  const isTest = api.env('test');
  // Polyfilling
  const polyfillExclusions = [
    'es.number.constructor',
    'es.regexp.*',
    'es.array.sort'
  ];

  let targets;

  // Target node and transform dynamic imports when testing
  if (isTest) {
    targets = { node: 'current' };
  } else { targets = browserslist(null, { env: api.env() }); }

  const plugins = [];
  if (api.env('utils')) {
    plugins.push([
      require.resolve('babel-plugin-module-resolver'), {
        root: ['element-ui'],
        alias: {
          'element-ui/src': 'element-ui/lib'
        }
      }
    ]);
  }

  return {
    plugins,
    presets: [
      '@vue/babel-preset-jsx',
      [
        '@babel/preset-env',
        {
          // debug: true,
          loose: true,
          modules: api.env('utils') ? 'commonjs' : false,
          corejs: 3,
          targets,
          // Allows use of module.exports instead of just export keyword?
          // Polyfills are automatically imported in files where features are used
          useBuiltIns: 'usage',
          exclude: polyfillExclusions
        }
      ]
    ]
  };
};
