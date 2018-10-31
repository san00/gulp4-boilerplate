const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

//  -- Top level functions --
//  gulp.task - defines tasks
//  gulp.src - points to files
//  gulp.dest - points to folder to output
//  gulp.watch - watch files & folders for changes

// Copy all html files
gulp.task('html', function() {
  gulp.src('src/*.html').pipe(gulp.dest('dist'));
});

//Copy & minify javascript files
gulp.task('javascript', function() {
  gulp.src('src/js/*.js').pipe(uglify()).pipe(gulp.dest('dist/js'));
});

//  Optimise images
gulp.task('imagemin', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

// Compile sass & autoprefix
gulp.task('sass', function() {
  return gulp.src(['src/sass/*.scss']).pipe(sass().on('error', sass.logError)).pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false})).pipe(gulp.dest('src/css')).pipe(browserSync.stream());
});

// -- Watch & serve tasks --

gulp.task('default', [
  'sass', 'javascript', 'html', 'imagemin'
], function() {
  browserSync.init({server: './src'});

  gulp.watch('src/js/*.js', ['javascript']).on('change', browserSync.reload);
  gulp.watch('src/sass/*.scss', ['sass']);
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/*.html', ['html']);
});
