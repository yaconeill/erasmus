var query900 = Modernizr.mq('(min-width: 1920px)');
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
 * Generate the markers on google map with the coordinates
 * @param {Object} infoCourse - Object array with the locations and courses info
 * @param {Integer} newMarker - if 1 create the markers
 */
function myMap(infoCourse, newMarker) {
    let myCenter = new google.maps.LatLng(lat, long);
    if (infoCourse != undefined)
    // In case there is just one element, set the zoom and center the location
        if (infoCourse.length == 1) {
            zoom = 7;
            myCenter = {
                lat: infoCourse[0][2][0],
                lng: infoCourse[0][2][1]
            };
        }
    var mapCanvas = document.getElementById('googleMap');
    var map = new google.maps.Map(mapCanvas, {
        center: myCenter,
        zoom: zoom
    });
    if (newMarker == 1) {

        // Set the sizes of the map based on all locations
        var limites = new google.maps.LatLngBounds();
        // Set the info of the marker
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < infoCourse.length; i++) {

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(infoCourse[i][2][0], infoCourse[i][2][1]),
                animation: google.maps.Animation.BOUNCE,
                icon: icon,
                map: map
            });
            marker.setMap(map);
            if (infoCourse.length != 1)
                limites.extend(marker.position);

            // Create the event to show the infowindow
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent('<strong>' + infoCourse[i][0] + '</strong></br>' + infoCourse[i][1].join('<br>'));
                    infowindow.open(map, marker);
                };
            })(marker, i));
        }
        if (infoCourse.length != 1)
            map.fitBounds(limites);

        google.maps.event.addDomListener(window, 'load', myMap);
    }
}