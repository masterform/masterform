var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var autoprefixer = require('gulp-autoprefixer');
var pkg = require('./package.json');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
  ' */\n',
  '\n'
].join('');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

  // Bootstrap
  gulp.src([
    './node_modules/bootstrap/dist/**/*',
    '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
    '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
  ])
    .pipe(gulp.dest('./src/assets/vendor/bootstrap'))

  // Font Awesome 5
  gulp.src([
    './node_modules/@fortawesome/**/*'
  ])
    .pipe(gulp.dest('./src/assets/vendor'))

  // jQuery
  gulp.src([
    './node_modules/jquery/dist/*',
    '!./node_modules/jquery/dist/core.js'
  ])
    .pipe(gulp.dest('./src/assets/vendor/jquery'))

  // jQuery Easing
  gulp.src([
    './node_modules/jquery.easing/*.js'
  ])
    .pipe(gulp.dest('./vendor/jquery-easing'))

  // Simple Line Icons
  gulp.src([
    './node_modules/simple-line-icons/fonts/**',
  ])
    .pipe(gulp.dest('./src/assets/vendor/simple-line-icons/fonts'))

  gulp.src([
    './node_modules/simple-line-icons/css/**',
  ])
    .pipe(gulp.dest('./src/assets/vendor/simple-line-icons/css'))

});

// Compile SCSS
gulp.task('css:compile', function () {
  return gulp.src('./src/assets/scss/**/*.scss')
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('./src/assets/css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function () {
  return gulp.src([
    './src/assets/css/*.css',
    '!./src/assets/css/*.min.css'
  ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./src/assets/assets/css'))
    .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Default task
gulp.task('default', ['css', 'vendor']);

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: "./src"
    }
  });
});

// Dev task
gulp.task('dev', ['css', 'browserSync'], function () {
  gulp.watch('./src/assets/scss/*.scss', ['css']);
  gulp.watch('./src/**/*.html', browserSync.reload);
});
