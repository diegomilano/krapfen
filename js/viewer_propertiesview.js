define(["d3.min", "model"], function(d3, model){

	var colors=["black", "red", "blue"];

	var _public={};

	_public.init= function(){
		//nothing to init
	}

	_public.update=function(){
		if(!model.selected)return;

		d3.select("#label").text(model.selected.label);
		d3.select("#type").text(model.selected.type.name);

		//list of attributes
		var attrs=d3.select("#attrs")
			.selectAll(".list-group-item")
			.data(model.selected.attributes||[], function(d,i){return d+i});

			attrs
			.exit()
			.remove();

			enter=attrs
				.enter()

  		var input =	enter.append("li")
					.classed("list-group-item", true)
					.text(function(d){return d})
		}


	return _public;

});
