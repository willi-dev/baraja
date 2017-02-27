var gulp = require('gulp'), 
	sass = require('gulp-sass'),
	minCSS = require('gulp-minify-css')
	rename = require('gulp-rename');

var source = 'src/',
	dest = 'dist/';

var bootstrapSass = {
		in: './node_modules/bootstrap-sass/',
	},
	fonts = {
		in: [source + 'fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
		out: dest + 'fonts/' 
	};

var scss = {
	in: source + 'scss/main.scss',
	out: dest + 'css/',
	watch: source + 'scss/**/*',
	sassOpts:{
		outputStyle: 'expanded',
		errLogToConsole: true,
		includePaths: [bootstrapSass.in + 'assets/stylesheets']
	}
};

/*
 * copy fonts
 */
gulp.task('fonts', function(){
	return gulp
		.src( fonts.in )
		.pipe( gulp.dest( fonts.out ));
});

/*	
 * compile scss / SASS
 */
gulp.task( 'sass', ['fonts'], function(){
	return gulp.src( scss.in )
		.pipe( sass(scss.sassOpts ) )
		.pipe( gulp.dest( scss.out ) )
		.pipe( rename({ suffix: '.min' } ) )
		.pipe( minCSS() )
		.pipe( gulp.dest( scss.out ) );
});

/*
 * default task 
 */
gulp.task( 'default', ['sass'], function(){
	gulp.watch( scss.watch, ['sass'] );
});