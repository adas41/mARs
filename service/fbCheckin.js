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
			
			
	function getCheckinData() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('me', function(response) {
			//console.log('Good to see you, ' + response.name + '.');
		});
				
			
		var myLocation;
		FB.api('me?fields=location', function(response) {
			//console.log(response);
			window.myLocation = response.location.id;
			getFriendsCheckInData();
		});
				
		FB.api('me/permissions', function (response) {
			//console.log(response.data);                           
		} );
	}
			
	function getFriendsCheckInData() {			
		FB.api('me/friends?fields=id,name,location', function(response) {
			if(response.data) {
				$.each(response.data,function(index,friend) {
				
					if (friend.hasOwnProperty('location')) {
						
						friendLocation = ''+friend.location.id;
						
						if(friendLocation == myLocation){
							
							FB.api(friend.id+'/checkins', function(response) {
								if(response.data) {
									$.each(response.data,function(index,checkIn) {
														
											//ignore checkins that are more than 100 miles away from current location
											
											if(getProximity(coordinates.latitude,coordinates.longitude,checkIn.place.location.latitude,checkIn.place.location.longitude) <= 160934){
											
												checkinObjArray.push([checkIn.from.name,checkIn.place.name,checkIn.place.location.latitude,checkIn.place.location.longitude,'https://graph.facebook.com/'+friend.id+'/picture']);
													
											}
													
									});
								} 
								else {
									console.log(response.error.message);
								}
							});
						}
					}
							
							
				});
			}
			else {
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
			   
			  
			   
