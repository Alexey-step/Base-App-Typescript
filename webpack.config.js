import path from "path";
import HTMLWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const isProd = process.env.NODE_ENV === "production";

const optimization = () => {
  const config = {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          test: /node_modules/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  };

  if (isProd) {
    config.minimize = true;
    config.minimizer = [new TerserWebpackPlugin()];
  }

  return config;
};

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  optimization: optimization(),
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    open: false,
    port: 4200,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      inject: "body",
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/favicon.ico"),
          to: path.resolve(__dirname, "build"),
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  devtool: "source-map",
};
