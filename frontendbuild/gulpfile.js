var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var minifyJS = require( 'gulp-uglify' );
var minifyCSS = require( 'gulp-minify-css' );
var loadPlugin = require( 'gulp-load-plugins' )();

var distDir = 'dist/';
var foundationPath = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];

gulp.task( 'start',function(){
	console.log( 'start task...' );
});

/*
 * task: sass processor
 */ 
gulp.task( 'sass-processor', function(){
	// gulp.src( 'src/scss/**/*.scss' )
	gulp.src( 'src/scss/dahz-framework-blog.scss' )
		.pipe( loadPlugin.sass(
			{
				includePaths: foundationPath,
			  	errLogToConsole: true,
			  	outputStyle: 'expanded'
			}
		).on( 'error', loadPlugin.sass.logError) )
		.pipe( gulp.dest( './src/css/' ) )
		.pipe( minifyCSS() )
		.pipe( gulp.dest( './dist/css/' ) );
});

/*
 * task: minify js
 */ 
gulp.task( 'minify-js', function(){
 	gulp.src( 'src/js/*' )
 			.pipe( minifyJS() )
 			.pipe( gulp.dest( distDir + 'js/' ) );
});

/*
 * task: minify css
 */
gulp.task( 'minify-css', function(){
 	gulp.src( 'src/css/*' )
		 	.pipe( minifyCSS() )
		 	.pipe( gulp.dest( distDir + 'css/' ) );
});

/*	
 * task: watch
 */
gulp.task( 'watch', ['start','sass-processor'], function(){
 	gulp.watch( 'src/scss/**/*.scss', ['sass-processor'] );
 	// gulp.watch( 'src/js/*', ['minify-js'] );
})

gulp.task( 'default', ['watch'] );