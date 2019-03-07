const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");

//  -- Functions --
//  gulp.task - defines tasks
//  gulp.src - points to files
//  gulp.dest - points to folder to output
//  gulp.watch - watch files & folders for changes

// Copy all html files
gulp.task(
  "html",
  gulp.series((done) => {
    gulp.src("src/*.html").pipe(gulp.dest("dist"));
    done();
  })
);

// //Copy & minify javascript files
gulp.task(
  "javascript",
  gulp.series((done) => {
    gulp
      .src("src/js/*.js")
      .pipe(uglify())
      .pipe(gulp.dest("dist/js"));
    done();
  })
);

//  Optimise images
gulp.task(
  "imagemin",
  gulp.series((done) => {
    gulp
      .src("src/images/*")
      .pipe(imagemin())
      .pipe(gulp.dest("dist/images"));
    done();
  })
);

// Compile sass & autoprefix
gulp.task(
  "sass",
  gulp.series((done) => {
    gulp
      .src("src/sass/*.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(autoprefixer({ browsers: ["last 2 versions"], cascade: false }))
      .pipe(gulp.dest("dist/css"))
      .pipe(browserSync.stream());
    done();
  })
);

// -- Watch & serve tasks --
gulp.task(
  "default",
  gulp.parallel("html", "sass", "javascript", "imagemin", (done) => {
    browserSync.init({ server: "./dist" }); //* root changed
    gulp.watch(["src/js/*.js", "javascript"]).on("change", browserSync.reload);
    gulp.watch("src/sass/*.scss", gulp.series("sass"));
    gulp.watch("dist/*.css").on("change", browserSync.reload); //* watch added
    gulp.watch("src/*.html").on("change", browserSync.reload);
    gulp.watch("src/*.html", gulp.series("html"));
    done();
  })
);

//Note - see * for changes to fix issue with browsersync not updating. 
