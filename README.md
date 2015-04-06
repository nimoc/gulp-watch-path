# gulp-watch-path

This is for the expansion of the gulp.watch(event)

Some tasks errors can lead to `gulp.watch` is terminated, using `gulp-watch-path` can solve the problem.

> 有些 gulp 任务编译出错会终止 `gulp.watch`，使用 `gulp-watch-path` 可避免这种情况。

## Install

```
$ npm install -D gulp-watch-path
```
## Usage


**Simple:**

```js
gulp.watch('src/**/*', function (event) {
    var path = require('gulp-watch-path')(event, 'src/', 'dist/', 'node');
    console.log(path)
    /*
    path {srcPath: 'src/file.js',
          srcDir: 'src/',
          distPath: 'dist/file.node',
          distDir: 'dist/',
          srcFilename: 'file.js',
          distFilename: 'file.node' }
    */
    gulp.src(path.srcPath)
        .pipe(uglify())
        .pipe(gulp.dest(path.distDir))
})
```


**Throw an error：**:
```js
var gulp = require('gulp')
var watchPath = require('gulp-watch-path')
var uglify = require('gulp-uglify')
var combiner = require('stream-combiner2')

gulp.task('default', function () {
    gulp.watch('src/**/*.js', function (event) {
        var path = watchPath(event,'src/', 'dist/');
        /*
            path
                srcPath: 'src/file.js',
                distDir: 'dist/'
        */
        var combined = combiner.obj([
            gulp.src(path.srcPath), // src/file.js
            uglify(),
            gulp.dest(path.distDir) // dist/
        ]);
        combined.on('error', function (err) {
            console.log('--------------')
            console.log('Error')
            console.log('fileName: ' + err.fileName)
            console.log('lineNumber: ' + err.lineNumber)
            console.log('message: ' + err.message)
            console.log('plugin: ' + err.plugin)
        })

        console.log('\n')
        console.log(event.type + ': ' + path.srcPath)
        console.log('dist: ' + path.distPath)
        /*
        changed: src/file.js
        dist: dist/file.js
        */
    })
})
```
