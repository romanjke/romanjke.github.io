"use strict";

var gulp = require('gulp'),
	pug = require('gulp-pug'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	prefix = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	browserSync = require('browser-sync').create();

var useref = require('gulp-useref'),
	gulpif = require('gulp-if'),
	cssmin = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rimraf = require('rimraf'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	spritesmith = require('gulp.spritesmith');

var paths = {
	blocks: 'src/blocks/',
	fonts: 'src/fonts/**/*.*',
	img: 'src/img/**/*.*',
	icons: 'src/icons/',
};

//pug compile
gulp.task('pug', function() {
	return gulp.src([paths.blocks + '*.pug', '!' + paths.blocks + 'template.pug' ])
		.pipe(plumber())
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest('./'))
		.pipe(browserSync.stream())
});

//sass compile
gulp.task('sass', function() {
	return gulp.src(paths.blocks + '*.scss', '!' + paths.blocks + 'svg-icon/svg-sprite-template.scss')
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(prefix({
			browsers: ['last 10 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('css/'))
		.pipe(browserSync.stream());
});

//js compile
gulp.task('scripts', function() {
	return gulp.src(paths.blocks + '**/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('js/'))
		.pipe(browserSync.stream());
});

//png sprite
gulp.task('sprite:png', function(cb) {
	var spriteData = gulp.src(paths.icons + '*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../img/sprite.png',
			cssName: 'sprite.scss'
		}));

	spriteData.img.pipe(gulp.dest('img/'));
	spriteData.css.pipe(gulp.dest('src/blocks/_base/'));
  	cb();
});

//watch
gulp.task('watch', function() {
	gulp.watch(paths.blocks + '**/*.pug', gulp.series('pug'));
	gulp.watch(paths.blocks + '**/*.scss', gulp.series('sass'));
	gulp.watch(paths.blocks + '**/*.js', gulp.series('scripts'));
	gulp.watch(paths.img, gulp.series('img'));
	gulp.watch(paths.fonts, gulp.series('fonts'));
	gulp.watch(paths.icons + '*.png', gulp.series('sprite:png'));
});

//server
gulp.task('browser-sync', function() {
	browserSync.init({
		port: 3000,
		server: {
			baseDir: './'
		}
	});
});


//clean
gulp.task('clean', function(cb) {
	rimraf('./', cb);
});

//css + js
gulp.task('useref', function() {
	return gulp.src('*.html')
		.pipe( useref() )
		.pipe( gulpif('*.js', uglify()) )
		.pipe( gulpif('*.css', cssmin()) )
		.pipe( gulp.dest('./') );
	}
);

//copy images to output directory
gulp.task('img', function() {
	return gulp.src(paths.img)
		.pipe(imagemin())
		.pipe(gulp.dest('img/'));
	}
);

//copy fonts to output directory
gulp.task('fonts', function() {
	return gulp.src(paths.fonts)
		.pipe(gulp.dest('fonts/'));
	}
);


//default
gulp.task('default', gulp.series(
		gulp.parallel('sprite:png'),
		gulp.parallel('pug', 'sass', 'scripts', 'img', 'fonts'),
		gulp.parallel('watch', 'browser-sync')
	)
);

//production
gulp.task('prod', gulp.series(
		'clean',
		gulp.parallel('sprite:png'),
		gulp.parallel('pug', 'sass', 'scripts', 'img', 'fonts'),
		'useref'
	)
);