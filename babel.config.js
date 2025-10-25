module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    ["react-native-reanimated/plugin"],
    [
      "module-resolver",
      {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
          "@components": "./components",
          "@screens": "./screens",
          "@hooks": "./hooks",
          "@constants": "./constants",
          "@store": "./store",
          "@utils": "./utils",
          "@assets": "./assets",
        },
      },
    ],
  ],
};
