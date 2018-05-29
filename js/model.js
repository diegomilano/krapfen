define(function(){
		//private scope
		var idCount=0;

		//public scope object
		var _public={};

		_public.defaultType={name: "Default", color:"black", visible:true};
		defaultTypeList=[
			_public.defaultType,
			{name: "Other", color:"red", visible:false}
		].sort((a,b)=>(a.name > b.name))

	 	_public.graph={
			nodes:[],
			links:[],
			types: defaultTypeList
		}

		_public.selected=null;

		_public.import=function(graph){
			_public.graph=graph;

			_public.graph.types=_public.graph.types?_public.graph.types.sort((a,b)=>(a.name > b.name)):defaultTypeList;

			_public.graph.nodes.forEach(function(n){
				n.id=n.id?n.id:"id"+(idCount++);
				n.x=n.x?n.x:0;
				n.y=n.y?n.y:0;
				n.type?n.type=_public.graph.types.filter(t => t.name==n.type)[0]:_public.defaultType;
				n.attributes=n.attributes?n.attributes:[];
			});

			_public.graph.links.forEach(function(l){
				l.id=l.id?l.id:"id"+(idCount++);
				l.type?l.type=_public.graph.types.filter(t => t.name==l.type)[0]:_public.defaultType;
				l.source=_public.graph.nodes.filter(n => n.id==l.source)[0];
				l.target=_public.graph.nodes.filter(n => n.id==l.target)[0];
				l.attributes=l.attributes?l.attributes:[];
			});
		}

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
