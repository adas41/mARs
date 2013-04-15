function callYelpSearch(searchTerm){
	
	
	/*for(i=0;i<friendArr.length;i++){
		if(friendArr[i][2] != undefined){
			checkIn = friendArr[i][2];
			for(j=0;j<checkIn.length;j++){
				if(getProximity(coordinates.latitude,coordinates.longitude,checkIn[j].place.location.latitude,checkIn[j].place.location.longitude) <= 160934){
					checkinObjArray.push([checkIn[j].from.name,checkIn[j].place.name,checkIn[j].place.location.latitude,checkIn[j].place.location.longitude,'https://graph.facebook.com/'+friendArr[i][0]+'/picture']);
				}
			}
		}
	}*/
	
	// 0: name, 1: place, 2: latitude, 3: longitude, 4: picture
	/*for(i=0;i<checkinObjArray.length;i++){
		//console.log(checkinObjArray[i][0]+" checked in @ "+checkinObjArray[i][1]);
	}*/
	
	var auth = { 
	 
	  consumerKey: "iqVWnfpGmCiuLr0y6Ydf6A", 
	  consumerSecret: "BERKLyFoMLOmpLGFAqb7djkHmuo",
	  accessToken: "Z6fmwxtdt7r9oN4oOQPl-keQAvAyH8XP",
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
	//parameters.push(['deals_filter', true]);
	//parameters.push(['limit', 30]);
	parameters.push(['ll', coordinates.latitude+','+coordinates.longitude]);
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
		  'beforeSend': function() {
				$('#map-content').html("<img style='position:absolute;top:50%;left:50%' src='./assets/img/loading.gif' />");
		   },
		  'success': function(data, textStats, XMLHttpRequest) {
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
			
			var hasDeal = false;
			var hasCheckin = false;
			var hasAlert = false;
			
			var reviewArray = [];
			
			var deal = {
				title: '',
				savingsPercent: 0.0, // display if > 0
			};
			
			yelpBusinessName = value.name;
			yelpBusinessLat = value.location.coordinate.latitude;
			yelpBusinessLon = value.location.coordinate.longitude;
						
						if(value.hasOwnProperty('deals')){
							hasDeal = true;
							var temp = 0;
							
							if(value.deals[0].options != undefined){
								temp = Math.ceil((value.deals[0].options[0].original_price - value.deals[0].options[0].price)/value.deals[0].options[0].original_price * 100);
							}
							
							deal = {title: value.deals[0].title, savingsPercent: temp};
							
						}
						
						
						for(i=0;i<checkinObjArray.length;i++){
							if(yelpBusinessName == checkinObjArray[i][1]){
								hasCheckin = true;
								
								reviewArray.push([checkinObjArray[i][0],checkinObjArray[i][4]]);
								
								/*for(i=0;i<reviewArray.length;i++){
									if(reviewArray[i][1] == checkinObjArray[i][4]){
										break;
									}
								}
								if(i == reviewArray.length){
									reviewArray.push([checkinObjArray[i][0],checkinObjArray[i][4]]);
								}*/
								
								console.log("(Actual) Review for "+yelpBusinessName+" given by: "+checkinObjArray[i][0]);
			
								//break;
								
								
							}
							else{ 
								if(getProximity(yelpBusinessLat,yelpBusinessLon,checkinObjArray[i][2],checkinObjArray[i][3]) <= thresholdDistance){
									hasCheckin = true;
								
									reviewArray.push([checkinObjArray[i][0],checkinObjArray[i][4]]);
								
									console.log("(Approx.) Review for "+yelpBusinessName+" given by: "+checkinObjArray[i][0]);
								}
								
							}
						}
						//console.log(reviewArray.length);
						
						for(i=0; i<crimeObjArray.length ;i++){
							if(getProximity(yelpBusinessLat,yelpBusinessLon,crimeObjArray[i][0],crimeObjArray[i][1]) <= 1500){
								hasAlert = true;
							}
						}
						console.log(yelpBusinessName+" has crime "+hasAlert);	
						
						
						// use hasDeal, hasCheckin and hasAlert while rendering the divs in FOV.
						
						
						var content = "<b>"+value.name+"<img src= "+value.rating_img_url_large+" />";
						
						if(hasCheckin){
							for(i=0;i<reviewArray.length;i++){
								content += "<img src= "+reviewArray[i][1]+" />";
							}
						}
						if(hasDeal){
							content += "<img src= ./assets/img/deal.png /></br>"+deal.title+"</br>"+deal.savingsPercent+"%";
						}
						if(hasAlert){
							content += "<img src= ./assets/img/alert.png />";
						}
						
						
							
						temp = new google.maps.Marker({
							position: new google.maps.LatLng(value.location.coordinate.latitude,value.location.coordinate.longitude),
							map: map,
							title: value.name,
							icon:  './assets/img/poiMarker.png'
						});
						
						google.maps.event.addListener(temp, 'click', function(i) {
							infowindow.setContent(content);
							infowindow.open(map,this);
							
						});
						

		});
				  		
		map.setOptions({zoom: 12});
		map.setCenter(initialLocation); 
		
	}
}
