const withTM = require("next-transpile-modules")(["ui", "ts-types"]);

module.exports = withTM({
  reactStrictMode: true,
});
