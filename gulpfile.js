var gulp = require('gulp');

var concat = require('gulp-concat'); //- 多个文件合并为一个；
var minifyCss = require('gulp-minify-css'); //- 压缩CSS为一行；
var jshint = require('gulp-jshint');//js检测 
var uglify = require('gulp-uglify');//js压缩
var rename = require('gulp-rename');//文件更名
var notify = require('gulp-notify');//提示信息
var rev = require('gulp-rev');  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换
var less = require('gulp-less'); //less处理
var base64 = require('gulp-base64');
//var fs= require('fs');
var runSequence=require('run-sequence');//按指定顺序运行任务

var res = {
	lessFiles : ['res/less/**.*']
	,jsFiles : ['res/js/**.js']
	,jsLib : ['res/js/lib/**.js']
	,jsOwn : ['res/js/main.js','res/js/about.js'] //合并js文件时按此数组顺序
	,imgFiles : ['res/images/**.*','res/images/*/*.*']
};

//对于img,生成rev-manifest.json文件
gulp.task('img-task',function(){
	return gulp.src(res.imgFiles)
		.pipe(gulp.dest('./dest/res/images'))
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest('./res/temp/rev-img'))
	;
});

//less生成css和压缩,生成rev-manifest.json文件
gulp.task('css-task',function(){
	
	return gulp.src(res.lessFiles)
		.pipe(less())//less处理
		//.pipe(concat('all.min.css'))//合并后的文件名
		.pipe(minifyCss())//压缩CSS为一行；
		.pipe(gulp.dest('./res/temp/rev-less'))//输出文件
	;
});

//base64 应用于css
gulp.task('css-base64', function () {
	return gulp.src('./res/temp/rev-less/*.css')
		.pipe(base64({
			baseDir: 'res/images',
			extensions: ['svg', 'png', /\.jpg#datauri$/i],//匹配
			exclude:    [/\.utvgo\.(com|net)/, '--live.jpg'],//不匹配
			maxImageSize: 4*1024, // bytes
			debug: true
		}))
		.pipe(gulp.dest('./res/temp/css-base64'))
	;
})

//将图片md5应用于css 图片路径里
gulp.task('rev-img-css',function(){
	return gulp.src(['res/temp/rev-img/*.json','./res/temp/css-base64/*.css'])
		.pipe(revCollector())
		.pipe(gulp.dest('./res/temp/css-img'))
	;
});
gulp.task('rev-css-manifest',function(){
	return gulp.src(['./res/temp/css-img/*.css'])
		.pipe(gulp.dest('./dest/res/css'))
		.pipe(rev())//文件名加md5后缀
		.pipe(rev.manifest())//生成一个rev-manifest.json
		.pipe(gulp.dest('./res/temp/rev-css'));//- 将 rev-manifest.json 保存到 rev-css 目录
	;
})

//将css 文件md5 应用于html的css路径里
gulp.task('rev-css',function(){
	return gulp.src(['res/temp/rev-css/*.json','./*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./res/temp/css-html'))
	;
});
//将img 文件md5 应用于html的img路径里
gulp.task('rev-img-html',function(){
	return gulp.src(['res/temp/rev-img/*.json','./res/temp/css-html/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./res/temp/img-html'))
	;
});


//检测js
gulp.task('lint',function(){
	return gulp.src(res.jsOwn)
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		//.pipe(notify({message:'lint task ok'}))
	;
});
//压缩js库
gulp.task('js-lib',function(){
	return gulp.src(res.jsLib)
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./dest/res/js/lib'))
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest('./res/temp/rev-js-lib'))
		//.pipe(notify({message:'js-lib task ok'}))
	;
});
//讲js lib文件md5应用于html的js路径里
gulp.task('res-js-lib',function(){
	return gulp.src(['res/temp/rev-js-lib/*.json','./res/temp/img-html/*.html'])
	.pipe(revCollector())
	.pipe(gulp.dest('./res/temp/js-lib-html'))

})
//合并压缩项目的js
gulp.task('js-own',function(){
	return gulp.src(res.jsOwn)
		.pipe(concat('all.js'))
		.pipe(gulp.dest('./dest/res/js'))
		.pipe(rename({suffix:'.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./dest/res/js'))
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest('./res/temp/rev-js-own'))
		//.pipe(notify({message:'js-own task ok'}))
	;

});

//讲js 文件md5应用于html的js路径里
gulp.task('res-js-own',function(){
	return gulp.src(['res/temp/rev-js-own/*.json','./res/temp/js-lib-html/*.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('./dest'))
	;

})



gulp.task('build',function(){
	runSequence(
		'img-task' //// ... just do this
		,'css-task'
		,'css-base64'
		,'rev-img-css'
		,'rev-css-manifest'
		,'rev-css'
		,'rev-img-html'
		//,'lint'
		,'js-lib'
		,'res-js-lib'
		,'js-own'
		,'res-js-own'



		//,['css-task','rev-css'] // These 2 can be done in parallel
	);
});

gulp.task('auto', function() {

	gulp.watch(res.lessFiles, ['css-task']);



});

gulp.task('default',['build']);
