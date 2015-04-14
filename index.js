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
    
    var srcFilename = event.path.replace(/.*?([^\/]+)$/, '$1')
    //log('srcFilename: ' + srcFilename)
    // index.js
    
    if (/\.coffee$/i.test(srcFilename)) {
        ext = 'js'
    } else if (/\.(scss|sass|less)$/i.test(srcFilename)) {
        ext = 'css'
    } else if (/\.(handlebars|hbs)$/i.test(srcFilename)) {
        ext = 'js'
    }

    if (ext) {
        distFilename = srcFilename.replace(/[^.]+$/, ext);
    } else {
        distFilename = srcFilename;
    }

    var rDirname = fStringToPrefixRegExp( process.cwd() )
    //log('rDirname: ' + rDirname)
    // ^\/Documents\/code\/gulp-watch-path\/
    
    var srcPath = event.path.replace(rDirname, '')
                            .replace(/^\//, '')
    //log('srcPath: ' + srcPath)
    // src/js/log.js


    var srcDir = srcPath.replace(fStringToSuffixRegExp(srcFilename), '')
    //log('srcDir: ' + srcDir)
    // src/js/

    var distPath = srcPath.replace(search, replace)
    //log('distPath: ' + distPath)
    // dist/js/log.js

    if (ext) {
        distPath = distPath.replace(/[^.]+$/, ext);
    }
    var distDir = distPath.replace(fStringToSuffixRegExp(distFilename), '')
    //log('distDir: ' + distDir)
    // dist/js/
    
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