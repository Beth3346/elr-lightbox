import gulp from 'gulp';
import del from 'del';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import path from 'path';
import mocha from 'gulp-mocha';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import notifierReporter from 'mocha-notifier-reporter';

gulp.task('clean:scripts', function() {
    return del([
        'dist/'
    ]);
});

gulp.task('test', function() {
  return gulp.src(['test/test.js'], { read: false })
    .pipe(mocha({
      reporter: notifierReporter.decorate('spec')
    }));
});

gulp.task('eslint', function() {
    return gulp.src(['src/main.js', 'src/lightbox.js'])
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('babel', ['eslint'], function() {
    return gulp.src(['src/main.js', 'main.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(`dist`))
        .pipe(notify({ message: 'Babel transpiled successfully' }));
});

gulp.task('scripts', ['babel'], function() {
    return gulp.src(['dist/main.js'])
        .pipe(gulp.dest(`dist`))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('default', ['scripts']);
gulp.task('watch', ['scripts'], () => {
    gulp.watch(['src/**/*.js', 'test/**/*.js'], ['scripts']);
});