<<<<<<< HEAD
function callYelpSearch(searchTerm,radius){
	
	//alert("Neelima Yelp is working");
	//alert(checkinObjArray.length);
	
	
	$('#status').text("Loading...");
	$('#status').show("slow");	
	
	//alert(radius);
	
	AR.radar.background = new AR.ImageResource("./assets/img/radar-screen.jpg");
	AR.radar.positionX = 0.05;
	AR.radar.positionY = 0.12;
	AR.radar.width = 0.2;
	AR.radar.centerX = 0.5;
	AR.radar.centerY = 0.5;
	AR.radar.radius = 0.4;
	AR.radar.northIndicator.image = new AR.ImageResource("./assets/img/red_circle.png");
	AR.radar.northIndicator.radius = 0.4;
	//AR.radar.onClick = function(){ AR.logger.info('radar was clicked');};
	AR.radar.enabled = true;
	var radarCircle = new AR.Circle(0.05, {style: {fillColor: '#83ff7b'}});
	
=======
function callYelpSearch(searchTerm){
		
>>>>>>> 8079754a950b46b3092c6c10e62a5f87a70bd9b4
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
	var radiusFilter = radius;
	
	parameters = [];

	var accessor = {
	  consumerSecret: auth.consumerSecret,
	  tokenSecret: auth.accessTokenSecret
	};

	parameters.push(['term', terms]);
	//parameters.push(['deals_filter', true]);
<<<<<<< HEAD
	parameters.push(['limit', 10]);
	parameters.push(['radius_filter', radius]);
=======
	//parameters.push(['limit', 30]);
>>>>>>> 8079754a950b46b3092c6c10e62a5f87a70bd9b4
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
	
	var noOfResults = 0;
	
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
<<<<<<< HEAD
				//$('#status').text("Loading...");
				//$('#status').show("slow");
		   },
		  'success': function(data, textStats, XMLHttpRequest) {
			noOfResults = data['businesses'].length;
=======
				$('#map-content').html("<img style='position:absolute;top:50%;left:50%' src='./assets/img/loading.gif' />");
		   },
		  'success': function(data, textStats, XMLHttpRequest) {
>>>>>>> 8079754a950b46b3092c6c10e62a5f87a70bd9b4
			updateMap(data['businesses']);
		  },
		  'complete': function(){
			$('#status').text(noOfResults+" results");
			$('#status').fadeOut(3000);
		  },
		  'error': function (xhr, ajaxOptions, thrownError) {
			alert(xhr.responseText);
			alert(thrownError);
		  }
		});
	
	function updateMap(result){
		
<<<<<<< HEAD
=======
		var infowindow = new google.maps.InfoWindow({content: ""});
		
		map = new google.maps.Map(document.getElementById("map-content"),myOptions);
		initialLocation = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);	
		marker = new google.maps.Marker({
					position: initialLocation,
					map: map,
					title: "You are here",
					icon: "./assets/img/marker.png"	
		});
			
>>>>>>> 8079754a950b46b3092c6c10e62a5f87a70bd9b4
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
<<<<<<< HEAD
							
							deal = {title: value.deals[0].title, savingsPercent: temp};
