function callYelpSearch(searchTerm){
		alert("Neelima Yelp is working");
		alert(checkinObjArray.length);
	AR.radar.background = new AR.ImageResource("http://us.123rf.com/400wm/400/400/happyroman/happyroman1112/happyroman111200731/11486202-vector-radar-screen.jpg");
	AR.radar.positionX = 0.1;
	AR.radar.positionY = 0.1;
	AR.radar.width = 0.4;
	AR.radar.centerX = 0.5;
	AR.radar.centerY = 0.5;
	AR.radar.radius = 0.4;
	AR.radar.northIndicator.image = new AR.ImageResource("https://preschool.byu.edu/Assets/img/red_circle.png");
	AR.radar.northIndicator.radius = 0.4;
	//AR.radar.onClick = function(){ AR.logger.info('radar was clicked');};
	AR.radar.enabled = true;
	var radarCircle = new AR.Circle(0.05, {style: {fillColor: '#83ff7b'}});
	
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
		/*
		var infowindow = new google.maps.InfoWindow({content: ""});
		
		map = new google.maps.Map(document.getElementById("map-content"),myOptions);
		initialLocation = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);	
		marker = new google.maps.Marker({
					position: initialLocation,
					map: map,
					title: "You are here",
					icon: "./assets/img/marker.png"	
		});
			*/
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
						var checkimg ="";
						var dealimg  ="http://slodive.com/wp-content/uploads/2011/05/white-backgrounds/white-background.jpg";
						var crimeimg ="http://slodive.com/wp-content/uploads/2011/05/white-backgrounds/white-background.jpg";
						
						if(hasCheckin){
							if(reviewArray.length)
							checkimg = reviewArray[0][1];
							for(i=0;i<reviewArray.length;i++){
								content += "<img src= "+reviewArray[i][1]+" />";
								//checkimg = reviewArray[i][1];
								
							}
						}
						if(hasDeal){
							dealimg="./assets/img/deal.png";
							content += "<img src= ./assets/img/deal.png /></br>"+deal.title+"</br>"+deal.savingsPercent+"%";
						}
						if(hasAlert){
							crimeimg="./assets/img/alert.png";
							content += "<img src= ./assets/img/alert.png />";
						}
						
						/*
							
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
						
						*/
						
						
						var toggle =0;
			
			var text = "NEEEEELIIIIMMMAAAAAAAAA";
		//geoObject = [];
		//var myCircle = new AR.Circle(0.5, {style: {fillColor: '#FFC100'}});
		   var dist=Math.floor(value.distance);
		   
	var leftpos = 30;
	
	var poiHTMLdrawable = new AR.HtmlDrawable({html:"<div><img src='"+value.image_url+"' height='322px' width='280px' style='position:absolute;left:30px;top:30px;float:left;border-radius:45px;'><img src='"+crimeimg+"' height='80px' width='80px' style='position:absolute;left:860px;top:180px;'><img src='"+dealimg+"' height='80px' width='80px' style='position:absolute;left:780px;top:180px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: Charcoal;border-style:solid;border-width:10px;border-color:#708090;font-size:70px;border-radius:45px;color:#999967;' ><img src='"+value.rating_img_url_small+"' height='70px' width='250px' style='position:absolute;left:720px;top:280px;'><div style='position:absolute;left:350px'>"+value.name+"</div></div></div>"}, 6, {
  onClick : function() {
	  if(toggle==0){
		
		poiHTMLdrawable.html = "<div><img src='"+value.image_url+"' height='322px' width='280px' style='position:absolute;left:20px;top:100px;float:left;border-radius:45px;'><div class='test' id='container' style='width:970px;height:680px;background-color:#EBEBEB;font-family: Charcoal;border-style:solid;border-width:10px;border-color:#708090;font-size:70px;border-radius:45px;color:#999967;' ><img src='"+value.rating_img_url_small+"' height='70px' width='250px' style='position:absolute;left:30px;top:450px;'><div style='position:absolute;left:20px;'>"+value.name+"</div><div style='position:absolute;left:320px;top:100px;font-size:60px;'>"+dist+"m</div><div style='position:absolute;left:320px;top:200px;font-size:50px;'>"+value.display_phone+"</div><div style='position:absolute;left:320px;top:200px;font-size:40px;'>"+deal.title+"</div><div style='position:absolute;left:320px;top:250px;font-size:40px;'>"+deal.savingsPercent+"</div><div style=';position:absolute;left:320px;top:300px;font-size:35px;'>"+value.snippet_text+"</div></div></div></br>";
	
		alert(reviewArray.length);
		for(i=0;i<reviewArray.length;i++){
			poiHTMLdrawable.html += "<span><img src='"+reviewArray[i][1]+"' height='100px' width='100px' style='display:inline;position:absolute;left:"+leftpos+"px;top:560px;'></span>";
			//alert(leftpos);
			//alert(reviewArray[i][1]);
			leftpos = leftpos + 100;
			
			//alert(reviewArray[i][1]);
			
		}
	
		toggle=1;
	  }
	  else if(toggle==1)
	  {
		  poiHTMLdrawable.html = "<div><img src='"+value.image_url+"' height='322px' width='280px' style='position:absolute;left:30px;top:30px;float:left;border-radius:45px;'><img src='"+crimeimg+"' height='80px' width='80px' style='position:absolute;left:860px;top:180px;'><img src='"+dealimg+"' height='80px' width='80px' style='position:absolute;left:780px;top:180px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: Charcoal;border-style:solid;border-width:10px;border-color:#708090;font-size:70px;border-radius:45px;color:#999967;' ><img src='"+value.rating_img_url_small+"' height='70px' width='250px' style='position:absolute;left:720px;top:280px;'><div style='position:absolute;left:350px'>"+value.name+"</div></div></div>";
		  
		  toggle=0;
	  }
  },
  horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,
  opacity : 0.9
});

/*
		var poiHTMLdrawable = new AR.HtmlDrawable({html:"<div><div class='test' id='container' style='width:1500px;height:900px;background-color:#EBEBEB;border-style:solid;border-width:25px;border-color:#708090;font-size:200px;border-radius:25px;color:#707070;' ><img src='"+value.rating_img_url_small+"' height='250px' width='900px' style='position:absolute;left:100px;top:500px;'><div style='float:left'>"+value.name+"</div></div></div>"}, 4, {viewportWidth: 450, scale:1,opacity:0.0, updateRate:AR.HtmlDrawable.UPDATE_RATE.STATIC, clickThroughEnabled : true, onClick : function() {
			if(toggle==0)
			{
				poiHTMLdrawable.html += "<div><div class='test' id='container'  style='width:1500px;height:1500px;font-family: myFirstFont;background-color:#EBEBEB;border-style:solid;border-width:25px;border-color:#708090;font-size:150px;border-radius:25px;color:#707070;' ></br>Distance : "+dist+"m</br>Phone No:. "+value.display_phone+"</div></div>";
			toggle=1;
			alert(poiHTMLdrawable.html);
			}
				else 
			{
				poiHTMLdrawable.html = "<div><div class='test' id='container' style='width:1500px;height:900px;background-color:#EBEBEB;border-style:solid;border-width:25px;border-color:#708090;font-size:200px;border-radius:25px;color:#707070;' ><img src='"+value.rating_img_url_small+"' height='250px' width='900px' style='position:absolute;left:100px;top:500px;'><div style='float:left'>"+value.name+"</div></div></div>";
			toggle=0;
			alert(toggle);
			}
		
			
			
			},horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,opacity : 0.9}); 
			*/
		
		
		
			
			
		
						
						//alert(value.location.coordinate.latitude+", "+value.location.coordinate.longitude);
						/*
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
						*/
						
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
						

		});
				  		
		//map.setOptions({zoom: 12});
		//map.setCenter(initialLocation); 
		
	}
}
