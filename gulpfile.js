const {src, dest, watch, series, parallel} = require('gulp');
const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');


function server() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });

    watch("src/*.html").on('change', browserSync.reload);
}

function minifyHtml() {
    return src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function compileScss() {
    return src('src/scss/**/*.+(scss|sass)')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({suffix: '.min', prefix: ''}))
    .pipe(prefix())
    .pipe(minify())
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
}

function minifyCss() {
    return src('src/css/*.css')
    .pipe(prefix())
    .pipe(minify())
    .pipe(dest('./dist/css'))
    .pipe(browserSync.stream());
}

function jsmin() {
    return src('src/js/*.js')
    .pipe(terser())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream());
}

function optimizeimg() {
	return src('src/images/*')
		.pipe(imagemin())
		.pipe(dest('dist/images'))
}

function optimizeIcons() {
    return src('src/images/icons/*')
    .pipe(imagemin())
    .pipe(dest('dist/images/icons'))  
}

function copyFonts() {
    return src('src/fonts/*')
    .pipe(dest('dist/fonts'))
}

function watchTask() {
    watch('src/*.html', minifyHtml);
    watch('src/css/*.css', minifyCss);
    watch('src/scss/**/*.+(scss|sass)', compileScss);
    watch('src/js/*.js', jsmin);
    watch('src/images/*', optimizeimg);
    watch('src/images/icons/*', optimizeIcons);
    watch('src/fonts/*', copyFonts);
}

exports.default = parallel(series(minifyHtml, minifyCss, compileScss, jsmin, optimizeimg, optimizeIcons, copyFonts, watchTask), server)
