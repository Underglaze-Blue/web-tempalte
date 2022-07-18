var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var htmlImport = require('gulp-html-import');
var connect = require('gulp-connect');

var rename = require('gulp-rename');
var gm = require('gulp-gm');
var sftp = require('gulp-sftp');


var src = './src';
var dist = './dist';

var retinizeOpts = {
    // Your options here.
    scaleUp: true,
};


gulp.task('html', done => {
    gulp.src([src + '/**/*.html', '!' + src + '/components/*.html'])
        .pipe(htmlImport(src + '/components/'))
        .pipe(gulp.dest(dist)).pipe(connect.reload());
    done();
});

gulp.task('fonts', done => {
    gulp.src(src + '/fonts/**')
        .pipe(gulp.dest(dist + '/fonts')).pipe(connect.reload());
    done();
});

gulp.task('images', done => {
    gulp.src(src + '/images/**')
        // .pipe(imagemin())
        .pipe(gulp.dest(dist + '/images')).pipe(connect.reload());
    done();
});

// gulp.task('2x', done => {

//     gulp.src(src + '/images/**/*.{png,jpg,jpeg}')
//         .pipe(gm(function(file,done){
//              file.size(function(err,size){
//                  done(null,file.resize(size.width * 2,size.height * 2))
//              })

//         }))
//         .pipe(rename({
//             suffix:'@2x'
//         }))
//         .pipe(gulp.dest(src + '/images'));
//     // .pipe(connect.reload());
//     done();

// });

gulp.task('css', done => {
    gulp.src(src + '/css/**/*.css')
    .on('error', function(e) {
      console.log(e.message);
    })
        .pipe(cssmin())
        .pipe(gulp.dest(dist + '/css')).pipe(connect.reload());
    done();
});

gulp.task('sass', done => {
    gulp.src(src + '/css/**/*.scss')
        .pipe(sass().on('error', sass.logError))
    .on('error', function(e) {
      console.log(e.message);
    })
        .pipe(cssmin())
        .pipe(gulp.dest(dist + '/css')).pipe(connect.reload());
    done();
});

gulp.task('js', done => {
    gulp.src(src + '/js/**/*.js')
        // .pipe(uglify())
        .pipe(gulp.dest(dist + '/js')).pipe(connect.reload());
    done();
});

gulp.task('font', done => {
    gulp.src(src + '/css/font/**')
        .pipe(gulp.dest(dist + '/font')).pipe(connect.reload());
    done();
});

gulp.task('modules', done => {
    gulp.src(src + '/css/modules/**')
        .pipe(gulp.dest(dist + '/css/modules')).pipe(connect.reload());
    done();
});

gulp.task('layui', done => {
    gulp.src(src + '/layui/**')
        .pipe(gulp.dest(dist + '/layui')).pipe(connect.reload());
    done();
});

//清理dist
gulp.task('clean', done => {
    gulp.src(dist + '/').pipe(clean());
    done();
});


//http 服务
gulp.task('serve', done => {
    connect.server({
        host: '127.0.0.1',
        root: dist,
        port: 8000,
        livereload: true
    });
    done();
});

//监听工程
gulp.task('watch', done => {
    gulp.watch([src + '/**/*.html', src + '/components/*.html'], {}, gulp.series('html'));
    gulp.watch(src + '/css/**/*.scss', {}, gulp.series('sass'));
    gulp.watch(src + '/css/**/*.css', {}, gulp.series('css'));
    gulp.watch(src + '/images/**', {}, gulp.series('images'));
    gulp.watch(src + '/fonts/**', {}, gulp.series('fonts'));
    gulp.watch(src + '/js/**/*.js', {}, gulp.series('js'));
    done();
});

//编译工程
gulp.task('build', gulp.series(gulp.parallel('html', 'js', 'css', 'sass', 'images', 'fonts', 'layui')));

//默认开发任务
gulp.task('default', gulp.series(gulp.parallel('build', 'watch', 'serve')));
gulp.task('dev', gulp.series(gulp.parallel('build', 'watch', 'serve')));



// //同步资源文件到服务器
// const ssh = {
//     cms: {
//         remotePath: '/www/wwwroot/yimi_cms/public', // 部署到服务器的路径
//         host: '111.231.98.61',  // ip地址
//         auth: 'www',
//         port: 22  // 端口
//     },
//     publicPath: dist,   // 本地程序编译好路径
// }

// gulp.task('upload',done=>{

//     console.log('## 正在部署到测试服务器上')

//     gulp.src( gulp.src([dist + '/**','!'+dist + '/pages/**','!'+dist + '/index.html']))
//         .pipe(sftp(Object.assign(ssh.cms, { callback })))

//     done();
// });