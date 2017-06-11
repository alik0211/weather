const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      cleanCSS     = require('gulp-clean-css'),
      browserSync  = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer');

gulp.task('browser-sync', function() {
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
           .pipe(sass())
           .pipe(autoprefixer(['last 10 versions']))
           .pipe(cleanCSS({ level: {
             1: { specialComments: 0 }
           }}))
           .pipe(gulp.dest('app/css'))
           .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
  gulp.watch('app/sass/main.sass', ['sass']);
  gulp.watch('app/js/*.js', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);
