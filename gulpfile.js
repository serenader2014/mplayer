var gulp        = require('gulp');
var browserSync = require('browser-sync');
var $           = require('gulp-load-plugins')();

gulp.task('deploy',  function () {
    return gulp.src('demo/**/*')
    .pipe($.ghPages({remoteUrl: 'git@github.com:serenader2014/mplayer.git'}));
});

gulp.task('serve', ['compile', 'watch'], function () {
    browserSync.init({ server: {baseDir: 'demo'}, port: 9000});
    gulp.watch('dist/**/*').on('change', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.js', ['compile:js']);
    gulp.watch('src/**/*.scss', ['compile:css']);
});

gulp.task('compile', ['compile:js', 'compile:css']);

gulp.task('compile:css', function () {
    return gulp.src('src/**/*.scss')
    .pipe($.sass({style: 'expanded'}))
    .pipe($.autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('demo/styles'))
    .on('end', browserSync.reload);
});

gulp.task('compile:js', function () {
    return gulp.src('src/**/*.js')
    .pipe(gulp.dest('demo/scripts'))
    .on('end', browserSync.reload);
});

gulp.task('default', ['serve']);