var gulp        = require('gulp'),
    gulpif      = require('gulp-if'),
    del         = require('del'),
    rename      = require('gulp-rename'),
    plumber     = require('gulp-plumber'),
    jade        = require('gulp-jade'),
    prettify    = require('gulp-html-prettify'),
    sass        = require('gulp-sass'),
    less        = require('gulp-less'),
    csslint     = require('gulp-csslint'),
    concatcss   = require('gulp-concat-css'),
    uglifycss   = require('gulp-uglifycss'),
    jshint      = require('gulp-jshint'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    imagemin    = require('gulp-imagemin'),
    copy        = require('gulp-copy'),
    config      = require('./config.json');


/* sass compile */
gulp.task('sass:compile', function() {
    gulp.src(config.path.styles.src)
        .pipe( plumber() )
        .pipe( gulpif(config.sass, sass()) )
        .pipe( gulpif(config.sass, gulp.dest(config.path.styles.dest)) );
});

/* less compile */
gulp.task('less:compile', function() {
    gulp.src(config.path.styles.src)
        .pipe( plumber() )
        .pipe( gulpif(config.less, less()) )
        .pipe( gulpif(config.less, gulp.dest(config.path.styles.dest)) );
});

/* jade compile */
gulp.task('jade:compile', function() {
    gulp.src(config.path.jade.src)
        .pipe( plumber() )
        .pipe( gulpif(config.jade, jade( {pretty : true} )) )
        .pipe( gulpif(config.jade, gulp.dest(config.path.jade.dest)) );
});

/* css lint */
gulp.task('css:lint', function() {
    gulp.src(config.path.css.src)
        .pipe( plumber() )
        .pipe( csslint({"import" : config.path.css.import}) )
        .pipe( csslint.reporter() );
});

/* css concat */
gulp.task('css:concat', function() {
    gulp.src(config.path.css.src)
        .pipe( plumber() )
        .pipe( concatcss(config.path.css.filename) )
        .pipe( gulp.dest(config.path.css.dest) );
});

/* css minify */
gulp.task('css:minify', function() {
    gulp.src(config.path.css.dest + config.path.css.filename)
        .pipe( plumber() )
        .pipe( uglifycss() )
        .pipe ( rename({suffix: '.min'}) )
        .pipe( gulp.dest(config.path.css.dest) );
});

/* jshint */
gulp.task('js:hint', function() {
    gulp.src(config.path.js.src)
        .pipe( plumber() )
        .pipe( jshint() )
        .pipe( jshint.reporter('jshint-stylish') );
});

/* js concat */
gulp.task('js:concat', function() {
    gulp.src(config.path.js.src)
        .pipe( plumber() )
        .pipe( concat(config.path.js.filename) )
        .pipe( gulp.dest(config.path.js.dest) );
});

/* js uglify */
gulp.task('js:uglify', function() {
    gulp.src(config.path.js.dest + config.path.js.filename)
        .pipe( plumber() )
        .pipe( uglify({
            mangle : config.path.js.mangle,
            preserveComments : config.path.js.preserveComments
        }) )
        .pipe( rename({suffix : ".min"}) )
        .pipe( gulp.dest(config.path.js.dest) );
});

/* html */
gulp.task('html:copy', function() {
    gulp.src(config.path.html.src)
        .pipe( gulpif(config.html, gulp.dest(config.path.html.dest)) );
});

/* clean */
gulp.task('clean', function() {
    del(['dist/*']);
});

gulp.task( 'css:develop', ['clean', 'css:lint', 'css:concat'] );
gulp.task( 'css:product', ['css:minify'] );
gulp.task( 'js:develop', ['clean', 'js:hint', 'js:concant'] );
gulp.task( 'js:product', ['js:uglify'] );