const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const glob = require("glob");
const PATHS = { src: path.join(__dirname, "src") };

module.exports = {
  mode: "development",
  entry: ["./src/index.js", "./src/styles/index.scss"],
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },

  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: "html-loader",
      //       options: {
      //         minimize: true,
      //         // sources: false,
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "images",
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        // options: { sourceMap: true }
      },
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        // options: { sourceMap: true }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: { name: "fonts/[name].[ext]" },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      minify: {
        collapseWhitespace: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    new OptimizeCSSAssetsPlugin({
      test: /\.scss$/i,
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
    }),
    new CleanWebpackPlugin(),
    new UglifyJsPlugin({
      test: /\.js$/,
    }),
    new CopyPlugin({
      patterns: [{ from: "src/images", to: "images" }],
    }),
  ],
};
