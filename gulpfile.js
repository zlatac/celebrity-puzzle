var gulp = require('gulp');
var gutil = require('gulp-util');
//var concat = require('gulp-concat');
//var uglify = require('gulp-uglify');
//var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var babel = require("gulp-babel");

gulp.task('default', ['build']);

gulp.task('celebritypuzzle', function(){
    return gulp.src(['www/scripts/main.js'])
    .pipe(babel())
    .pipe(rename("main.es5.js"))
    .pipe(gulp.dest('www/scripts'));
});
gulp.task('blessmyrequest', function(){
    return gulp.src(['www/bmr/scripts/main.js'])
    .pipe(babel())
    .pipe(rename("main.es5.js"))
    .pipe(gulp.dest('www/bmr/scripts'));
});

gulp.task('build', function() {
    gulp.watch('www/scripts/main.js', ['celebritypuzzle']);
    gulp.watch('www/bmr/scripts/main.js', ['blessmyrequest']);
  });