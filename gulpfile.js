var gulp = require('gulp'),
	sass = require('gulp-sass'),
	jade = require('gulp-jade'),
	minify = require('gulp-minify'),
	concat = require('gulp-concat'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	inject = require('gulp-inject'),
	watch = require('gulp-watch'),
	cheerio = require('gulp-cheerio');

gulp.task('styles', function () {
	return gulp.src([
				'app/styles/helpers/sprite.scss',
				'app/styles/helpers/variables.scss',
				'app/styles/helpers/fonts.scss',
				'app/styles/helpers/mixins.scss',
				'app/styles/helpers/normalize.scss',
				'app/styles/helpers/helpers.scss',
				'app/styles/global.scss',
				'app/styles/pages/*.scss'
	])
		.pipe(concat('main.scss'))
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(gulp.dest('final/assets/css'))
});

gulp.task('layout', function () {
	return gulp.src('app/layout/pages/*.jade')
		.pipe(jade({ pretty: false }))
		.pipe(gulp.dest('final'))
});

gulp.task('scripts', function () {
	return gulp.src([
		'app/js/libs/jquery-3.1.0.min.js',
		'app/js/libs/jquery.colorbox-min.js',
		'app/js/libs/readmore.min.js',
		'app/js/main.js'
		])
		.pipe(concat('main.js'))
		.pipe(minify({ noSource: true }))
		.pipe(gulp.dest('final/assets/js'))
});

gulp.task('minify-svg', function () {
	return gulp.src('app/svg/*.svg')
		.pipe(svgmin({
			plugins: [{
				mergePaths: false
			}]
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			}
		}))
		.pipe(gulp.dest('app/svg/'))
		.pipe(notify('Finish minify-svg task'));
});

gulp.task('svg-sprite', function () {
	var svgs = gulp
		.src('app/svg_sprite/*.svg')
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(svgmin())
		.pipe(svgstore({ inlineSvg: true }));

	function fileContents(filePath, file) {
		return file.contents.toString();
	}

	return gulp
		.src('app/layout/blocks/sprite.html')
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(gulp.dest('app/layout/blocks/'))
		.pipe(notify('Finish svg_sprite task'));
});

gulp.task('default', function () {
	watch('app/styles/**/*.scss', function () { gulp.start('styles') });
	watch('app/layout/**/*.*', function () { gulp.start('layout') });
	watch('app/js/main.js', function () { gulp.start('scripts') });
	watch('app/svg_sprite/**/*.svg', function () { gulp.start('svg-sprite') });
	watch('app/svg/**/*.svg', function () { gulp.start('minify-svg') });
});
