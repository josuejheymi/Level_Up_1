module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/**/*.spec.js' // Aquí van todos los archivos de prueba
    ],
    preprocessors: {
      'src/**/*.spec.js': ['webpack']
    },
    webpack: {
      // Configuración mínima de webpack para pruebas
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
    },
    reporters: ['progress', 'coverage'],
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
