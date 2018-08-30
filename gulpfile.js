const del          = require('del'),
      pkg          = require('./package.json'),
      gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      babel        = require('gulp-babel'),
      concat       = require('gulp-concat'),
      inject       = require('gulp-inject-string'),
      notify       = require('gulp-notify'),
      uglify       = require('gulp-uglify'),
      htmlmin      = require('gulp-htmlmin'),
      cleanCSS     = require('gulp-clean-css'),
      injectCSS    = require('gulp-inject-css'),
      removeHtml   = require('gulp-remove-html'),
      sourcemaps   = require('gulp-sourcemaps'),
      browserSync  = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    port: 7777,
    notify: false
  });
});

gulp.task('serve:dist', ['build'], function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: 7778,
    notify: false
  });
});

gulp.task('sass:dev', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'));
});

gulp.task('sass:prod', function() {
  return gulp.src('app/sass/*.sass')
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 }}}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass:prod'], function() {
  gulp.src('app/*.html')
    .pipe(removeHtml())
    .pipe(injectCSS())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));

  gulp.src('app/js/*.js')
    .pipe(concat('main.js'))
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  gulp.src('app/sw.js')
    .pipe(inject.replace('cacheNameVersion', pkg.version))
    .pipe(gulp.dest('dist'));

  gulp.src([
    'app/**/*.png',
    'app/**/*.svg',
    'app/manifest.json'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('watch', ['sass:dev', 'serve'], function() {
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/sass/**/*.sass', ['sass:dev', browserSync.reload]);
  gulp.watch('app/js/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
