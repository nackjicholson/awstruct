'use strict';

var gulp = require('gulp');

gulp.task('watch', function() {
  var testFiles = [
    'es6/**/*',
    'es6/test/**/*',
    'package.json',
    '**/.jshintrc'
  ];

  gulp.watch(testFiles, ['test']);
  gulp.watch(['es6/**/*'], ['transpile']);
});
