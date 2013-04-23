function callYelpSearch(searchTerm){
	alert("Neelima Yelp is being called");
	
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
	//var rad = new AR.radar(background:imageres;centerX :0.5;centerY :0.5;enabled:true;maxDistance:1000;northIndicator.image:imageres;northIndicator.radius:0.45;positionX:0;positionY:0;radius:0.5;width:0.1;);
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
	parameters.push(['longitude', coordinates.longitude]);
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
		
		//var infowindow = new google.maps.InfoWindow({content: ""});
		
		//map = new google.maps.Map(document.getElementById("map-content"),myOptions);
		//initialLocation = new google.maps.LatLng(coordinates.latitude, coordinates.longitude);	
		//marker = new google.maps.Marker({
			//		position: initialLocation,
				//	map: map,
					//title: "You are here",
					//icon: "./assets/img/marker.png"	
		//});
		/*
	var text = "NEEEEELIIIIMMMAAAAAAAAA";
		//geoObject = [];
		//var myCircle = new AR.Circle(0.5, {style: {fillColor: '#FFC100'}});
		var poiHTMLdrawable = new AR.HtmlDrawable({html:"<div id='container' style='width:500px;'><div id='header' style='background-color:#FFA500;'><h1 style='margin-bottom:0;'>"+text+"</h1></div><div id='menu' style='background-color:#FFD700;height:200px;width:100px;float:left;'><b>Menu</b><br>HTML<br>CSS<br>JavaScript</div><div id='content' style='background-color:#EEEEEE;height:200px;width:400px;float:left;'>Content goes here</div><div id='footer' style='background-color:#FFA500;clear:both;text-align:center;'>Copyright © W3Schools.com</div></div>"}, 4, {viewportWidth: 512, scale:1,opacity:0.0, updateRate:AR.HtmlDrawable.UPDATE_RATE.STATIC, onClick : function() {poiHTMLdrawable.html += "<div id='container' style='width:500px'><div id='header' style='background-color:#FFA500;'><h1 style='margin-bottom:0;'>Main Title of Web Page</h1></div><div id='menu' style='background-color:#FFD700;height:200px;width:100px;float:left;'><b>Menu</b><br>HTML<br>CSS<br>JavaScript</div><div id='content' style='background-color:#EEEEEE;height:200px;width:400px;float:left;'>Content goes here</div><div id='footer' style='background-color:#FFA500;clear:both;text-align:center;'>Copyright © W3Schools.com</div></div>";},horizontalAnchor : AR.CONST.HORIZONTAL_ANCHOR.LEFT,opacity : 0.9});
	*/
		points=new Array();
		$.each(result, function(index, value){
			var toggle =0;
			var text = "NEEEEELIIIIMMMAAAAAAAAA";
		//geoObject = [];
		//var myCircle = new AR.Circle(0.5, {style: {fillColor: '#FFC100'}});
		   var dist=Math.floor(value.distance);
	var poiHTMLdrawable = new AR.HtmlDrawable({html:"<div><img src='http://fblikestube.biz/wp-content/uploads/2013/03/facebook-small-logo.jpg' height='370px' width='230px' style='position:absolute;left:10px;top:10px;float:left;'><img src='"+value.image_url+"' height='370px' width='230px' style='position:absolute;left:240px;top:10px;float:left;'><img src='http://shahmirzadinfo.ir/wp-content/uploads/2012/01/danger.png' height='50px' width='50px' style='position:absolute;left:910px;top:20px;'><img src='http://4.bp.blogspot.com/-vJS5QFmew1Y/USi_Ke98vwI/AAAAAAAAAPE/Kq8iFLRMWVE/s1600/covert-social+press-discount.png' height='100px' width='100px' style='position:absolute;left:240px;top:10px;float:left;'><div class='test' id='container' style='width:970px;height:370px;background-color:#EBEBEB;font-family: myFirstFont;border-style:solid;border-width:10px;border-color:#708090;font-size:60px;border-radius:35px;color:#707070;' ><img src='"+value.rating_img_url_small+"' height='70px' width='200px' style='position:absolute;left:750px;top:300px;'><div style='position:absolute;left:500px'>"+value.name+"</div></div></div>"}, 6, {
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
						//point.id=i;
						//alert(point.id);		
									

		});
		
		
		//alert(geoLocation[0]);
		/*
		var myGeoObject1 = new AR.GeoObject(geoLocation[0], {drawables: {cam: myCircle}});
		var myGeoObject2 = new AR.GeoObject(geoLocation[1], {drawables: {cam: myCircle}});
		var myGeoObject3 = new AR.GeoObject(geoLocation[2], {drawables: {cam: myCircle}});
		var myGeoObject4 = new AR.GeoObject(geoLocation[3], {drawables: {cam: myCircle}});*/
				  		
		//map.setOptions({zoom: 12});
		//map.setCenter(initialLocation); 
		
	}
}
