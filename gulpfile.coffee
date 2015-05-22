gulp = require("gulp")
elm  = require("gulp-elm")

paths = {elm : ["src/*.elm"], html: ["src/*.html"]}

gulp.task("elm-init", elm.init)

gulp.task "elm", ["elm-init"], () ->
    return gulp.src(paths.elm)
        .pipe(elm())
        .pipe(gulp.dest("build/"))

gulp.task "html", () ->
    return gulp.src(paths.html)
        .pipe(gulp.dest("build/"));

gulp.task("default", ["elm", "html"])

gulp.task "watch", () ->
    gulp.watch(paths.elm, ["elm"])
    gulp.watch(paths.html, ["html"])
