// Located in:
// In squarespace -> Organization Profile - > -> view -> edit -> edit code


<h2 class="my-title">{organization_name}</h2>
<hr class="styled-hr" style="width:100%;">
<div style="height: 10px; overflow: hidden; width: 100%;"></div>
<strong>About: </strong><span>{about}</span>
<br><br><em><strong>Have feedback? See outdated information? Send a note to the&nbsp;<a href="http://google.com/" target="_blank">Atlas Manager</a>.<br>This profile was last updated on <span>{updated_date}.</span></strong></em><br><br><strong>Location: </strong><span id="geolocationId">{geolocation}</span>
<br><strong>Organization type: </strong><span>{organization_category}</span>
<div class="tooltip">(i)<span class="tooltiptext">{organization_type_info}</span></div>
<span>{website}</span><br><strong>Non-profit status: </strong><span>{nonprofit_status}</span><br><div><strong>Links: </strong><span>{website} | {facebook} | {twitter} | {linkedin_company_page} | {linkedin_groups}</span><br><strong>Participation in collaborations: </strong><span>{collaboration_links}</span><br>
<br><br><strong>Resources/Publications: </strong><span>{resources}</span></div>
<br><br><br><div id="maplocationId" style="height: 400px;"></div>

<script type="text/javascript"
  src="//maps.googleapis.com/maps/api/js?key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE">
</script>

<script type="text/javascript">
function displayMap(title, location) {
	//var urll = 'https://maps.googleapis.com/maps/api/geocode/json?address=1441 Canal St #424 New Orleans LA  70112&key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE';
	var urll = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE";
  
  $.getJSON(urll).done(function(data) { // Adds the JSON to the data variable.
    
    var map = new google.maps.Map(document.getElementById('maplocationId'), {
    zoom: 14,
    center: {lat: 42.380753, lng: -71.110272}
  });
    
    if (data.status === google.maps.GeocoderStatus.OK) {
      map.setCenter(data.results[0].geometry.location);
      
  //    var ctaLayer = new google.maps.KmlLayer({
  //  url: 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml',
  //  map: map
  //});
      
      var marker = new google.maps.Marker({
        map: map,
        position: data.results[0].geometry.location,
		title: title +": " + location
      });

       var myLatLng = {lat: 29.9575791, lng: -90.0748242};
       var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });

      var marker2 = new google.maps.Marker({
        map: map,
        position: data.results[0].geometry.location,
    title: title +": " + location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }  
  });
  }

  function displayMapLink(title, location) {
	//var urll = 'https://maps.googleapis.com/maps/api/geocode/json?address=1441 Canal St #424 New Orleans LA  70112&key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE';
	var urll = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=AIzaSyDplsTlpTuCS-MBQggxOf0iNloTP-OBOIE";
  
  $.getJSON(urll).done(function(data) { // Adds the JSON to the data variable.
    
  //   var map = new google.maps.Map(document.getElementById('maplocationId'), {
  //   zoom: 14,
  //   center: {lat: 42.380753, lng: -71.110272}
  // });
    var map = new google.maps.Map(document.getElementById('maplocationId'));

    if (data.status === google.maps.GeocoderStatus.OK) {
      //map.setCenter(data.results[0].geometry.location);
      
  //    var ctaLayer = new google.maps.KmlLayer({
  //  url: 'http://googlemaps.github.io/js-v2-samples/ggeoxml/cta.kml',
  //  map: map
  //});
      
      var marker = new google.maps.Marker({
        map: map,
        position: data.results[0].geometry.location,
		title: title +": " + location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }  
  });
  }
</script>