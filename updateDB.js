	function pushData() {
		
		var data = 

		//hardcode JSON data here
		//use https://shancarter.github.io/mr-data-converter/ to convert from excel/csv to JSON properties 
		
		var basepath = "https://santro-velo.herokuapp.com:443/users?"

		for (var i = 0; i < data.length; i++) {
			
			$.post(basepath + "firstname=" + data[i].firstname + "&lastname=" + data[i].lastname + "&datejoined=" + data[i].datejoined + "&phone=" + data[i].phone + "&valid=" + data[i].valid);
			
		}
	}