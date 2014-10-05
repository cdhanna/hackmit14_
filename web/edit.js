//edit.js

function Editor(){

	this.nfa = new NFA();
	this.vs = new Visualizer(this.nfa);
	this.draggingNode = undefined;
	this.nameCounter = 0;
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
		this.draggingNode = clickedNode;

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
		this.vs.setNodePosition(this.draggingNode, pos);
	}

}

Editor.prototype.draw = function(canvas){
	canvas.width = canvas.width;
	this.vs.drawNfa(canvas);

}
