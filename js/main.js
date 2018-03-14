requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    shim: {
        'bootstrap.bundle.min':['jquery-3.3.1.slim.min']
    }
});


requirejs([
'jquery-3.3.1.slim.min', 
'bootstrap.bundle.min',
'd3.min',
'propertiesview',
'graphview',
'textview',
'model'],

function($, bootstrap, d3, propview, graphview, textview, model) {
		  
	d3.text("data.txt", function(error, data) {
		if (error) throw error;
		//graph=JSON.parse(data);	
	});	

	model.views=model.views.concat([propview, graphview, textview]);
	model.views.forEach(x => x.init());
	model.changed();

	//end of module
});





