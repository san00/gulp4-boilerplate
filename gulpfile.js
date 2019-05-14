const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const { parallel } = require("gulp");

//  -- Functions --
//  src - points to files
//  dest - points to output folder 


// Copy html files
function copyHtml() {
  return gulp
    .src("src/*.html").pipe(gulp.dest("dist"));
};

//Copy & minify javascript files
function minifyJs() {
  return gulp
    .src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
};

//  Optimise images
function imageOptim() {
  return gulp
    .src("src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
};

// Compile Sass & autoprefix
function compileSass() {
  return gulp
    .src("src/sass/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ browsers: ["last 2 versions"], cascade: false }))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
};

//  Watch for changes & reload browser
function watch() {
  browserSync.init({ server: "./dist" });
  gulp.watch("src/sass/**/*.scss", compileSass);
  gulp.watch("src/*.html", copyHtml).on("change", browserSync.reload);
  gulp.watch("src/js/**/*.js", minifyJs).on("change", browserSync.reload);
};

exports.default = parallel(copyHtml, compileSass, imageOptim, minifyJs, watch);