import commonConfig  from './webpack.common';
import webpackMerge  from 'webpack-merge';

export const createConfig = (env) => {
  if (!(env && env.env)) env.env = 'dev';
  const envConfig = require(`./webpack.${env.env}.js`).default;
  const mergedConfig = webpackMerge(commonConfig, envConfig);
  return mergedConfig;
};

export default createConfig;
