// Определяем константы Gulp
const {
    src,
    dest,
    watch,
    parallel,
    series
} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

function fonts() {
    return src('app/fonts/*.*')
        .pipe(fonter({
            formats: ['woff', 'ttf']
        }))
        .pipe(src('dist/fonts/*.ttf'))
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'));
}

function images() {
    return src('app/images/**/*.*')
        .pipe(src('app/images/**/*.*'))
        .pipe(newer('dist/images/'))
        .pipe(imagemin())
        .pipe(dest('dist/images/'));
}

function html() {
    return src('app/pages/**/*.pug')
        .pipe(pug({
            pretty: true
        }, '*.html'))
        .pipe(dest('dist/'));
}

function js() {
    return src('app/js/**/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/'));
}

function css() {
    return src('app/scss/*.scss')
        .pipe(
            autoprefixer({
                overrideBrowsersList: ['Last 4 version'],
                grid: true
            })
        )
        .pipe(concat('style.min.css'))
        .pipe(scss({
            outputStyle: 'compressed'
        }))
        .pipe(dest('dist/css/'));
}

function cleanDist() {
    return src('dist/')
        .pipe(clean());
}

function watching() {
    watch(['app/scss/*.scss'], css)
    watch(['app/images/**/'], images)
    watch(['app/fonts/**/'], fonts)
    watch(['app/js/**/*.js'], js)
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.watching = watching;
exports.build = series(cleanDist, parallel(html, images, fonts, css, js));
exports.default = parallel(html, images, fonts, css, js, watching);