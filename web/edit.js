//edit.js

function Editor(){

	this.nfa = new NFA();
	this.vs = new Visualizer(this.nfa);

}

//called when a mousedown event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseDown = function (pos, canvas){
	//console.log('mouse down' + pos);


	var clickedNode = this.vs.getNodeAt(pos);
	if (clickedNode == undefined){
		var newNode = new Node('fart');
		this.nfa.add_node(newNode);
		this.vs.setNodePosition(newNode, pos);
	}

	this.vs.drawNfa(canvas);

}

//called when a mouseup event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseUp = function (pos, canvas){
	console.log('mouse up' + pos);

}


