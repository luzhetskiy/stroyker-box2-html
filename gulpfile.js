const env = process.env.NODE_ENV

const { task, watch, series, parallel, src, dest } = require('gulp');

const browserSync = require('browser-sync');
const del = require('del');
const pug = require('gulp-pug');
const typograf = require('gulp-typograf');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const favicons = require('gulp-favicons');
const babel = require("gulp-babel");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const gulpif = require('gulp-if');

const server = browserSync.create();

const paths = {
  views: {
    src:   ['./src/views/**/*.pug', '!./src/views/blocks/*.pug', '!./src/views/layouts/*.pug'],
    watch: ['./src/views/**/*'],
    build:  './build/'
  },
  styles: {
    src:   ['./src/styles/**/*.scss'],
    watch: ['./src/styles/**/*'],
    build:  './build/styles/'
  },
  scripts: {
    src:   ['./src/scripts/main.js'],
    watch: ['./src/scripts/**/*'],
    build:  './build/scripts/'
  },
  favicons: {
    src:   ['./src/favicons/*.{jpg,jpeg,png,gif}'],
    build:  './build/favicons/'
  },
  other: {
    src: [
      './src/**/*',
      '!./src/views/**',
      '!./src/styles/**', 
      '!./src/scripts/main.js', 
      '!./src/favicons/**',
    ],
    build: './build/'
  }
}

task('views', function() {
  return src(paths.views.src)
    .pipe(pug({ pretty: true }))
    .pipe(typograf({ 
      locale: ['ru', 'en']
    }))
    .pipe(dest(() => paths.views.build))
});

task('styles', function() {
  return src(paths.styles.src)
    .pipe(gulpif(env === 'development', 
      sourcemaps.init() 
    ))
    .pipe(sass.sync(env === 'production' ? { outputStyle: 'compressed' } : {}).on('error', sass.logError))
    .pipe(gulpif(env === 'production', 
      autoprefixer()
    ))
    .pipe(gulpif(env === 'development', 
      sourcemaps.write('./maps')
    ))
    .pipe(dest(paths.styles.build))
});

task('scripts', function() {
  return src(paths.scripts.src)
    .pipe(webpackStream({
      mode: process.env.NODE_ENV,
      devtool: 'eval-source-map',
      output: {
        filename: 'main.js',
      },
      performance: {
        hints: false,
        maxEntrypointSize: 1000,
        maxAssetSize: 1000
      },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', {
                'plugins': [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-transform-runtime'
                ]
              }]
            }
          },
          {
            test: /\.(frag|vert|glsl)$/,
            use: [
              { 
                loader: 'glsl-shader-loader',
                options: {}  
              }
            ]
          },
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          }
        ]
      }
    }))
    .pipe(dest(paths.scripts.build))
});

task('favicons', function () {
  return src(paths.favicons.src)
    .pipe(
      favicons({
        path: 'img/favicons/',
        html: 'index.html',
        pipeHTML: true,
        icons: {
          favicons: true,
          android: false, 
          appleIcon: false,
          appleStartup: false,
          windows: false,
          yandex: false,
        }
      })
    )
    .pipe(dest(paths.favicons.build))
});

task('other', function () {
  return src(paths.other.src)
    .pipe(dest(paths.other.build))
});

function clean(done) {
  del.sync(['build']);
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './build/'
    }
  });

  watch(paths.views.watch, series('views', reload));
  watch(paths.styles.watch, series('styles', reload));
  watch(paths.scripts.watch, series('scripts', reload));
  watch(paths.other.src, series('other', reload));
  
  done();
}

function reload(done) {
  server.reload();
  done();
}

task('default', 
  series(
    clean,
    parallel('views', 'styles', 'scripts', 'favicons', 'other'),
    serve
  )
);