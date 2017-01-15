// Located in:
// In squarespace -> Organization Profile - > settings -> advance

<style>
    #header {
        display: none
    }

    #footer {
        display: none
    }

    #preFooter {
        display: none
    }
</style>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
<!--
// <script type="text/javascript"
//   src="//maps.googleapis.com/maps/api/js?key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE">
// </script>
-->


<script type="text/javascript">

  // Multiple Markers
    var _markers = [
       // ['London Eye, London', 51.503454,-0.119562],
       // ['Palace of Westminster, London', 51.499633,-0.124755]
    ];

  function getGeometryLocation(title, location) {
    //var urll = 'https://maps.googleapis.com/maps/api/geocode/json?address=1441 Canal St #424 New Orleans LA  70112&key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE';
    var urll = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE";
  
    $.getJSON(urll).done(function(data) { // Adds the JSON to the data variable.
    
    //   var map = new google.maps.Map(document.getElementById('maplocationId'), {
    //   zoom: 14,
    //   center: {lat: 42.380753, lng: -71.110272}
    // });
    
    if (data.status === google.maps.GeocoderStatus.OK) {
      _markers.push(title +', ' + location + ', ' + data.results[0].geometry.location.lat + ', ' + data.results[0].geometry.location.lng);
      // map.setCenter(data.results[0].geometry.location);
      
  //    var ctaLayer = new google.maps.KmlLayer({
  //  url: 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml',
  //  map: map
  //});
      
    //   var marker = new google.maps.Marker({
    //     map: map,
    //     position: data.results[0].geometry.location,
    // title: title +": " + location
    //   });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }  
  });
  }
    // Create a server request.
    function getData(org, callback) {
      var key = org;
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            // url: "https://atlas-9c89c.firebaseio.com/.json?orderBy=\"organizations\"&limitToFirst=20",
          url: "https://atlas-new-format.firebaseio.com/organizations/"+org+"/.json?",
           // url: "https://atlas-organizations.firebaseio.com/"+org+"/.json?",
            success: function(data) {
                data['key'] = key;
                callback(data);
            }
        });
    }

    function addCollaborationMapMarkers(data) {
      addMarkerInfo(data);
    }

    //function getCollaborationData(collab, title, about, website, callback) {
      function getCollaborationData(collab, callback) {
        var key = collab;
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            // url: "https://atlas-9c89c.firebaseio.com/.json?orderBy=\"organizations\"&limitToFirst=20",
          url: "https://atlas-new-format.firebaseio.com/collaborations/"+collab+"/.json?",
           // url: "https://atlas-organizations.firebaseio.com/"+org+"/.json?",
            success: function(data) {
                data['key'] = key;
                callback(data);
            }
        });
    }

    function loadCollaborationMapMarker(data) {
      if(data && data.geolocation) {
        var title = data.organization_name ? data.organization_name : '';
        displayMapLink(title, data.about, data.website, data.geolocation);
      }
    }

    function replace(selectorString, temp, title, about, website, value) {
      console.log("replacing " + temp + " with " + value);
      
      if( value.length > 0) {
        var v = 0;
      }
      if(temp.indexOf('{') === -1) {
        // nothing to replace
        return;
      }
      
      $(selectorString).each(function() {
        var text = $(this).text();
        if(text.indexOf(temp) > -1) {
          // console.log("selector = " + selectorString + ". text = " + text + ". temp = " + temp +". value = " + value);
          if(temp === '{collaboration_links}' || temp === '{organization_links}') {
            //new
            var links = value.split(",");
            value = '';

            for (var i = 0;  i < links.length; ++i) {

                var link = links[i];
                var name_key = link ? link.split(" | ") : ""; 
                var name = name_key[0];
                name = name.trim();
                
                if (value.length > 0) {
                      value += ", ";
                }
                value += name;

                //mapstuff
                var k = name_key[1];
                k = k.trim();
                //_markers[name] = k;
                 getCollaborationData(k, addCollaborationMapMarkers);
                //getCollaborationData(k, title, about, website, addCollaborationMapMarkers);//getGeometryLocation);//loadCollaborationMapMarker);
            }
                   //end
              // var res = value.split("|");
              // if(res.length > 0) {
              //   text = text.replace(temp, res[0]);
              //   $(this).text(text);
              //   return;
              
          } 
          var newText = text.replace(temp, value);
          $(this).text(newText);
          if(newText !== text) {
            // replaced the field
            return;
          }
        }
        });
    }

    function loadData(data) {
      if(data && data.geolocation) {
      data["Address"] = data.geolocation ? data.geolocation : "";
      var title = data.organization_name ? data.organization_name : '';
      
      //_markers[title] = data.geolocation;
      //getCollaborationData(k, getGeometryLocation);
      //addMarkerInfo(title, data.about, data.website, data.geolocation);
      addCollaborationMapMarkers(data);
      //displayMap(title, data.geolocation);
      
        for (var key in data) {
            replace("h1, h2, h3, span, a", "{"+ key + "}", title, data.about, data.website, data[key]);
        }

        setTimeout(displayMap, 10000);
        //setTimeout(myFunction, 3000);
        //setTimeout(addMapAndMarkers, 15000);
        //addMapAndMarkers();
      }
    }

    function addMapAndMarkers() {
      // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), i;

    var map = new google.maps.Map(document.getElementById('maplocationId'), {
     // zoom: 14//,
      //center: {lat: 42.380753, lng: -71.110272}
    });
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < _markers.length; i++ ) {
      //if( i === 0) {
       //  map.setCenter(markers[i][1], markers[i][2]);//data.results[0].geometry.location);
      //}
        var position = new google.maps.LatLng(_markers[i][1], _markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: _markers[i][0]
        });
        
        // // Allow each marker to have an info window    
        // google.maps.event.addListener(marker, 'click', (function(marker, i) {
        //     return function() {
        //         infoWindow.setContent(infoWindowContent[i][0]);
        //         infoWindow.open(map, marker);
        //     }
        // })(marker, i));

        // Automatically center the map fitting all markers on the screen
        map.fitBounds(bounds);
    }
    }

    $(window).load(function() {
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        var org = getUrlParameter('org');
        // Download the Firebase data for this specific orgKey
        getData(org, loadData);

    });
</script>