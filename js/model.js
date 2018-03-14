define(function(){
		//private scope	
		var idCount=0;
		
		//public scope object
		var _public={};
	
		_public.defaultType={name: "Default", color:"black", visible:true};

	 	_public.graph={
			nodes:[],
			links:[],
			types:[_public.defaultType,
			{name: "Other", color:"red", visible:false}].sort((a,b)=>(a.name > b.name))
		}

		_public.selected=null;
		
	 	_public.createNode=function(x,y) {
		    var newnode = {
				x: x, 
				y: y,
				id:"id"+(idCount++),
				"label":"New",
				"type":_public.defaultType,
				"attributes":[]
			};
		  _public.graph.nodes.push(newnode);
			return newnode;
		};
		
		_public.createLink=function(source, target){
				var newlink={
					id:"id"+idCount++,
					source:source,
					target:target,
					"label":"New",
					"type":_public.defaultType
				};
				_public.graph.links.push(newlink);
				return newlink;
		};

		_public.views=[];

		_public.changed=function(){
			_public.views.forEach(v => v.update())			
		}

		return _public;
});
