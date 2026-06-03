import postcssPresetEnv from 'postcss-preset-env';

// Replaces the old postcss-cssnext toolchain: nesting, custom properties,
// modern color/selector features, and autoprefixing.
export default {
  plugins: [postcssPresetEnv({ stage: 1 })],
};
