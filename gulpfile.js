var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var cssmin = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var smushit = require('gulp-smushit');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var minifier    = require('gulp-html-minifier');
var argv = process.argv;
var fs = require('fs');

if(argv.length >= 4){
  var str = "define(function (require, exports, module) { module.exports="+argv[3].substr(2) +"})"
  fs.writeFileSync('src/config/env.js', str, 'utf8');
}

gulp.task('lib-js',function(){
    	// gulp.src('src/lib/rest.js')
    	//   .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
    	//   .pipe(gulp.dest('dist/lib/reset.js'));

    	gulp.src([
        'src/lib/reset.js',
        'src/lib/sea.js',
        'src/lib/sea-config.js',
        'src/lib/zepto.js',
        'src/lib/layer.js',
        'src/lib/underscore.js'])
    	  .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
    	  .pipe(concat('main.js'))
    	  .pipe(gulp.dest('src/lib'));


      gulp.src([
        'src/lib/reset.js',
        'src/lib/sea.js',
        'src/lib/sea-config.js',
        'src/lib/zepto.js',
        'src/lib/layer.js',
        'src/lib/iscroll.js',
        'src/lib/underscore.js'])
        .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
        .pipe(concat('main.max.js'))
        .pipe(gulp.dest('src/lib'));
})

gulp.task('common-css',function(){
    	gulp.src([
        'src/common/reset.css',
        'src/common/layer.css',
        'src/common/flex.css',
        'src/common/slider.css'])
    	  .pipe(cssmin())
    	  .pipe(concat('main.css'))
    	  .pipe(gulp.dest('src/common'));
})


gulp.task('browser', function() {
      browserSync({
        server: {
          baseDir: 'src'
        },
        port: 8080,
        // open: 'external',           // 需要域名时开启
        // host: 'pre.springrass.com'      // 需要域名时开启        
      });

      // gulp.watch([
      // 	'src/**/*.html', 
      // 	'src/**/*.css', 
      // 	'src/**/*.js'
      // ], {
      // 	cwd: 'src'
      // }, reload);

      gulp.watch("./src/**/*.{html,css,js}").on('change',reload);
      gulp.watch("./src/lib/util,js").on('change',function(){
          gulp.run('lib-js');
      });
});

gulp.task('dev', ['lib-js','common-css','browser']);


/****************生成环境**********************/

gulp.task('concat-js',function(){
      gulp.src('src/common/*.js')
        .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
        //.pipe(uglify({mangle:false}))
        .pipe(gulp.dest('dist/common'));

      gulp.src('src/lib/reset.js')
        .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
        .pipe(gulp.dest('dist/lib'));

      gulp.src([
        'src/lib/sea.js',
        'src/lib/sea-config.js',
        'src/lib/zepto.js',
        'src/lib/layer.js',
        'src/lib/underscore.js'])
        .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/lib'));


      gulp.src([
        'src/lib/sea.js',
        'src/lib/sea-config.js',
        'src/lib/zepto.js',
        'src/lib/layer.js',
        'src/lib/iscroll.js',
        'src/lib/underscore.js'])
        .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
        .pipe(concat('main.max.js'))
        .pipe(gulp.dest('dist/lib'));
})

gulp.task('concat-css',function(){
      gulp.src('src/common/reset.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/common'));

      gulp.src([
        'src/common/reset.css',
        'src/common/layer.css',
        'src/common/flex.css',
        'src/common/slider.css'])
        .pipe(cssmin())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dist/common'));
})

gulp.task('config-js',function(){
      gulp.src('src/config/env.js')
        .pipe(gulp.dest('dist/config'));
})

gulp.task('component-js',function(){
      gulp.src('src/component/**/*.js')
        .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))
        .pipe(gulp.dest('dist/component'));
})

gulp.task('view-html',function(){
      gulp.src('src/view/**/*.html')
        // .pipe(minifier())
        // .pipe(minifier({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/view'));
})

gulp.task('view-css',function(){
      gulp.src('src/view/**/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dist/view'));
})

gulp.task('view-js',function(){
      gulp.src('src/view/**/*.js')
      .pipe(uglify({mangle: {reserved: ['require' ,'exports' ,'module' ,'$']}}))        
      .pipe(gulp.dest('dist/view'));
})

gulp.task('smushit', function () {
    return gulp.src('src/images/*.{png,jpg}')
        .pipe(smushit({
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('imagemin', function () {
    return gulp.src('src/images/*.{png,jpg}')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        })).pipe(gulp.dest('dist/images'));
});

gulp.task('minifyindex',function(){
    gulp.src('src/*.html').pipe(gulp.dest('./dist'))
})

gulp.task('webpack', [
  'concat-js',
  'concat-css',
  'component-js',
  'view-html',
  'view-css',
  'view-js',
  'imagemin',
  'config-js',
  'minifyindex'
]);

