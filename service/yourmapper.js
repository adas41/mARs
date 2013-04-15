/* Crime alert with Yourmapper */

// Dataset id = 76c4ad1fbbd7d0d645108803f8061eb187b88a06

// Category id - 1,2,3,4,5,6,7

// URL = http://www.yourmapper.com/api/markers?key=250ba5d4f162fc5e392715b3c03d72d3&f=json&id=76c4ad1fbbd7d0d645108803f8061eb187b88a06&lat=33.782946&lon=-84.400431&c=1%2C2%2C3%2C4&search=atlanta&num=100&start=2010-01-01


function getCrimeData(){
	
	$.ajax({
		  'url': './service/yourmapper.php',
		  'data': {lat:coordinates.latitude, lon:coordinates.longitude},
		  'type' : 'GET',
		  'dataType': 'json',
		  'cache': true,
		  'success': function(data, textStats, XMLHttpRequest) {
			parseJSONData(data);
		  },
		  'error': function (xhr, ajaxOptions, thrownError) {
			alert('JSON parse error');
			console.log(xhr.responseText);
			console.log(thrownError);
		  }
	});
	
	function parseJSONData(data) { 
		var jsonObj = jQuery.parseJSON(data);
		$.each(jsonObj.items, function(index, value){
			if(index != 0){
				crimeObjArray.push([value.latitude,value.longitude]);
			}
		});
	};
}
