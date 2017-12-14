console.log("starting main.js")

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    shim: {
        'bootstrap.bundle.min':['jquery-3.3.1.slim.min']
    }
});


requirejs(['jquery-3.3.1.slim.min', 'bootstrap.bundle.min','d3.min'],

function($, bootstrap, d3) {

	var idCount=0;
	var defaultType={name: "Default", color:"black", visible:true};
	var graph={
			nodes:[],
			links:[],
			types:[defaultType,
			{name: "Other", color:"red", visible:false}].sort((a,b)=>(a.name > b.name))
		}
	var selected=null;	
	var drag_linking=false;
	var link_target=null;

	var colors=["black", "red", "blue"];

	var svg = d3.select("svg")
		.on("click", createNode);
	
	var width = +svg.attr("width"),
		  height = +svg.attr("height")
		  

	
	d3.text("data.txt", function(error, data) {
		if (error) throw error;
		//graph=JSON.parse(data);
		
	});	
	
	function update_text_view(){
		var ta=d3.select("#graph_code");
		ta.node().value=JSON.stringify(graph);
	}


	var dragLine = svg.append('line')
		.classed('dragline hidden', true)
		.attr("x1", 0 )
		.attr("y1", 0 )
		.attr("x2", 100)
		.attr("y2", 100)

	
	var textarea=d3.select("#graph_code").node();



	function update_graph_view(){	
		var link_update = svg.selectAll(".link").data(graph.links, function(d){return d.id;});
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
	
	
	
		var node_update = svg.selectAll(".node").data(graph.nodes, function(d){return d.id;});
		
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
		selected=datum;
		update_properties_view();
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
				var newlink={
					id:"id"+idCount++,
					source:d,
					target:link_target,
					"label":"New",
					"type":defaultType
				};
				graph.links.push(newlink);
				update_text_view();
				update_graph_view();
				select(newlink);
			}
		}
	}


	function createNode() {
		var point = d3.mouse(this),
		    newnode = {
				x: point[0], 
				y: point[1],
				id:"id"+(idCount++),
				"label":"New",
				"type":defaultType,
				"attributes":[]
			};
			
		    graph.nodes.push(newnode);
			update_text_view();
			update_graph_view();
			select(newnode);
		}
		

		  
	d3.select("#label").on("input", 
	function(){
		if(selected){
			selected.label=this.value;
			update_text_view();
			update_graph_view();
		}
	});

	d3.select("#typeselect").on("input", 
	function(){
		if(selected){
			selected.type=graph.types.filter(x => this.value==x.name)[0];
			update_views();
		}
	});

	d3.select("#addattr").on("click", 
	function(){
		if(selected){
			selected.attributes.push("NEW");
			update_text_view();
			update_properties_view();
		}
	}); 

	d3.select("#addtype").on("click", 
	function(){
		graph.types.push({name:"NEW", color:"black", visible:true});
		update_text_view();
		update_properties_view();
	}); 

	function update_properties_view(){
	
	
		//Types Tab
		var types=d3.select("#types")
		.selectAll(".type")
		.data(graph.types, function(d){return d.name});
	
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
			update_views();
		})
	
		types_merge
		.select("select")
		.style("border-left-style", "solid")
		.style("border-left-width", "4px")
		.style("border-left-color", function(d){return d.color})
		.on("input", function(d){
			d.color=d3.select(this).property("value");
			update_views();
		})
	
		types_merge
		.select("input[type=checkbox]")
		.on("click", function(d){
			d.visible=d3.select(this).property("checked");
			update_views();
		})
	
		types_merge
		.select("button")
		.on("click", function(d,i){
			graph.types.splice(i,1);
			update_views();
		})
	
	
		//types dropdown
		var typeselect=d3.select("#typeselect")	
		.selectAll("option")
		.data(graph.types, function(d){return d.name});
	
		typeselect.exit().remove();
	
		var enter=typeselect.enter()
		.append("option")
		
		typeselect_merge=
		typeselect.merge(enter)
			.attr("value", function(d){return d.name})
			.text(function(d){return d.name})
	
		
		if(selected){
			d3.select("#typeselect")	
			.style("border-left-style", "solid")
			.style("border-left-width", "4px")
			.style("border-left-color", selected.type.color);
	
		
			typeselect_merge
			.property("selected", function(d){return selected.type===d});
		
			//Current Selection Tab
			d3.select("#label").node().value=selected.label;
		
		
		var attrs=d3.select("#attrs")
			.selectAll(".input-group")
			.data(selected.attributes||[], function(d,i){return d+i});
		
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
						selected.attributes.splice(i,1,this.value);
						update_text_view();
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
						selected.attributes.splice(i,1);
						update_text_view();
						update_properties_view();
					})
							
		
		}
	
	}


	function update_views(){
		update_text_view();
		update_properties_view();
		update_graph_view();
	}

//end of module
});





