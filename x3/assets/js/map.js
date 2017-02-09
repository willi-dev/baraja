/**
 * document ready
 */ 
$(document).ready( function(){
	// call getDataPlaces()
	setStyle();
    getDataPlaces();
   	
})

/**
 * setStyle
 * setting style from jquery
 */
function setStyle(){
	var windowInnerHeight = $(window).innerHeight();
	var headerContentHeight = $('#header-content-map').height()+100;
	var mapHeight = windowInnerHeight-headerContentHeight;

	$('#map').css({'height': mapHeight+'px' })
	$('#side-main-menu').css({'height': windowInnerHeight})

	var sidemenuliWidth = $('#side-main-menu').width();
	$('#side-main-menu ul.list-main-menu li').css({'height': 4/5 *sidemenuliWidth+'px' });
	$('#side-main-content-menu').css({'height': windowInnerHeight})

	var mainContentWidth = $('#main-content').width();
	$('#side-main-content-menu').css({'width':'300px'})
	var mainContentInnerWidth = mainContentWidth-300;
	$( '#main-content-inner' ).css( {'width': mainContentInnerWidth+'px' }); 
}
/**
 * function: getDataPlaces
 * get data of places from data.json use ajax.
 */
function getDataPlaces(){
	$.ajax({
		dataType: 'json',
		url		: 'assets/js/data.json',
		success: function( responseDataPlaces ){
			// set responseDataPlaces to initMap
			initMap( responseDataPlaces );
		}
	})
}

/**
 * function: generateListPlaces
 */
function generateListPlaces( responseDataPlaces ){
	var listPlaces = responseDataPlaces.places;
	var listPlacesEl = $('.list-places-name');
	for( var j = 0; j < listPlaces.length; j++ ){
		var listItem = '<li class="list-place-item"><a href="#"><div class="list-place-item-inner">'+ listPlaces[j]['place_name'] +'</div></a></li>';
		listPlacesEl.append( listItem );
	}

	var submenu = '<ul class="sub-list-places-name"></ul>';
	var listPlaceItem = $('.list-place-item');
	listPlaceItem.eq(1).append( submenu ).addClass('has-submenu');

	var submenuitem = '<li class="sub-list-place-item"><a href="#">ArtScience Museum</a></li>' +
		'<li class="sub-list-place-item"><a href="#">Marina Bay Sands Skypark</a></li>' +
		'<li class="sub-list-place-item"><a href="#">Double Helix Bridge</a></li>';
	$('.list-place-item:eq(1) .sub-list-places-name').append(submenuitem);
}

/**
 * function: clickEvent
 */
function clickEvent( markers ){
	$('.list-place-item').each( function(i){
		$(this).click( function(e){
	    	e.preventDefault();
	    	$(this).siblings().removeClass('active');
	    	$(this).addClass('active');
	    	if( $(this).hasClass('has-submenu')){
	    		$('.sub-list-places-name').toggle('slow');
	    	}
	    	google.maps.event.trigger( markers[i], 'click' );
	    })
	})
}

/**
 * function: initMap 
 * initialize map 
 */
