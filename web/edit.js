//edit.js

function Editor(){

	this.nfa = new NFA();
	this.vs = new Visualizer(this.nfa);
	this.draggingNode = undefined;
	this.hoverNode = undefined;
	this.nameCounter = 0;
	this.dragOffset = {x:0, y:0};

	this.draggingEdge = undefined;

}


Editor.prototype.generateFrom = function(regexStr){

	this.nfa = new NFA();
	var g = new RegexGrapher(new RegexParser(regexStr).regex(), this.nfa).toGraph();


	this.vs = new Visualizer(this.nfa);
	this.vs.generatePositions();

}

//called when a mousedown event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseDown = function (pos){
	//console.log('mouse down' + pos);


	var clickedNode = this.vs.getNodeAt(pos);
	if (clickedNode == undefined){
		var newNode = new Node('fartNode' + (this.nameCounter++));
		this.nfa.add_node(newNode);
		this.vs.setNodePosition(newNode, pos);
	} else {

		var option = this.vs.getOptionAt(clickedNode, pos);

		if (option == undefined){
			

			this.dragOffset = this.vs.getNodePosition(clickedNode);
			this.dragOffset.x = pos.x - this.dragOffset.x;
			this.dragOffset.y = pos.y - this.dragOffset.y;
			
			this.draggingNode = clickedNode;
			this.hoverNode = clickedNode;

			this.vs.setNodePosition(clickedNode, pos);
		} else if(option.name == "addpair") {
			console.log(option.name);
			this.draggingNode = undefined;
			this.draggingArrow = clickedNode;
		} else if(option.name == "removenode") {
			this.nfa.remove_node(clickedNode);
		}

		
	}



	
}

//called when a mouseup event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseUp = function (pos){
	console.log('mouse up' + pos);
	this.draggingNode = undefined;

	if (this.draggingArrow != undefined){

		var clickedNode = this.vs.getNodeAt(pos);
		if (clickedNode != undefined){

			var edge = new Edge(this.draggingArrow, '?', clickedNode);
			console.log(this.nfa);
			this.draggingArrow.add_next_edge(edge);

		}


		
	}
	this.draggingArrow = undefined;
}

Editor.prototype.update = function(pos){

	if (this.draggingNode != undefined){
		var posOff = {x: pos.x - this.dragOffset.x, y: pos.y - this.dragOffset.y};
		
		this.vs.setNodePosition(this.draggingNode, posOff);
	}

	if (this.draggingArrow != undefined){

		this.vs.setEdgeArrow(this.draggingArrow, pos);
	} else {
		this.vs.setEdgeArrow(undefined, pos);
	}

	this.hoverNode = this.vs.getNodeAt(pos);

}

Editor.prototype.updateNormal = function(){
	this.vs.noNodesHovering();
	if (this.hoverNode != undefined){
		this.vs.setNodeHover(this.hoverNode, 1);
	}
}

Editor.prototype.draw = function(canvas, scale, offset){
	canvas.width = canvas.width;
	this.vs.drawNfa(canvas, scale, offset);

}
