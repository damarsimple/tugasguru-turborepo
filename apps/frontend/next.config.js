// @ts-check

/**
 * @type {import('next').NextConfig}
 **/


const withTM = require("next-transpile-modules")(["ui"]);

module.exports = withTM( {
  reactStrictMode: true,
  webpack: {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
  },
})


