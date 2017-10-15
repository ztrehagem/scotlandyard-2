const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const nop = require('gulp-nop');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const md5 = require('gulp-md5-assets');
const plumber = require('gulp-plumber');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const vueify = require('vueify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const del = require('del');

const nowTimeStr = () => new Date().toLocaleTimeString();


const srcPath = (...paths) => path.resolve(__dirname, 'browser', ...paths);
const destPath = (...paths) => path.resolve(__dirname, 'browser-dest', ...paths);

const entries = {
  pug: [srcPath('index.pug')],
  stylus: [srcPath('styles/index.styl')],
  js: [srcPath('scripts/index.js')],
};
const watch = {
  pug: [srcPath('**/*.pug')],
  stylus: [srcPath('styles/**/*.styl')],
  js: [srcPath('scripts/**/*.js')],
};
const dest = {
  html: destPath(''),
  css: destPath('css'),
  js: destPath('js'),
};
const assets = {
  html: destPath('**/*.html'),
  css: destPath('**/*.css'),
  js: destPath('**/*.js'),
};
const flags = {
  production: process.env.NODE_ENV === 'production',
  watchingJs: false,
};

gulp.task('clean', () => del.sync([destPath('**/*.@(html|css|js|map)')]));

gulp.task('enable-wathing-js', () => flags.watchingJs = true);

gulp.task('enable-production', () => flags.production = true);

gulp.task('pug', () => gulp.src(entries.pug)
  .pipe(plumber())
  .pipe(pug())
  .pipe(gulp.dest(dest.html))
);

gulp.task('stylus', () => gulp.src(entries.stylus)
  .pipe(plumber())
  .pipe(flags.production ? nop() : sourcemaps.init())
  .pipe(stylus({compress: true, include: 'node_modules', 'include css': true}))
  .pipe(autoprefixer())
  .pipe(flags.production ? nop() : sourcemaps.write('./'))
  .pipe(gulp.dest(dest.css))
);

gulp.task('js', () => {
  const destFileName = 'index.js';

  const bundler = browserify({
    entries: entries.js,
    debug: flags.production ? false : true,
    plugin: flags.watchingJs ? watchify : null,
  });

  const bundle = () => bundler.bundle()
    .on('error', (error) => {
      console.log(`[${nowTimeStr()}] js bundle error`);
      console.log(error.toString());
    })
    .pipe(source(destFileName))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(flags.production ? nop() : sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(flags.production ? nop() : sourcemaps.write('./'))
    .pipe(gulp.dest(dest.js))
    .on('end', () => console.log(`[${nowTimeStr()}] write to '${destFileName}'`));

  bundler.on('update', bundle);

  return bundle();
});

gulp.task('default', ['clean', 'pug', 'stylus', 'js'], () => gulp.src([assets.css, assets.js])
  .pipe(md5(null, assets.html))
);

gulp.task('watch', ['enable-wathing-js', 'default'], () => {
  gulp.watch(watch.pug, ['pug']);
  gulp.watch(watch.stylus, ['stylus']);
});

gulp.task('prod', ['enable-production', 'default']);
