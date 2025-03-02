module.exports = function (api) {
  api.cache(true);
  require("./env");
  return {
    presets: ['babel-preset-expo'],
    plugins: ["nativewind/babel"],
  };
};
