// @ts-check

/**
 * @type {import('next').NextConfig}
 **/

module.exports = {
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
}
