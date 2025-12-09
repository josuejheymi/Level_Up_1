// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    
    // SOLO cargamos los specs. Webpack cargará la lógica porque hicimos el import.
    files: [
      'src/utils/**/*.logic.spec.js' 
    ],

    preprocessors: {
      'src/utils/**/*.logic.spec.js': ['webpack']
    },

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          }
        ]
      }
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true
  });
};