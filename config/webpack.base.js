
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader','css-loader','sass-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader','css-loader','less-loader'],
      },
      // {//更改ant主题颜色
      //   test: /\.less$/,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     {
      //       loader: 'less-loader',
      //       options: {
      //         modifyVars: {
      //           '@primary-color': '#ff6800'
      //         },
      //         'javascriptEnabled': true
      //       }
      //     }
      //   ]
      // },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
