var gulp = require( 'gulp' );
var minifycss = require( 'gulp-minify-css' );

gulp.task( 'minify-css', function(){
	gulp.src( './angularjs/asset/css/style.css' )
		.pipe( minifycss({
			compatibility: 'ie8'
		}))
		.pipe( gulp.dest( './angularjs/asset/css/dist' ) );
})