function initMap( responseDataPlaces ){
	var markerImage = 'assets/img/custom-marker.png';
	var markerImageHover = 'assets/img/custom-marker-hover.png';
	var dataPlaces = responseDataPlaces;
	var map, marker, infoWindow, infoWindowHover;
	var listMarkers = [];
	var bounds = new google.maps.LatLngBounds();
	var styleOfMap = [
	        { 
	        	featureType: "all", 
	        	stylers: [ 
	        		{ saturation: -40 }, 
	        		{ lightness: 40 } 
	        	] 
	        },
    	];
	var mapOptions = {
		mapTypeId: 'roadmap',
		zoom: 15,
		styles: styleOfMap,
	};
	
	var mapSelector = $('#map');
	var idSideDesc;

	// create a map
	map = new google.maps.Map(document.getElementById('map'), mapOptions );
	
	for( var i = 0; i < dataPlaces.places.length; i++ ){
		var position = new google.maps.LatLng( dataPlaces.places[i]['latitude'], dataPlaces.places[i]['longitude'] );
		bounds.extend( position );
		marker = new google.maps.Marker({
			position: position,
			map: map,
			title: dataPlaces.places[i]['place_name'],
			icon: markerImage,
		})

		listMarkers.push( marker );

		var classInfoMarker = 'info-marker-place_name-'+i;

		var infoPlaceName = '<div class="info-marker-place_name '+ classInfoMarker +'">'+ dataPlaces.places[i]['place_name'] +'</div>';
		infoWindow = new google.maps.InfoWindow( {
			content: infoPlaceName
		} );
		infoWindow.open( map, marker );

		var infoPlaceHover = '<div class="">'+ dataPlaces.places[i]['place_name'] + dataPlaces.places[i]['description'] + '</div>';
		
		idSideDesc = 'side-area-description-'+i;
		mapSelector.append( '<div id="'+idSideDesc+'" class="side-area-desc">'+ 
								'<img src="'+dataPlaces.places[i]['img']+'" class="img-responsive" alt="'+dataPlaces.places[i]['place_name']+'"/>'+
								'<h2>'+dataPlaces.places[i]['place_name']+'</h2>'+
								'<p>'+dataPlaces.places[i]['description']+'</p>'+
							'</div>');

		// event when marker click
		google.maps.event.addListener( marker, 'click', (function( marker, i ){
			return function(){
				map.setCenter( marker.getPosition() );
				map.setZoom( 17 );
				$('.list-place-item').removeClass('active');
				$('.list-place-item').eq(i).addClass('active');
				$('.side-area-desc').css({'display': 'none'});
				$('#side-area-description-'+i ).css( {'display':'block'} );
				// marker.setIcon( markerImageHover );
				// $('.info-marker-place_name').eq(i).css({'background' : '#92d72e'})
			}
		})( marker, i ) );

		// event when marker mouse over
		google.maps.event.addListener( marker, 'mouseover', (function( marker, i ){
			return function(){
				marker.setIcon( markerImageHover );
				$('.info-marker-place_name').eq(i).css({'background' : '#92d72e'});
				reStyleInfoWindow('hover', i);
			}
		})( marker, i ) );

		// event when marker mouse out
		google.maps.event.addListener( marker, 'mouseout', ( function( marker, i ){
			return function(){
				marker.setIcon( markerImage );
				$('.info-marker-place_name').eq(i).css({'background' : '#282c37'});
				reStyleInfoWindow('no-hover', i);
			}
		})( marker, i ) );

		// re styling infowindow when domready
		google.maps.event.addListener( infoWindow, 'domready', (function( infoWindow, i ){
			return function(){
				reStyleInfoWindow('no-hover', i);
			}
		})( infoWindow, i ) );

		map.fitBounds( bounds );
	}

    // set responseDataPlaces to generateListPlaces
	generateListPlaces( responseDataPlaces );

	// click event
	clickEvent( listMarkers );

    $('.config-list a.close-desc').click( function( e ){
    	e.preventDefault();
    	$('.list-place-item').removeClass('active');
    	$('.side-area-desc').css({'display': 'none'});
    	map.setZoom( 15 );
    })
}

/**
 * reStyleInfoWindow
 * for re-styling info window of marker
 * reference: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
 */ 
function reStyleInfoWindow( state, i ){
	var infoMarker = $( '.info-marker-place_name' );
	var infoMarkerLength = $( '.info-marker-place_name' ).length;
	var parentof, w, left;

	if( state == 'hover' ){
		// infoMarker.css( { 'font-size' : '18px' } );
	}else{
		parentof = infoMarker.eq(i).parent().parent().parent();
		if( parentof.hasClass('gm-style-iw') ){
			w = parentof.width();
			console.log( w );
			left = (w/2)+2;
			parentof.css( {'left': left+'px' } );
		}
		parentof.css( { 'top': '72px' } );
	}

	var styleInfo = $( '.gm-style-iw' );
	var styleInfoBG = styleInfo.prev();
	var styleInfoX = styleInfo.next();

	styleInfo.parent().css({'width':'0'})
	styleInfo.parent().css({'height':'0'})
	// styleInfo.css({'left': })
	// styleInfo.parent().parent().css({'left' : '0px' } )
	// styleInfo.parent().parent().css({'bottom' : '100px'})
	styleInfoBG.children( ':nth-child(1)' ).css( {'display' : 'none' } )
	styleInfoBG.children( ':nth-child(2)' ).css( {'display' : 'none' } )
	styleInfoBG.children( ':nth-child(3)' ).css( {'display' : 'none' } )
	styleInfoBG.children( ':nth-child(4)' ).css( {'display' : 'none' } )
	styleInfoX.css( {'display' : 'none'} );
}