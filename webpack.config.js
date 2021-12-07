const path = require("path");
const fs = require("fs");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


function getTSEntryPointIfAvailable() {
  try {
    fs.accessSync("./src/scripts/index.ts", fs.constants.F_OK);
    return "./src/scripts/index.ts";
  } catch (error) {
    try {
      fs.accessSync("./src/scripts/index.js", fs.constants.F_OK);
      return "./src/scripts/index.js";
    } catch (error) {
      throw new Error("Webpack is configured to use either src/scripts/index.js or src/scripts/index.ts as an Entrypoint, you are missing both.")
    }
  }
}

const config = {
  entry: getTSEntryPointIfAvailable(),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: path.join("scripts", "bundle.js"),
  },
  module: {
    rules: [
      // Scripts
      {
        test: /\.js$|\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              sourceMaps: true,
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          }
          
        ],
      },
      // Styles
      {
        test: /\.css$|\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          /* "style-loader", */
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].css",
      chunkFilename: "styles/chunks/[id].css",
    }),
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    })
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "inline-source-map";
  }

  return config;
};

