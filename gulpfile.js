var gulp = require('gulp'),
    watch = require('gulp-watch'),
    liveReload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    moment = require('moment'),
    notify = require('gulp-notify'),
    less = require('gulp-less'),
    serve = require('gulp-serve'),
    zip = require('gulp-zip');



require('gulp-help')(gulp, {
    description: 'Help listing.'
});

gulp.task('serve', 'A simple web server.', serve({
    root: ['build'],
    port: 3000
}));

gulp.task('concat-js', 'Concat JavaScript into a single app.js.', function ()
{
    gulp.src(['src/js/options/**/*.js'])
        .pipe(concat('options-app.js'))
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(gulp.dest('build/assets/js'))
        .pipe(notify('Compiled options-app.js (' + moment().format('MMM Do h:mm:ss A') + ')'))
        .pipe(liveReload({
            auto: false
        }));
    gulp.src(['src/js/popup/**/*.js'])
        .pipe(concat('popup-app.js'))
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(gulp.dest('build/assets/js'))
        .pipe(notify('Compiled popup-app.js (' + moment().format('MMM Do h:mm:ss A') + ')'))
        .pipe(liveReload({
            auto: false
        }));
    gulp.src(['bower_components/jquery/dist/jquery.min.js','bower_components/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(concat('plugins.js'))
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(notify('Compiled plugins.js (' + moment().format('MMM Do h:mm:ss A') + ')'))
        .pipe(gulp.dest('build/assets/js'))
        .pipe(liveReload({
            auto: false
        }));

});

gulp.task('less', 'Compile less into a single app.css.', function ()
{
    gulp.src(['src/less/application.less'])
        .pipe(concat('style'))
        .pipe(less())
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(gulp.dest('build/assets/css'))
        .pipe(notify('Compiled less to style.css (' + moment().format('MMM Do h:mm:ss A') + ')'))
        .pipe(liveReload({
            auto: false
        }));
});

gulp.task('clean', function(){
    return gulp.src(['build'], {read:false})
        .pipe(clean());
});


gulp.task('move', function(){
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    return gulp.src([
        'src/manifest.json',
        'src/images/favicon.ico',
        'src/html/options.html',
        'src/html/popup.html'
    ]).pipe(gulp.dest('build'));
});


gulp.task('zip','Package extension files in a zip file.',function()
{
    gulp.src(['build/**/*']).pipe(zip('jira-pop.zip')).pipe(gulp.dest('deploy'))
});

gulp.task('watch', 'Watch for changes and live reloads Chrome. Requires the Chrome extension \'LiveReload\'.', function ()
{
    liveReload.listen();
    watch({
        glob: 'src/js/**/*.js'
    }, function ()
    {
        gulp.start('concat-js');
    });

    watch({
        glob: 'src/html/**'
    }, function ()
    {
        gulp.start('move');
    });

    watch({
        glob: 'src/less/**/*.less'
    }, function ()
    {
        gulp.start('less');
    });

    watch({
        glob: 'build/**/*.html'
    }).pipe(liveReload({
        auto: false
    }));
});

gulp.task('default', ['watch']);
gulp.task('build', ['move','concat-js','less']);