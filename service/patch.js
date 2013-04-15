/* Patch Local News API */
function callPatch(searchTerm){
	// searchTerm is used to filter stories from their titles. If no match found, searchTerm is ignored
	
	var BASE_URL = "http://news-api.patch.com/v1.1/zipcodes/";
	var key = 'v2mz858txmbf8zz687c5qguq';
	var secret = 'nGpkfqjTw5';
	
	var hm = key + secret + (Math.round(new Date().getTime() / 1000).toString());
    var sig = MD5(hm);
	
	//var url = BASE_URL+'30318'+'/stories'+'?dev_key=' + key + '&sig=' + sig + '&radius=10000';
	var url = 'http://news-api.patch.com/v1.1/states/fl/stories'+'?dev_key=' + key + '&sig=' + sig;
	
	 $.ajax({
      url: url, dataType: 'json', type: 'GET',
      success: function (data, status, xhr) {
        if (data == null) {
          alert("An error occurred connecting to " + url +
            ". Please ensure that the server is running and configured to allow cross-origin requests.");
        } else {
          console.log(data);
        }
      },
      error: function (xhr, status, error) {
		console.log(error);
        //alert(error+xhr+status+"An error occurred - check the server log for a stack trace.");
      }
    });
}