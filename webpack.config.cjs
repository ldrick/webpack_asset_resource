const path = require("path");
const fs = require("fs");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sass = require("sass");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

module.exports = {
  target: "web",
  entry: {
    "files/themes/mytheme/app": path.resolve(__dirname, "src", "app.scss"),
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerWebpackPlugin()],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    // my current ugly workaround for being not able to set the publicPath in fontawesome rule down
    /*
    new WebpackShellPluginNext({
      onBuildEnd: () =>
        new Promise((resolve, reject) => {
          const appCss = path.resolve(
            __dirname,
            "dist",
            "files",
            "themes",
            "mytheme",
            "app.css"
          );
          fs.readFile(appCss, "utf-8", (readError, data) => {
            if (readError) {
              reject(readError);
            }
            const res = data.replace(
              /\.\.\/\.\.\/\.\.\/files\/themes\/mytheme\/fontawesome\//g,
              "fontawesome/"
            );
            fs.writeFile(appCss, res, "utf-8", (writeError) => {
              if (writeError) {
                reject(writeError);
              }
              resolve("ok");
            });
          });
        }),
    }),
    */
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // eslint-disable-next-line global-require
              implementation: sass,
            },
          },
        ],
      },
      {
        test: [
          /fontawesome-free(\/|\\|\\\\).*\.(woff|woff2|eot|ttf|svg)[^.]*$/,
        ],
        type: "asset/resource",
        generator: {
          filename: "files/themes/mytheme/fontawesome/[name][ext]",
        },
      },
    ],
  },
  output: {
    filename: "[name]",
    path: path.resolve(__dirname, "dist"),
  },
};
