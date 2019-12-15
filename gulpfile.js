var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var pug = require("gulp-pug");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var minify = require("gulp-minify-css");
var pump = require("pump");

gulp.task("serve", function() {
	browserSync.init({
		server: "./dist"
	});

	gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
	gulp.watch("src/pug/**/*.pug", gulp.series("pug"));
	gulp.watch("src/script/*.js", gulp.series("js"));
});

gulp.task(
	"sass",
	gulp.series(function(cb) {
		pump(
			[
				gulp.src("src/scss/style.scss"),
				sourcemaps.init(),
				sass().on("error", sass.logError),
				autoprefixer({
					cascade: false
				}),
				sourcemaps.write(),
				gulp.dest("dist/assets/css"),
				browserSync.stream()
			],
			cb
		);
	})
);

gulp.task(
	"pug",
	gulp.series(function() {
		return gulp
			.src("src/pug/*.pug")
			.pipe(pug({ pretty: true }))
			.pipe(gulp.dest("dist"))
			.pipe(browserSync.stream());
	})
);

gulp.task(
	"js",
	gulp.series(function(cb) {
		pump([gulp.src("src/script/*.js"), sourcemaps.init(), babel(), sourcemaps.write(), gulp.dest("dist/assets/js"), browserSync.stream()], cb);
	})
);

gulp.task("default", gulp.parallel("sass", "pug", "serve"));
