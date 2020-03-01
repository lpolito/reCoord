const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  rollup(config) {
    delete config.external;
    config.plugins.push(commonjs());

    return config;
  },
};
