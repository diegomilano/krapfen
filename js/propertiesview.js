define(["d3.min", "model"], function(d3, model){
	
	var colors=["black", "red", "blue"];
	
	var _public={};
	
	_public.init= function(){
		init_types_view();
		init_selected_view();
	}
	
	_public.update=function(){
		update_types_view();
		update_selected_view();	
	}

	function init_types_view(){
		//New type button
		d3.select("#addtype").on("click",
			function(){
				model.graph.types.push({name:"NEW", color:"black", visible:true});
				model.changed();
			});
	}
	
	function update_types_view(){
		//types list
		var types=d3.select("#types")
		.selectAll(".type")
		.data(model.graph.types, function(d){return d.name});
	
		types.exit().remove();
	
		var types_enter=types
		.enter()
		.append("div")
		.classed("type input-group mb-3", true);
	
		types_enter
		.append("input")
			.attr("type","text")
			.classed("form-control", true)
		
		var input_append_enter=types_enter
		.append("div")
		.classed("input-group-append", true)
	
		var options=input_append_enter
		.append("select")
		.classed("form-control",true)
		.style("border-left","4px solid")
		.selectAll("option")
		.data(function(d, i){return colors})
	
		options.enter()
		.append("option")
			.attr("value", function(d){return d})
			.text(function(d){return d})
			.style("border-left-style", "solid")
			.style("border-left-width", "4px")
			.style("border-left-color", function(d){return d})
		.merge(options)
			.property("selected", function(d){
				return d3.select(this.parentNode).datum().color===d;
			})
	
		input_append_enter
		.append("div")
			.classed("input-group-text",true)
		.append("input")
			.attr("type","checkbox")
			.property("checked", function(d){return d.visible});
	
		input_append_enter
		.append("button")
		.classed("btn btn-outline-secondary",true)
		.text("-")
	
		types_merge=types_enter
		.merge(types)
	
		types_merge
		.select("input[type=text]")
		.property("value", function(d){return d.name})
		.on("input", function(d){
			d.name=d3.select(this).property("value");
			model.changed();
		})
	
		types_merge
		.select("select")
		.style("border-left-style", "solid")
		.style("border-left-width", "4px")
		.style("border-left-color", function(d){return d.color})
		.on("input", function(d){
			d.color=d3.select(this).property("value");
			model.changed();
		})
	
		types_merge
		.select("input[type=checkbox]")
		.on("click", function(d){
			d.visible=d3.select(this).property("checked");
			model.changed();
		})
	
		types_merge
		.select("button")
		.on("click", function(d,i){
			model.graph.types.splice(i,1);
			model.changed();
		})
	
}


	function init_selected_view(){
		
		//Label field		
		d3.select("#label").on("input",
		function(){
			if(model.selected){
				model.selected.label=this.value;
				model.changed();
			}
		});		

		//type selection dropdown
		d3.select("#typeselect").on("input", 
		function(){
			if(model.selected){
				model.selected.type=model.graph.types.filter(x => this.value==x.name)[0];
				model.changed();
			}
		});

		//add attribute button
		d3.select("#addattr").on("click", 
		function(){
			if(model.selected){
				model.selected.attributes.push("NEW");
				model.changed();
			}
		}); 
	}

	


	

function update_selected_view(){	
		if(!model.selected)return;
		d3.select("#label").node().value=model.selected.label;
		
		//types dropdown - list of options
		var typeselect=d3.select("#typeselect")	
		.selectAll("option")
		.data(model.graph.types, function(d){return d.name});
	
		typeselect.exit().remove();
	
		var enter=typeselect.enter()
		.append("option")
		
		typeselect_merge=
		typeselect.merge(enter)
			.attr("value", function(d){return d.name})
			.text(function(d){return d.name})
	
		if(model.selected){
			d3.select("#typeselect")	
			.style("border-left-style", "solid")
			.style("border-left-width", "4px")
			.style("border-left-color", model.selected.type.color);
	

			typeselect_merge
			.property("selected", function(d){return model.selected.type===d});
		
		//list of attributes		
		var attrs=d3.select("#attrs")
			.selectAll(".input-group")
			.data(model.selected.attributes||[], function(d,i){return d+i});
		
			attrs
			.exit()
			.remove();
		
			enter=attrs
				.enter()
				.append("div")
					.classed("input-group mb-3", true);
					
			var input =	enter.append("input")
					.attr("type", "text")
					.classed("form-control", true)
					.attr("value", function(d){return d})
					.on("input", function(d, i){
						model.selected.attributes.splice(i,1,this.value);
						model.changed();
					});
				
					
			var button = enter
				.append("div")
					.classed("input-group-append", true)
				.append("button")
					.classed("btn btn-outline-secondary", true)
					.text("remove")
		
			//note the on must be added to the entire update or the indexes will be cached in the closure
			update=enter.merge(attrs);
			
			update.select(".btn").on("click", function(d1,i){
						model.selected.attributes.splice(i,1);
						model.changed();
					})
		
		}
	
	}

	return _public;

});
