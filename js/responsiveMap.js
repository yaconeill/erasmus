var query900 = Modernizr.mq('(min-width: 900px)');
var query768 = Modernizr.mq('(min-width: 768px)');
var lat,
	long,
	zoom;
if (query900) {
	lat = 52.5840664;
	long = 31.0702264;
	zoom = 4;
} else if (query768) {
	lat = 52.263063;
	long = 19.556182;
	zoom = 4;
} else {
	lat = 51.992581;
	long = 16.919815;
	zoom = 3;
}

/**
 * 
 * @param {*} pointer 
 * @param {*} infoCourse 
 */
function myMap(pointer, infoCourse) {
	let myCenter = new google.maps.LatLng(lat, long);
	if (infoCourse != undefined){
		if (infoCourse.length == 1)
			zoom = 7;
		// myCenter = new google.maps.LatLng(infoCourse[0].latitud, infoCourse[0].longitud);
	}
		
	
	var mapOptions = {
		center: myCenter,
		zoom: zoom
	};
	var mapCanvas = document.getElementById('googleMap');
	var map = new google.maps.Map(mapCanvas, mapOptions);

	if (pointer == 1) {
		var marcadores = [];
		
		var icon = {url: '../svg/pin.svg', // url
			scaledSize: new google.maps.Size(60, 60),
		};
		var limites = new google.maps.LatLngBounds();
		
		var infowindow = new google.maps.InfoWindow();

		var marker,i;
		
		for (i = 0; i < infoCourse.length; i++) {
			
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(infoCourse[i].localizacion.latitud, infoCourse[i].localizacion.longitud),				 
				animation: google.maps.Animation.BOUNCE,
				icon: icon,map: map
			});
			
			marcadores.push(marker);			
			if (infoCourse.length != 1){
				zoom = 8;
				limites.extend(marker.position);
			}
			
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					infowindow.setContent(infoCourse[i].ciclo + '</br>' + infoCourse[i].localizacion.ciudad);
					infowindow.open(map, marker);
				};
			})(marker, i));
		}
		if (infoCourse.length != 1)		
			map.fitBounds(limites);

	}
		
	google.maps.event.addDomListener(window, 'load', myMap);
	// for (i = 0; i < infoCourse.length; i++) {
	// 	var location = new google.maps.LatLng(infoCourse[i].latitud,infoCourse[i].longitud);
	// 	marker = new google.maps.Marker({
	// 		position: location, 
	// 		animation: google.maps.Animation.BOUNCE,
	// 		icon: icon});
	// 	marker.setMap(map);
	// }
		
	// var marker = new google.maps.Marker({
	// 	position: myCenter, 
	// 	animation: google.maps.Animation.BOUNCE,
	// 	icon: icon});
	// marker.setMap(map);
	// }
}