var path = require('path')
var log = console.log
var main = function (event, search, replace, ext) {
    /*
    search "/src"
    replace "/dist"
    */
    var rStringToRegExp = /([.$^{[(|)*+?\/])/g
    // .replace(rStringToRegExp,'\\$1'))
    var fStringToPrefixRegExp = function (str) {
        return new RegExp(
                '^' + (
                        str.replace(rStringToRegExp, '\\$1')
                      )
               );
    }
    var fStringToSuffixRegExp = function (str) {
        return new RegExp(
                      (
                        str.replace(rStringToRegExp, '\\$1')
                      ) + '$'
               );
    }
    if (typeof search === 'string') {
        search = fStringToPrefixRegExp(search) // src ==> \/src\/
    }
    // index.js
    var srcFilename = event.path.replace(/.*?([^\/]+)$/, '$1')
    if (ext) {
        distFilename = srcFilename.replace(/[^.]+$/, ext);
    } else {
        distFilename = srcFilename;
    }

    // ^\/Documents\/code\/gulp-watch-path\/
    var rDirname = fStringToPrefixRegExp( process.cwd() )

    // src/js/log.js
    var srcPath = event.path.replace(rDirname, '')
                            .replace(/^\//, '')
    //log('srcPath: ' + srcPath)

    // src/js/
    var srcDir = srcPath.replace(fStringToSuffixRegExp(srcFilename), '')
    //log('srcDir: ' + srcDir)

    // dist/js/log.js
    var distPath = srcPath.replace(search, replace)
    //log('distPath: ' + distPath)
    if (ext) {
        distPath = distPath.replace(/[^.]+$/, ext);
    }
    // dist/js/
    var distDir = distPath.replace(fStringToSuffixRegExp(distFilename), '')
    //log('distDir: ' + distDir)
    
    return {
        srcPath: srcPath,
        srcDir: srcDir,
        distPath: distPath,
        distDir: distDir,
        srcFilename: srcFilename,
        distFilename: distFilename
    }
}

module.exports = main