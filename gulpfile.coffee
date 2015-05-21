gulp = require("gulp");
elm  = require("gulp-elm")

gulp.task "elm-init", elm.init

gulp.task "elm", ["elm-init"], () ->
    return gulp.src("src/*.elm")
        .pipe(elm())
        .pipe(gulp.dest("build/"))

gulp.task "html", () ->
    return gulp.src("src/*.html")
        .pipe(gulp.dest("build/"));

gulp.task("default", ["elm", "html"])
