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

gulp.task('reload', function(cb) {
  browserSync.reload();

  cb();
});

gulp.task('serve:dev', function() {
  browserSync({
    server: {
      baseDir: 'tmp'
    },
    port: 7777,
    notify: false
  });
});

gulp.task('serve:dist', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },
    port: 7778,
    notify: false
  });
});

gulp.task('sass:dev', function(cb) {
  gulp.src('src/sass/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('tmp/css'));

  cb();
});

gulp.task('sass:prod', function() {
  return gulp.src('src/sass/*.sass')
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 }}}))
    .pipe(gulp.dest('tmp/css'));
});

gulp.task('scripts:dev', function(cb) {
  gulp.src('src/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('tmp/js'));

  cb();
});

gulp.task('html:dev', function() {
  return gulp.src('src/*.html').pipe(gulp.dest('tmp'));
});

gulp.task('assets:dev', function(cb) {
  gulp.src([
    'src/**/*.png',
    'src/**/*.svg',
    'src/manifest.json'
  ]).pipe(gulp.dest('tmp'));

  cb();
});

gulp.task('clean:tmp', function(cb) {
  del.sync('tmp');

  cb();
});

gulp.task('clean:dist', function(cb) {
  del.sync('dist');

  cb();
});

gulp.task('html:prod', function() {
  return gulp.src('tmp/*.html')
    .pipe(removeHtml())
    .pipe(injectCSS())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:prod', function(cb) {
  gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/sw.js')
    .pipe(inject.replace('cacheNameVersion', pkg.version))
    .pipe(gulp.dest('dist'));

  cb();
});

gulp.task('assets:prod', function() {
  gulp.src([
    'src/**/*.png',
    'src/**/*.svg',
    'src/manifest.json'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('watch', function(cb) {
  gulp.watch('src/*.html', gulp.series('html:dev', 'reload'));
  gulp.watch('src/sass/**/*.sass', gulp.series('sass:dev', 'reload'));
  gulp.watch('src/js/*.js', gulp.series('scripts:dev', 'reload'));

  cb();
});

gulp.task('build', gulp.series('clean:dist', 'clean:tmp', 'sass:prod', 'html:dev', 'html:prod', 'scripts:prod'));

gulp.task('default', gulp.series('clean:tmp', 'assets:dev', 'sass:dev', 'html:dev', 'scripts:dev', 'watch', 'serve:dev'));
