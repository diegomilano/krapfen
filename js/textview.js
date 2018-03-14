define(["d3.min", "model"], function(d3, model){	

	var textarea;
	var _public={};

	_public.init=function(){
		textarea=d3.select("#graph_code");
		_public.update();
	};

	_public.update=function(){
		textarea.property("value", JSON.stringify(model.graph));
	}
	
	return _public;
});
