var gulp          = require('gulp'),
    sass          = require('gulp-sass')(require('sass')),
    cssmin        = require('gulp-cssmin'),
    rename        = require('gulp-rename'),
    autoprefixer  = require('gulp-autoprefixer'),
    sourcemaps    = require('gulp-sourcemaps'),
    uncss         = require('gulp-uncss'),
    uglify        = require('gulp-uglify'),
    browserSync   = require('browser-sync').create(),
    notify        = require('gulp-notify');

var assetsDir = 'src',
    coreDir = '../public_html/',
    pagesSrc = coreDir+'**/*.html',
    productionDir = '../public_html/assets/project_files';

//----------------------------------------------------Compiling

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "../public_html/"
        },
        port: 8080,
        open: false,
        notify: false
    });
});

gulp.task('jsBuild', function () {
    return gulp.src([
        'node_modules/swiper/swiper-bundle.js',
        'node_modules/jquery/dist/jquery.js',
        'node_modules/@fancyapps/ui/dist/fancybox.umd.js',
        assetsDir + '/js/**/*.js',
        '!'+assetsDir + '/js/**/*.min.js'])
        .pipe(uglify())
        .pipe(rename(function(path){
           path.extname = '.min.js';
        }))
        .pipe(gulp.dest(productionDir + '/js/'))
        .pipe(browserSync.stream())
});


gulp.task('sass', function () {
    return gulp.src([assetsDir + '/sass/**/*.scss', '!' + assetsDir + '/sass/**/_*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
        .pipe(autoprefixer(['last 5 versions']))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(productionDir + '/css/'))
});

gulp.task('cssBuild', function () {
    return gulp.src([productionDir + '/css/**/*.css','!' + productionDir + '/css/**/*.min.css'])
        .pipe(uncss({html: [pagesSrc], ignore: ['.header-grid .menu-area.active', '.active']}))
        .pipe(cssmin())
        .pipe(rename(function(path){
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest(productionDir + '/css/'))
        .pipe(browserSync.stream())
});

gulp.task('default', gulp.series('browser-sync','sass', 'cssBuild','jsBuild'));

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "../public_html/"
        },
        open: true,
        notify: false
    });
    gulp.watch(assetsDir + '/js/**/*.js', gulp.series('jsBuild')).on('change', browserSync.reload);
    gulp.watch(assetsDir + '/sass/**/*.scss', gulp.series('sass', 'cssBuild')).on('change', browserSync.reload);
    gulp.watch(pagesSrc, gulp.series('sass', 'cssBuild')).on('change', browserSync.reload);
});

