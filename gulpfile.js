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

gulp.task('serve:dev', function() {
  browserSync({
    server: {
      baseDir: 'tmp'
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
  return gulp.src('src/sass/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('sass:prod', function() {
  return gulp.src('src/sass/*.sass')
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 }}}))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('scripts:dev', function() {
  return gulp.src('src/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('tmp/js'));
});

gulp.task('html:dev', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('tmp'));
});

gulp.task('assets:dev', function() {
  return gulp.src([
    'src/**/*.png',
    'src/**/*.svg',
    'src/manifest.json'
  ]).pipe(gulp.dest('tmp'));
});

gulp.task('clean:tmp', function() {
  return del.sync('tmp');
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean:dist', 'sass:prod', 'html:dev'], function() {
  gulp.src('tmp/*.html')
    .pipe(removeHtml())
    .pipe(injectCSS())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));

  gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/sw.js')
    .pipe(inject.replace('cacheNameVersion', pkg.version))
    .pipe(gulp.dest('dist'));

  gulp.src([
    'src/**/*.png',
    'src/**/*.svg',
    'src/manifest.json'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('watch', ['clean:tmp', 'assets:dev', 'sass:dev', 'html:dev', 'scripts:dev', 'serve:dev'], function() {
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/sass/**/*.sass', ['sass:dev', browserSync.reload]);
  gulp.watch('src/js/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
