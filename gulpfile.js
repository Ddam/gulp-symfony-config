'use strict';

var async = require('async');
var gulp = require('gulp');
var gutil = require('gulp-util');
// Load plugins
var plugins = require('gulp-load-plugins')();
plugins.runSequence = require('run-sequence');
plugins.del = require('del');
plugins.streamqueue = require('streamqueue');
var assets = require('./assets.json');
var jsFilter = plugins.filter('**/*.js');
var cssFilter = plugins.filter('**/*.css');

gulp.task('compass', function() {
    return gulp.src('app/Resources/assets/styles/**/*.scss')
    .pipe(plugins.changed('tmp/assets/styles'))
    .pipe(plugins.rubySass({
        style: 'expanded',
        loadPath: ['web/assets/vendor', 'web/assets/vendor/bootstrap-sass-official/assets/stylesheets']
    }))
    .pipe(plugins.autoprefixer('last 1 version'))
    .pipe(gulp.dest('tmp/assets/styles'));
});

gulp.task('clean', function(cb) {
    return plugins.del(['tmp/**/*', 'web/assets/**/*'], cb);
});

gulp.task('fonts', function() {
    var stream = plugins.streamqueue({ objectMode: true });

    stream.queue(gulp.src('web/assets/vendor/bootstrap-sass-official/assets/fonts/bootstrap/**'));
    return stream.done()
    .pipe(gulp.dest('web/assets/fonts/bootstrap'));

    stream.queue(gulp.src('app/Resources/assets/fonts/**'));
    return stream.done()
    .pipe(gulp.dest('web/assets/fonts'));
});

/**
* This is needed for mapping glyphs and codepoints.
*/
function mapGlyphs(glyph) {
    return { name: glyph.name, codepoint: glyph.unicode[0].charCodeAt(0) }
}

gulp.task('iconfont', function(done){
    var iconStream = gulp.src(['app/Resources/assets/icons/*.svg'])
    .pipe(plugins.iconfont({
        fontName: 'icons-font',
        normalize: true,
        fontHeight: 1001,
        formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
    }));

    async.parallel([
        function handleGlyphs (cb) {
            iconStream.on('glyphs', function(glyphs, options) {
                gulp.src('app/Resources/assets/templates/icons-font.css')
                .pipe(plugins.consolidate('lodash', {
                    glyphs: glyphs.map(mapGlyphs),
                    fontName: 'icons-font',
                    fontPath: '../fonts/',
                    className: 'ifont'
                }))
                .pipe(gulp.dest('web/assets/css/'))
                .on('finish', cb);
            });
        },
        function handleFonts (cb) {
            iconStream
            .pipe(gulp.dest('web/assets/fonts/'))
            .on('finish', cb);
        }
    ], done);
});

gulp.task('styles', ['compass'], function() {
    var stream = plugins.streamqueue({ objectMode: true });

    // concat styles files
    Object.keys(assets.styles).forEach(function(key) {
        stream.queue(gulp.src(assets.styles[key]).pipe(plugins.concat(key)));
    });

    return stream.done()
    .pipe(gulp.dest('web/assets'))
});

gulp.task('scripts', function() {
    var stream = plugins.streamqueue({ objectMode: true });

    // concat scripts files
    Object.keys(assets.scripts).forEach(function(key) {
        stream.queue(gulp.src(assets.scripts[key]).pipe(plugins.concat(key)));
    });

    return stream.done()
    .pipe(gulp.dest('web/assets'))
});

gulp.task('optimize', ['scripts', 'styles', 'fonts'], function() {
    return gulp.src('web/assets/**/*')
    .pipe(plugins.changed('web/assets/**/*'))
    .pipe(jsFilter)
    .pipe(plugins.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(plugins.csso("--restructure-off"))
    .pipe(cssFilter.restore())
    .pipe(gulp.dest('web/assets'))
});

gulp.task('watch', function () {
    gulp.watch('app/Resources/assets/styles/**/*.scss', ['styles']);
    gulp.watch('app/Resources/assets/scripts/**/*.js', ['scripts']);
    gulp.watch('app/Resources/assets/icons/**/*.svg', ['iconfont']);
});

gulp.task('bower-install', function () {
    plugins.bower()
});