=======
							
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
>>>>>>> 8079754a950b46b3092c6c10e62a5f87a70bd9b4
							
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
							if(getProximity(yelpBusinessLat,yelpBusinessLon,crimeObjArray[i][0],crimeObjArray[i][1]) <= 1000){
								hasAlert = true;
							}
						}
						console.log(yelpBusinessName+" has crime "+hasAlert);	
						
						
						// use hasDeal, hasCheckin and hasAlert while rendering the divs in FOV.
						
						
						var content = "<b>"+value.name+"<img src= "+value.rating_img_url_large+" />";
						var checkimg ="";
						var dealimg  ="";
						var crimeimg ="";
						
						if(hasCheckin){
							if(reviewArray.length)
							checkimg = reviewArray[0][1];
							for(i=0;i<reviewArray.length;i++){
								content += "<img src= "+reviewArray[i][1]+" />";
								//checkimg = reviewArray[i][1];
								
							}
						}
						var dTitle = '';
						var dSavings = '';
						
						if(hasDeal){
							dealimg="./assets/img/deal.png";
							content += "<img src= ./assets/img/deal.png /></br>"+deal.title+"</br>"+deal.savingsPercent+"%";
							dTitle = deal.title;
							dSavings = deal.savingsPercent;
						}
						if(hasAlert){
							crimeimg="./assets/img/alert.png";
							content += "<img src= ./assets/img/alert.png />";
						}
						
						
						
						
						var toggle =0;
			
		
		   var dist=Math.floor(value.distance);
		   
	var leftpos = 30;
	
	var poiHTMLdrawable = new AR.HtmlDrawable({html:"<div><img src='"+value.image_url+"' height='322px' width='280px' style='position:absolute;left:30px;top:30px;float:left;border-radius:45px;'><img src='"+crimeimg+"' height='80px' width='80px' style='position:absolute;left:860px;top:180px;'><img src='"+dealimg+"' height='80px' width='80px' style='position:absolute;left:780px;top:180px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: Charcoal;border-style:solid;border-width:10px;border-color:#708090;font-size:70px;border-radius:45px;color:#999967;' ><img src='"+value.rating_img_url_small+"' height='70px' width='250px' style='position:absolute;left:720px;top:280px;'><div style='color:black;position:absolute;left:350px'>"+value.name+"</div></div></div>"}, 6, {
  onClick : function() {
	  if(toggle==0){
		
		poiHTMLdrawable.html = "<div><img src='"+value.image_url+"' height='322px' width='280px' style='position:absolute;left:20px;top:100px;float:left;border-radius:45px;'><div class='test' id='container' style='width:970px;height:680px;background-color:#EBEBEB;font-family: Charcoal;border-style:solid;border-width:10px;border-color:#708090;font-size:70px;border-radius:45px;color:#6E6E6E;' ><img src='"+value.rating_img_url_small+"' height='70px' width='250px' style='position:absolute;left:30px;top:450px;'><div style='color:black;position:absolute;left:20px;'>"+value.name+"</div><div style='position:absolute;left:320px;top:100px;font-size:60px;'>"+dist+"m</div><div style='position:absolute;left:320px;top:200px;font-size:50px;'>"+value.display_phone+"</div><div style='position:absolute;left:320px;top:200px;font-size:40px;'>"+dTitle+"</div><div style='position:absolute;left:320px;top:250px;font-size:40px;'>"+dSavings+"</div><div style=';position:absolute;left:320px;top:300px;font-size:35px;'>"+value.snippet_text+"</div></div></div></br>";
	
		for(i=0;i<reviewArray.length;i++){
			poiHTMLdrawable.html += "<span><img src='"+reviewArray[i][1]+"' height='100px' width='100px' style='display:inline;position:absolute;left:"+leftpos+"px;top:560px;'></span>";
			leftpos = leftpos + 100;
			
		}
	
		toggle=1;
	  }
	  else if(toggle==1)
	  {
		  poiHTMLdrawable.html = "<div><img src='"+value.image_url+"' height='322px' width='280px' style='position:absolute;left:30px;top:30px;float:left;border-radius:45px;'><img src='"+crimeimg+"' height='80px' width='80px' style='position:absolute;left:860px;top:180px;'><img src='"+dealimg+"' height='80px' width='80px' style='position:absolute;left:780px;top:180px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: Charcoal;border-style:solid;border-width:10px;border-color:#708090;font-size:70px;border-radius:45px;color:#999967;' ><img src='"+value.rating_img_url_small+"' height='70px' width='250px' style='position:absolute;left:720px;top:280px;'><div style='color:black;position:absolute;left:350px'>"+value.name+"</div></div></div>";
		  
		  toggle=0;
	  }
  },
  horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
  opacity : 0.9
});


		
		
		
						
						AR.context.onLocationChanged = function(lat, lon, alt, acc) { // the current location's latitude, longitude, altitude and accuracy are passed in by the ARchitect 
						}
                        
						// Create a new GeoLocation. 

						var geoLocation = new AR.GeoLocation(value.location.coordinate.latitude,value.location.coordinate.longitude);

						// Create an orange circle with a radius of 5 

						// Create the GeoObject that puts it all together. 
						// The GeoObject will be placed at the previously created GeoLocation and an orange Circle 
						// will appear at that location. By creating the object it will be immediately visible. 
						
						//AR.context.onLocationChanged = null; 
						// Hide loading message 
								
						var geoObject = new AR.GeoObject(geoLocation, {drawables: {cam: poiHTMLdrawable,radar: radarCircle }});	
						//alert(geoObject.destroyed);

		});
				  		
		
		
	}
}
