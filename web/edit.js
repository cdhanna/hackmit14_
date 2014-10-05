//edit.js

function Editor(){

	this.nfa = new NFA();
	this.vs = new Visualizer(this.nfa);
	this.draggingNode = undefined;
	this.hoverNode = undefined;
	this.nameCounter = 0;
	this.dragOffset = {x:0, y:0};
	this.editEdge = undefined;
	this.hoverEdge = undefined;
	this.draggingEdge = undefined;
	this.acceptedKeySet = "abcdefghijklmnopqrstuvwxyz0123456789";
}


Editor.prototype.generateFrom = function(regexStr){

	this.nfa = new NFA();
	var g = new RegexGrapher(new RegexParser(regexStr).regex(), this.nfa).toGraph();


	this.vs = new Visualizer(this.nfa);
	this.vs.generatePositions();

}

Editor.prototype.onKey = function(e){

	if (this.editEdge == undefined){
		return;
	}

	//if (this.editEdge != undefined){
		var key = String.fromCharCode(e.keyCode);
		key = key.toLowerCase();
		if (this.acceptedKeySet.indexOf(key) > -1){
			editEdge.character = key;
		} else if (e.keyCode == 46 || e.keyCode == 8){
			editEdge.prev_node.remove_edge(editEdge);
			editEdge.next_node.remove_edge(editEdge);
		} else {
			editEdge.character = "eps";
		}
		console.log(key);

	//}
	this.vs.edgeEditing = undefined;
	editEdge = undefined;
}

//called when a mousedown event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseDown = function (pos){
	//console.log('mouse down' + pos);

	this.vs.edgeEditing = undefined;

	var clickedNode = this.vs.getNodeAt(pos);
	var clickedEdge = this.vs.getEdgeAt(pos);
	if (clickedEdge != undefined){
		editEdge = clickedEdge;
		this.vs.edgeEditing = editEdge;
		console.log("cliked on edge");
	} else if (clickedNode == undefined && editEdge == undefined){
		var newNode = new Node('fartNode' + (this.nameCounter++));
		this.nfa.add_node(newNode);
		this.vs.setNodePosition(newNode, pos);
	} else {
		editEdge = undefined;

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
        } else if(option.name == "set_start") {
            clickedNode.starting = !clickedNode.starting;
        } else if(option.name == "set_final") {
            clickedNode.final = !clickedNode.final;
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
	this.hoverEdge = this.vs.getEdgeAt(pos);

}

Editor.prototype.updateNormal = function(){
	this.vs.noNodesHovering();
	if (this.hoverNode != undefined){
		this.vs.setNodeHover(this.hoverNode, 1);
	}

	this.vs.noEdgesHovering();
	if (this.hoverEdge != undefined){
		this.vs.setEdgeHover(this.hoverEdge, 1);
	}
}

Editor.prototype.draw = function(canvas, scale, offset){
	canvas.width = canvas.width;
	this.vs.drawNfa(canvas, scale, offset);

}
