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
	parameters.push(['deals_filter', true]);
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
	var poiHTMLdrawable = new AR.HtmlDrawable({html:"<div><img src="+checkimg+" height='370px' width='230px' style='position:absolute;left:10px;top:10px;float:left;' alt='123'><img src='"+value.image_url+"' height='370px' width='230px' style='position:absolute;left:240px;top:10px;float:left;'><img src="+crimeimg+" height='50px' width='50px' style='position:absolute;left:910px;top:20px;'><img src="+dealimg+" height='100px' width='100px' style='position:absolute;left:240px;top:10px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: myFirstFont;border-style:solid;border-width:10px;border-color:#708090;font-size:60px;border-radius:35px;color:#707070;' ><img src='"+value.rating_img_url_small+"' height='70px' width='200px' style='position:absolute;left:750px;top:300px;'><div style='position:absolute;left:500px'>"+value.name+"</div></div></div>"}, 6, {
  onClick : function() {
	  if(toggle==0)
	  {
    poiHTMLdrawable.html = "<div><img src='http://fblikestube.biz/wp-content/uploads/2013/03/facebook-small-logo.jpg' height='370px' width='230px' style='position:absolute;left:10px;top:10px;float:left;'><img src='"+value.image_url+"' height='370px' width='230px' style='position:absolute;left:240px;top:10px;float:left;'><img src='http://shahmirzadinfo.ir/wp-content/uploads/2012/01/danger.png' height='80px' width='80px' style='position:absolute;left:1050px;top:10px;'><img src='http://4.bp.blogspot.com/-vJS5QFmew1Y/USi_Ke98vwI/AAAAAAAAAPE/Kq8iFLRMWVE/s1600/covert-social+press-discount.png' height='100px' width='100px' style='position:absolute;left:240px;top:10px;float:left;'><div class='test' id='container' style='width:3000px;height:2000px;background-color:#EBEBEB;font-family: myFirstFont;border-style:solid;border-width:0px;border-color:#708090;font-size:60px;border-radius:25px;color:#707070;' ><img src='"+value.rating_img_url_small+"' height='70px' width='200px' style='position:absolute;left:600px;top:300px;'><div style='position:absolute;left:500px'>"+value.name+"</div><div style='position:absolute;left:100px;top:400px;'>Distance : "+dist+"m</div></div></div>";
	  toggle=1;
	  }
	  else if(toggle==1)
	  {
		  poiHTMLdrawable.html = "<div><img src='http://fblikestube.biz/wp-content/uploads/2013/03/facebook-small-logo.jpg' height='370px' width='230px' style='position:absolute;left:10px;top:10px;float:left;'><img src='"+value.image_url+"' height='370px' width='230px' style='position:absolute;left:240px;top:10px;float:left;'><img src='http://shahmirzadinfo.ir/wp-content/uploads/2012/01/danger.png' height='50px' width='50px' style='position:absolute;left:910px;top:20px;'><img src='http://4.bp.blogspot.com/-vJS5QFmew1Y/USi_Ke98vwI/AAAAAAAAAPE/Kq8iFLRMWVE/s1600/covert-social+press-discount.png' height='100px' width='100px' style='position:absolute;left:240px;top:10px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: myFirstFont;border-style:solid;border-width:10px;border-color:#708090;font-size:60px;border-radius:35px;color:#707070;' ><img src='"+value.rating_img_url_small+"' height='70px' width='200px' style='position:absolute;left:750px;top:300px;'><div style='position:absolute;left:500px'>"+value.name+"</div></div></div>";
		  
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
