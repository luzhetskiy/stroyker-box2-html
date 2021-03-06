var gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    autoprefixer = require("gulp-autoprefixer"),
    pug = require('gulp-pug'),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    typograf = require('gulp-typograf'),
    favicons = require("gulp-favicons"),
    newer = require("gulp-newer"),
    watch = require("gulp-watch"),
    clean = require("gulp-clean");

let $images = ["./src/img/**/*.{jpg,jpeg,png,gif}", "!./src/img/favicons/*.{jpg,jpeg,png,gif}"],
    $images_watch = $images,

    $pug = ["./src/views/**/*.pug", "!./src/views/blocks/*.pug", "!./src/views/layout/*.pug"],
    $pug_watch = "./src/views/**/*.pug",

    $scripts = ["./src/js/*.js"],
    $scripts_watch = ["./src/js/**/*"],

    $styles = ["./src/styles/**/*.scss", "!./src/styles/components/**/*.scss"],
    $styles_watch = "./src/styles/**/*.scss",

    $favicons = "./src/img/favicons/*.{jpg,jpeg,png,gif}"

    $other = ["./src/**/*", 
              "!./src/img/**/*.{jpg,jpeg,png,gif}", 
              "!./src/img/favicons/*.{jpg,jpeg,png,gif}", 
              "!./src/js/*.js",
              "!./src/styles/**/*", 
              "!./src/views", 
              "!./src/views/**/*", 
              ];

gulp.task("pug", function() {
  return gulp.src($pug)
    .pipe(pug({pretty:true}))
    .pipe(typograf({locale:['ru']}))
    .pipe(gulp.dest("./build/"))
    .on("end", browsersync.reload);
});

gulp.task("scripts", function() {
  return gulp.src($scripts)
    .pipe(gulp.dest("./build/js/"))
    .on("end", browsersync.reload);
});

gulp.task("styles", function() {
  return gulp.src($styles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./maps/"))
    .pipe(gulp.dest("./build/styles/"))
    .on("end", browsersync.reload);
});

gulp.task("images", function () {
  return gulp.src($images)
    .pipe(newer("./build/img/"))
    .pipe(gulp.dest("./build/img/"))
    .on("end", browsersync.reload);
});

gulp.task("favicons", function () {
  return gulp.src($favicons)
    .pipe(favicons({
      icons: {
        appleIcon: true,
        favicons: true,
        online: false,
        appleStartup: false,
        android: false,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }))
    .pipe(gulp.dest("./build/img/favicons/"))
});

gulp.task("other", function () {
  return gulp.src($other)
    .pipe(gulp.dest("./build/"))
    .on("end", browsersync.reload);
});

gulp.task("clean", function () {
  return gulp.src("./build/*", {
      read: false
    })
    .pipe(clean())
});

gulp.task("serve", function () {
  return new Promise((res, rej) => {
    browsersync.init({
      server: "./build/",
      tunnel: false,
      port: 9000
    });
    res();
  });
});

gulp.task("watch", function () {
  return new Promise((res) => {
    watch($pug_watch, gulp.series("pug"));
    watch($styles_watch, gulp.series("styles"));
    watch($scripts_watch, gulp.series("scripts"));
    watch($images_watch, gulp.series("images"));
    watch($favicons, gulp.series("favicons"));
    watch($other, gulp.series("other"));
    res();
  });
});

gulp.task("default", 
  gulp.series(
    "clean",
    gulp.parallel("pug", "styles", "scripts", "images", "favicons", "other"),
    gulp.parallel("watch", "serve")
  )
);
