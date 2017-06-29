const del          = require('del'),
      gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      babel        = require('gulp-babel'),
      notify       = require("gulp-notify"),
      uglify       = require('gulp-uglify'),
      htmlmin      = require('gulp-htmlmin'),
      cleanCSS     = require('gulp-clean-css'),
      browserSync  = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    port: 7778,
    notify: false
  });
});

gulp.task('sass', function() {
  return gulp.src('app/sass/main.sass')
    .pipe(sass()).on('error', notify.onError())
    .pipe(autoprefixer(['last 10 versions']))
    .pipe(gulp.dest('app/css'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'sass'], function() {
  gulp.src('app/css/main.css')
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 }}}))
    .pipe(gulp.dest('dist/css'));

  gulp.src('app/js/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));

  gulp.src('app/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));

  gulp.src([
    'app/**/*.svg',
    'app/**/*.png',
    'app/manifest.json',
    'app/sw.js'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('watch', ['serve', 'sass'], function() {
  gulp.watch('app/sass/**/*.sass', ['sass', browserSync.reload]);
  gulp.watch('app/js/*.js', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);
