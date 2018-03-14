define(["d3.min", "model"], function(d3, model){	


	var svg, 
	dragLine,
	drag_linking=false,
	link_target=null,
	_public={};
	
	_public.init=function(){
		svg = d3.select("svg")
		.on("click", function(){
			var point = d3.mouse(this);
			var newNode=model.createNode(point[0], point[1]);
			select(newNode);
		});


		var width = +svg.attr("width"),
			height = +svg.attr("height")

		dragLine = svg.append('line')
		.classed('dragline hidden', true)
		.attr("x1", 0 )
		.attr("y1", 0 )
		.attr("x2", 100)
		.attr("y2", 100)
	}

	

	_public.update=function(){
		var link_update = svg.selectAll(".link").data(model.graph.links, function(d){return d.id;});
		var link_exit = link_update.exit();
		 
		link_exit
		.remove();
	
		var link_enter=link_update.enter()
		.insert("g",":first-child")
			.classed("link", true)
			.attr("id", function(d){return d.id;})
			.on("click", function(d){
				d3.event.stopPropagation();
				select(d);
		});
			
		link_enter.insert("line").classed("visiblelink", true);
		link_enter.insert("line",":first-child").classed("clicksurface", true);
	
		link_enter
		.insert("text");
	
		var link_merged = link_update.merge(link_enter);
	
		link_merged
		.selectAll(".visiblelink")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
		.style("stroke", function(d){ return d.type.color})
		.style("visibility", function(d){ return d.type.visible?"visible":"collapse"})
	
		link_merged
		.selectAll(".clicksurface")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
		.style("visibility", function(d){ return d.type.visible?"hidden":"collapse"})
	
	
		//TODO: space text so that it does not overlap line
		//TODO: multiple relationships among the same objects hide each other. The lines should be curve and 
		//with different middle point
	
		link_merged
		.selectAll("text") 
			.attr('x', function(d){return (d.source.x+d.target.x)/2+10})
			.attr('y', function(d){return (d.source.y+d.target.y)/2+10})
			.text(function(d) {
				return d.label;
			})
		.style("visibility", function(d){ return d.type.visible?"visible":"collapse"});
	
	
		var node_update = svg.selectAll(".node").data(model.graph.nodes, function(d){return d.id;});
		
		var node_exit = node_update.exit();
		node_exit.remove();
		
		var node_enter = node_update.enter()
		.append("g")
			.classed("node", true)
			.attr("id", function(d){return d.id;})
		.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended))
		.on("click", function(d){
			d3.event.stopPropagation();
			select(d);
		})
		.on("mouseenter", function(d){
			if(drag_linking)link_target=d;
		})
		.on("mouseleave", function(d){
			if(drag_linking)link_target=null;
		});
	
		node_enter.append("circle")
			.attr("r", 13)
	
		node_enter.append("text")
		.attr('x', 20)
		.attr('y', 6);
	
		var node_merged = node_update.merge(node_enter);
		
		node_merged
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			})
		.selectAll("text") 
			.text(function(d) {
				return d.label;
			})
			.style("visibility", function(d){ return d.type.visible?"visible":"collapse"});
		
		node_merged
			.selectAll("circle")
			.style("fill", function(d){ return d.type.color})
			.style("visibility", function(d){ return d.type.visible?"visible":"collapse"});
			
	}


	function select(datum){
		d3.selectAll(".visiblelink").classed("selected", false);
		d3.selectAll("circle").classed("selected", false);
		d3.select("#"+datum.id).select(".visiblelink").classed("selected", true);
		d3.select("#"+datum.id).select("circle").classed("selected", true);
		model.selected=datum;
		model.changed();
	}


	function dragstarted(d) {
		if(d3.event.sourceEvent.shiftKey){
			drag_linking=true;
			dragLine
			.classed("hidden", false)
			.attr("x1", d.x )
			.attr("y1", d.y )
			.attr("x2", d3.event.x)
			.attr("y2", d3.event.y);
		}
	}

	function dragged(d){
		if(drag_linking){
			dragLine
			.attr("x2", d3.event.x)
			.attr("y2", d3.event.y);
		}
		else{
			d.x = d3.event.x;
			d.y = d3.event.y;
			d3.select(this).attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		
		d3.selectAll(".visiblelink")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; })
	
	
		d3.selectAll(".clicksurface")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });
		}
	
		d3.selectAll(".link")
		.selectAll("text") 
			.attr('x', function(d){return (d.source.x+d.target.x)/2})
			.attr('y', function(d){return (d.source.y+d.target.y)/2})
	}

	
	function dragended(d) {
		if(drag_linking){
			drag_linking=false;
			dragLine.classed("hidden", true);
			if(link_target){
				var newlink=model.createLink(d, link_target);
				select(newlink);
			}
		}
	}

	return _public;

});
