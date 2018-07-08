module.exports = {
  modify: (config, {target, dev}, webpack) => {
    // we can modify the webpack config here if we need to
    return config
  },
  // using our own scss plugin until the official one is releases
  plugins: ['kitspace-scss'],
}
