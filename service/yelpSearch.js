function callYelpSearch(searchTerm){
	var auth = { 
	  //
	  // Update with your auth tokens.
	  //
	  consumerKey: "iqVWnfpGmCiuLr0y6Ydf6A", 
	  consumerSecret: "BERKLyFoMLOmpLGFAqb7djkHmuo",
	  accessToken: "Z6fmwxtdt7r9oN4oOQPl-keQAvAyH8XP",
	  // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
	  // You wouldn't actually want to expose your access token secret like this in a real application.
	  accessTokenSecret: "ADYs7nwDNiNaJT9uxnQyIgSKZ5Y",
	  serviceProvider: { 
		signatureMethod: "HMAC-SHA1"
	  }
	};

	var terms = searchTerm;
	parameters = [];



	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};


	parameters.push(['term', terms]);
	parameters.push(['ll', coordinates.latitude+','+coordinates.longitude]);
	//parameters.push(['longitude', coordinates.longitude]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	  

	var message = { 
	  'action': 'http://api.yelp.com/v2/search',
	  'method': 'GET',
	  'parameters': parameters 
	};
	
	
	
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	

		$.ajax({
		  'url': message.action,
		  'data': parameterMap,
		  'cache': true,
		  'dataType': 'jsonp',
		  'jsonpCallback': 'cb',
		  'success': function(data, textStats, XMLHttpRequest) {
			//var output = prettyPrint(data['businesses']);
			//$("#content").append(output);
			updateMap(data['businesses']);
		  },
		  'error': function (xhr, ajaxOptions, thrownError) {
			alert(xhr.responseText);
			alert(thrownError);
		  }
		});
	
	function updateMap(result){
		
		var infowindow = new google.maps.InfoWindow({content: ""});
		
		map = new google.maps.Map(document.getElementById("map-content"),myOptions);
		initialLocation = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);	
		marker = new google.maps.Marker({
					position: initialLocation,
					map: map,
					title: "You are here",
					icon: "./assets/img/marker.png"	
		});
		
		$.each(result, function(index, value){
							
						temp = new google.maps.Marker({
							position: new google.maps.LatLng(value.location.coordinate.latitude,value.location.coordinate.longitude),
							map: map,
							title: value.name,
							icon:  './assets/img/poiMarker.png'
						});
						var content = "<b>"+value.name+"</b>: "+"<i>"+value.snippet_text+"</i></br>"+"Rating: "+value.rating;
						google.maps.event.addListener(temp, 'click', function(i) {
							infowindow.setContent(content);
							infowindow.open(map,this);
							
						});
						

		});
				  		
		map.setOptions({zoom: 12});
		map.setCenter(initialLocation); 
		
	}
}
