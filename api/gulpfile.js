var gulp   = require('gulp');
var server = require('gulp-develop-server');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src('api.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('server:start', function() {
    server.listen( { path: './api.js' } );
});

gulp.task('server:restart', function() {
    gulp.watch( [ './api.js' ], server.restart );
});

gulp.task('default', ['lint','server:start','server:restart']);
