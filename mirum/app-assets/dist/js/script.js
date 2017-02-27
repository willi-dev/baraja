/*
 * pie chart / progress chart
 */ 
$(function() {
    $('.chart').easyPieChart({
    	animate: 1500,
    	barColor: '#2f2f2f',
    	trackColor: '#dcdcdc',
    	size: '72',
    	lineWidth: 2,
    	scaleColor: false,
    });
});
/*
 * initIsotopeFilter
 */
function initIsotopeFilter( filterParam = '*' ){
	$('.project__grid--items').isotope({
		itemSelector: '.project__grid--item',
		layoutMode: 'fitRows',
		filter: filterParam,
	});
}
$(document).ready( function(){
	initIsotopeFilter();
	$('a.grid-filter-item').click( function(e){
		e.preventDefault();
		$('.grid-filter-item').removeClass('selected');
		$(this).addClass('selected');
		var filterVal = $(this).attr('data-filter');
		initIsotopeFilter(filterVal);
	});
})