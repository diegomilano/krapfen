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
'viewer_propertiesview',
'graphview',
'model'],

function($, bootstrap, d3, propview, graphview, model) {
  model.views=model.views.concat([propview, graphview]);

	d3.text("data.txt").then(function(data) {
		model.import(JSON.parse(data));
    console.log(model.graph);
    model.views.forEach(x => x.init());
  	model.changed();
	});
	//end of module
});
