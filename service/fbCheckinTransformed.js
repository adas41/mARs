// Additional JS functions here
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '1296816550457650', // App ID
			channelUrl : 'http://localhost/mARs/channel.html', // Channel File
			status     : true, // check login status
			cookie     : true, // enable cookies to allow the server to access the session
			xfbml      : true  // parse XFBML
		});

		// Additional init code here
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				// connected
				// getData();
			} 
			else if (response.status === 'not_authorized') {
				// not_authorized
				login();
			} 
			else {
				// not_logged_in
				login();
			}
		});

	};
			  
			  
	function login() {
		FB.login(function(response) {
			if (response.authResponse) {
				console.log(response);
				// connected
			} else {
				// cancelled
			}
		}, {scope: 'user_location,friends_location,friends_online_presence,user_status,user_checkins,friends_status '});
	}
			
			
	function getData() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('me', function(response) {
			console.log('Good to see you, ' + response.name + '.');
		});
				
			
		var myLocation;
		FB.api('me?fields=location', function(response) {
			console.log(response);
			window.myLocation = response.location.id;
			getFriendsCheckInData();
		});
				
		FB.api('me/permissions', function (response) {
			//console.log(response.data);                           
		} );
	}
	
	/*function isCheckinPresent(placeName){
		$.each(checkinObjArray, function(index, value){
			if(placeName == value.name){
				return index; // check if person already exists i.e., a person set
			}
			else{
				return -1;									
			}
		});
		for(index=0; index<checkinObjArray.length; index++){
			//console.log(placeName+" -- "+checkinObjArray[index].place);
			if(placeName === checkinObjArray[index].place){
				console.log(index);
				return index; // check if person already exists i.e., a person set
			}
		}
		return -1;
	}*/
			
	function getFriendsCheckInData() {
			
		console.log(window.myLocation);
		var today = new Date().getTime();
			
		FB.api('me/friends?fields=id,name,location', function(response) {
			if(response.data) {
				$.each(response.data,function(index,friend) {
				//console.log(friend);
					if (friend.hasOwnProperty('location')) {
						//console.log(friend.name+','+friend.location.id+','+myLocation)
						friendLocation = ''+friend.location.id;
						//console.log(friendLocation == myLocation);
						//console.log(typeof myLocation);
						if(friendLocation == myLocation){
							//console.log('match');
							FB.api(friend.id+'/checkins', function(response) {
								if(response.data) {
									$.each(response.data,function(index,checkIn) {
										var checkInDate = Date.parse(checkIn.created_time);
										//console.log(today - checkInDate);
										//if((today - checkInDate) <= 7200000){
											//console.log(checkIn.from.name+": "+checkIn.place.location.latitude+", "+checkIn.place.location.longitude);
											//console.log('https://graph.facebook.com/'+friend.id+'/picture');
											
											//ignore checkins that are more than 100 miles away from current location
											
											if(getProximity(coordinates.latitude,coordinates.longitude,checkIn.place.location.latitude,checkIn.place.location.longitude) <= 160934){
												checkinObj.name = checkIn.from.name;
												checkinObj.place = checkIn.place.name;
												checkinObj.latitude = checkIn.place.location.latitude;
												checkinObj.longitude = checkIn.place.location.longitude;
												checkinObj.imgURL = 'https://graph.facebook.com/'+friend.id+'/picture';
												checkinObjArray.push([checkIn.from.name,checkIn.place.name,checkIn.place.location.latitude,checkIn.place.location.longitude,'https://graph.facebook.com/'+friend.id+'/picture']);
												
												/*personObj.name = checkIn.from.name;
												personObj.imgURL = 'https://graph.facebook.com/'+friend.id+'/picture';
												
												console.log(checkIn.from.name+" checked in @ "+checkIn.place.name);
												
												index = -1;
												for(i=0; i<checkinObjArray.length; i++){
													if(checkIn.place.name == checkinObjArray[i].place){
														console.log("Inside loop");
														index = i; // check if person already exists i.e., a person set
														break;
													}
												}
												
												index = (function(placeName){
													for(index=0; index<checkinObjArray.length; index++){
														if(placeName === checkinObjArray[index].place){
															console.log("Inside loop");
															return index;
														}
													}
													return -1;
												})(checkIn.place.name);
												console.log("Outside loop");
												index = isCheckinPresent(checkIn.place.name);
												console.log(index);
												if(index != -1){
													checkinObjArray[index].person.push(personObj);
												}
												else{
													checkinObj.place = checkIn.place.name;
													checkinObj.latitude = checkIn.place.location.latitude;
													checkinObj.longitude = checkIn.place.location.longitude;
													checkinObj.person.push(personObj);
													checkinObjArray.push(checkinObj);
												}*/	
											}
											
										//}
													
									});
								} 
								else {
									//alert("Error!");
									console.log(response.error.message);
								}
							});
						}
					}
							
							
				});
			}
			else {
					//alert("Error!");
					console.log(response.error.message);
			}
		});
	}
			

	// Load the SDK Asynchronously
	(function(d){
		var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement('script'); js.id = id; js.async = true;
		js.src = "http://connect.facebook.net/en_US/all.js";
		ref.parentNode.insertBefore(js, ref);
	}(document));
			   
			  
			   
