<?php
	
	
	$URL = 'http://www.yourmapper.com/api/markers';
		
	$categories = '1,2,3,4,5';
	$numOfResults = 100;
	$startDate = '2009-01-01';

	$key    = '250ba5d4f162fc5e392715b3c03d72d3';
	$f      = 'json';
	$id     = '76c4ad1fbbd7d0d645108803f8061eb187b88a06';
	$lat    = $_GET['lat'];
	$lon    = $_GET['lon'];
	$c      = $categories;
	$search =  '';
	$num    = $numOfResults;
	$start  = $startDate;
	
	
	$queryString = '?key='.$key.'&f='.$f.'&id='.$id.'&c='.$c.'&lat='.$lat.'&lon='.$lon.'&search='.$search.'&num='.$num.'&start='.$start;
	$jsonURL = $URL.$queryString;
	

	$crimeData = file_get_contents($jsonURL);

	echo(json_encode($crimeData));

?>