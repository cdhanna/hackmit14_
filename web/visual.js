function Visualizer(nfa){

	this.nfa = nfa;
	this.nodePosMap = {};

}

Visualizer.prototype.hashNode = function(node){
	return node.name;
}


//sets the position of a node to x, y (given through pos)
Visualizer.prototype.setNodePosition = function (node, pos){
	
	this.nodePosMap[ this.hashNode(node) ] = pos;

}

Visualizer.prototype.getNodeAt = function(pos){
	var answerNode = undefined;
	var self = this;
	this.nfa.nodes.forEach( function(node) {
		var nodePos = self.nodePosMap[ self.hashNode(node) ];
		if (nodePos != undefined){
			var xd = pos.x - nodePos.x;
			xd *= xd;
			var yd = pos.y - nodePos.y;
			yd *= yd;
			var d = Math.sqrt(xd + yd);
			if (d < 15){
				answerNode = node;
			}
		}
	});
	return answerNode;
}

Visualizer.prototype.drawNfa = function(canvas){

	var self = this;

	this.nfa.nodes.forEach( function(node) {
		var nodePos = self.nodePosMap[ self.hashNode(node)];
		if (nodePos != undefined){

			var ctx = canvas.getContext('2d');
			
			var radius = 15;

			ctx.beginPath();
			ctx.arc(nodePos.x, nodePos.y, radius, 0, 2 *Math.PI, false);
			ctx.fillStyle = "green";
			ctx.fill();

			//alert(nodePos.x + " " + nodePos.y);
		}
	});

}
