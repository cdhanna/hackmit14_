//edit.js

function Editor(){

	this.nfa = new NFA();
	this.vs = new Visualizer(this.nfa);
	this.draggingNode = undefined;
	this.hoverNode = undefined;
	this.nameCounter = 0;
	this.dragOffset = {x:0, y:0};
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
		} else {
			console.log(option.name);
		}

		this.vs.setNodePosition(this.draggingNode, pos);

	}



	
}

//called when a mouseup event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseUp = function (pos){
	console.log('mouse up' + pos);
	this.draggingNode = undefined;
}

Editor.prototype.update = function(pos){

	if (this.draggingNode != undefined){
		var posOff = {x: pos.x - this.dragOffset.x, y: pos.y - this.dragOffset.y};
		
		this.vs.setNodePosition(this.draggingNode, posOff);
	}


	this.hoverNode = this.vs.getNodeAt(pos);

}

Editor.prototype.updateNormal = function(){
	this.vs.noNodesHovering();
	if (this.hoverNode != undefined){
		this.vs.setNodeHover(this.hoverNode, 1);
	}
}

Editor.prototype.draw = function(canvas){
	canvas.width = canvas.width;
	this.vs.drawNfa(canvas);

}
