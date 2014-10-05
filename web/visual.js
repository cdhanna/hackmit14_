//add option bubbles 
function Visualizer(nfa){

	this.nfa = nfa;
	this.nodePosMap = {};
	this.nodeHoverMap = {};
	this.edgeHoverMap = {};
	this.edgePosMap = {};
	this.nodeRadius = 25;
	this.arrowNode = undefined;
	this.arrowEnd = undefined;
	this.edgeEditing = undefined;
	this.options = [];
	this.activeNodes = [];

	this.options.push( new NodeOption("addpair", -3*Math.PI/2, Math.PI/8, 240, 248, 255));
	this.options.push( new NodeOption("removenode", -Math.PI/7, Math.PI/8, 249, 204, 204));
    this.options.push( new NodeOption("set_start", 10*Math.PI/8, Math.PI/8, 255, 252, 255)); 
    this.options.push( new NodeOption("set_final", 7*Math.PI/8, Math.PI/8, 233, 243, 233));
    
}

//node option -- option bubble
function NodeOption(name, theta, phi, r, b, g){
	this.name = name;
	this.theta = theta; //angle it sticks out of bubble at (center of bubble)
	this.phi = phi;		//theta size -- acceptance angle 
    this.red = r; 
    this.blue = b; 
    this.green = g;
}

Visualizer.prototype.setActiveNodes = function(activeNodes){
	this.activeNodes = activeNodes.slice();
}

//
Visualizer.prototype.hashNode = function(node){
	return node.id;
}
Visualizer.prototype.hashEdge = function(edge){
	return edge.prev_node.id + "_" + edge.next_node.id;
}


Visualizer.prototype.setEdgePosition = function(edge, pos){
	this.edgePosMap[ this.hashEdge(edge)] = pos;
}

Visualizer.prototype.getEdgePosition = function(edge){
	return this.edgePosMap[ this.hashEdge(edge)];
}

//sets the position of a node to x, y (given through pos)
Visualizer.prototype.setNodePosition = function (node, pos){
	this.nodePosMap[ this.hashNode(node) ] = pos;
}

Visualizer.prototype.getNodePosition = function (node){
	if (this.nodePosMap[this.hashNode(node)] == undefined)
		return {x:0, y: 0}
	return this.nodePosMap[this.hashNode(node)]
}

Visualizer.prototype.getEdgeAt = function(pos){
	var answerEdge = undefined;
	var self = this;
	this.nfa.nodes.forEach(function(node){

		node.nextEdges.forEach( function(edge){
			var edgePos = self.getEdgePosition(edge);
			if (edgePos != undefined){
				var xd = pos.x - edgePos.x;
				xd *= xd;
				var yd = pos.y - edgePos.y;
				yd *= yd;
				var d = Math.sqrt(xd + yd);
				if (d < self.nodeRadius*.8){
					answerEdge = edge;
				}


			}
		});

	});
	return answerEdge;

	
}

Visualizer.prototype.getOptionAt = function(node, pos){

	var nodePos = this.nodePosMap[this.hashNode(node)]

	var selectedOption = undefined;

	if (nodePos != undefined){

		var angle = Math.atan2(pos.y - nodePos.y, pos.x - nodePos.x);
		var self = this;
		this.options.forEach(function(option){

			if ( (option.theta > 0 && angle > 0) || (option.theta < 0 && angle < 0)){
				diff = Math.abs(option.theta - angle);
			} else {

				diff = Math.abs(option.theta - angle);
				if (diff > Math.PI){
					diff = (Math.PI*2) - diff;

				}
			}
			
			var dx = pos.x - nodePos.x;
			var dy = pos.y - nodePos.y;
			var dist = Math.sqrt(dx*dx + dy*dy)

			if (diff < option.phi && dist > self.nodeRadius*.8){
				selectedOption = option;
			}
		});

		return selectedOption;

	}

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
			if (d < self.nodeRadius){
				answerNode = node;
			}

			if (self.getNodeHover(node) > .5){

				if (d < self.nodeRadius*1.5){
					answerNode = node;
				}

			}


		}
	});
	return answerNode;
}

Visualizer.prototype.noNodesHovering = function(){
	var self = this;
	this.nfa.nodes.forEach( function(node) {
		 if (self.nodeHoverMap[self.hashNode(node)] == undefined){
			self.nodeHoverMap[ self.hashNode(node) ] = 0;
		 } else {
		 	self.setNodeHover( node, self.getNodeHover(node)*.9);
		 }
	});
}

Visualizer.prototype.noEdgesHovering = function(){
	var self = this;
	this.nfa.nodes.forEach( function(node){
		node.nextEdges.forEach( function(edge){
			if (self.edgeHoverMap[self.hashEdge(edge)] == undefined){
				self.edgeHoverMap[self.hashEdge(edge)] = 0;
			} else {
				self.setEdgeHover(edge, self.getEdgeHover(edge)*.9);
			}
		});
	});
}

Visualizer.prototype.generatePositions = function(){

	var self = this;
	this.nfa.nodes.forEach( function(node) {
		self.setNodePosition(node, {x:300 + Math.random()*30, y:300+ Math.random()*30});
	});

	for (var i = 0 ; i < 2000 ; i ++){

		this.nfa.nodes.forEach( function(node) {
			
			var nodePos = self.getNodePosition(node);
			var fx = 0;
			var fy = 0;
			var k = .1;
			var s = 300;
			var goodX = 100;
			node.nextEdges.forEach( function(other) {
				var otherPos = self.getNodePosition(other.next_node);		
				var dx = nodePos.x - otherPos.x;
				var dy = nodePos.y - otherPos.y;
				var dist = Math.sqrt(dx * dx + dy * dy);
				var force = goodX - dist;
				fx += k * (force * dx / dist);
				fy += k * (force * dy / dist);
			});
			node.prevEdges.forEach( function(other) {
				var otherPos = self.getNodePosition(other.prev_node);		
				var dx = nodePos.x - otherPos.x;
				var dy = nodePos.y - otherPos.y;
				var dist = Math.sqrt(dx * dx + dy * dy);
				var force = goodX - dist;
				fx += k * (force * dx / dist);
				fy += k * (force * dy / dist);
			});
			self.nfa.nodes.forEach( function(other) {
				if(other != node) {
					var otherPos = self.getNodePosition(other);		
					var dx = nodePos.x - otherPos.x;
					var dy = nodePos.y - otherPos.y;
					var dist = dx * dx + dy * dy;
					fx += s * (dx / dist);
					fy += s * (dy / dist);
				}
			});


			self.setNodePosition(node, {x:nodePos.x + fx, y:nodePos.y + fy});
		});



	}


}

Visualizer.prototype.setNodeHover = function(node, value){
	this.nodeHoverMap[ this.hashNode(node) ] = value;
}

Visualizer.prototype.getNodeHover = function(node){
	if (this.nodeHoverMap[this.hashNode(node)] != undefined){
		return this.nodeHoverMap[this.hashNode(node)];
	} else return undefined;
}

Visualizer.prototype.setEdgeHover = function(edge, value){
	this.edgeHoverMap[ this.hashEdge(edge)]=value;
}
Visualizer.prototype.getEdgeHover = function(edge){
	if (this.edgeHoverMap[this.hashEdge(edge)] != undefined){
		return this.edgeHoverMap[this.hashEdge(edge)];
	} else return undefined;
}

Visualizer.prototype.setEdgeArrow = function(node, pos){

	this.arrowNode = node;
	this.arrowEnd = pos;

}

Visualizer.prototype.drawNfa = function(canvas, scale, offset){

	var self = this;
	var ctx = canvas.getContext('2d');
	ctx.translate(offset.x, offset.y);
	ctx.scale(scale.x, scale.y);

	this.nfa.nodes.forEach( function(node) {
		var nodePos = self.nodePosMap[ self.hashNode(node)];
		if (nodePos != undefined){

			
			var red = 255-Math.round(128*self.getNodeHover(node));
			var green = 255-Math.round(128*self.getNodeHover(node));
			var blue = 255;//-Math.round(128*self.getNodeHover(node));

			self.options.forEach(function(option){

				ctx.beginPath();
				var optX = Math.cos(option.theta) * self.nodeRadius;
				var optY = Math.sin(option.theta) * self.nodeRadius;
				ctx.arc(nodePos.x + optX, nodePos.y + optY, self.nodeRadius * self.getNodeHover(node)*.5, 0, 2 *Math.PI, false);
				ctx.fillStyle = "black";
				ctx.fill();
				ctx.beginPath();
				ctx.fillStyle = "rgba(" + option.red + "," + option.green + "," + option.blue+", 1)";
				ctx.arc(nodePos.x + optX, nodePos.y + optY, (self.nodeRadius * self.getNodeHover(node)*.5)*.9, 0, 2 *Math.PI, false);
				ctx.fill();

			});


			ctx.beginPath();
			ctx.arc(nodePos.x, nodePos.y, self.nodeRadius, 0, 2 *Math.PI, false);
			ctx.fillStyle = "black";
			ctx.fill();
			
			if (self.activeNodes.indexOf(node) > -1){
				red=255;
			}
			ctx.beginPath();
			ctx.arc(nodePos.x, nodePos.y, self.nodeRadius-3, 0, 2 *Math.PI, false);
			ctx.fillStyle = "rgba(" + red + "," +green + "," + blue+", 1)";
			ctx.fill();

			if (node.final == true){

				ctx.beginPath();
				ctx.arc(nodePos.x, nodePos.y, self.nodeRadius*.7, 0, 2*Math.PI, false);
				ctx.strokeStyle = "green";
				ctx.stroke();
			}

			if (node.starting == true){

				ctx.beginPath();
				ctx.arc(nodePos.x, nodePos.y, self.nodeRadius*.5, 0, 2*Math.PI, false);
				ctx.strokeStyle = "red";
				ctx.stroke();
			}

		}
	});

	this.nfa.nodes.forEach( function(node){
		var nodePos = self.nodePosMap[ self.hashNode(node)];
		if (nodePos != undefined){
			node.nextEdges.forEach( function (edge){

				if (edge.next_node != undefined){

					var nextPos = self.getNodePosition(edge.next_node);


					var dx = nextPos.x - nodePos.x;
					var dy = nextPos.y - nodePos.y;
					var angle = Math.atan2(dy, dx);

					var rx = (self.nodeRadius+5)*Math.cos(angle);
					var ry = (self.nodeRadius+5)*Math.sin(angle);
					var rx2 = (self.nodeRadius)*Math.cos(angle);
					var ry2 = (self.nodeRadius)*Math.sin(angle);
					var arrowX = Math.sin(angle) * 5;
					var arrowY = -Math.cos(angle) * 5;
				
					ctx.beginPath();
					ctx.moveTo(nodePos.x + rx, nodePos.y + ry);
					
					var bx0 = 0;
					var bx1 = 0;
					var by0 = 0;
					var by1 = 0;

					if (edge.next_node == edge.prev_node){
						bx0 = 80
						bx1 = -80;
						by0 = 80;
						by1 = 80;

					}

					ctx.bezierCurveTo(nodePos.x + bx0, nodePos.y + by0, nextPos.x+bx1, nextPos.y+by1, nextPos.x - rx, nextPos.y - ry);
					
					ctx.strokeStyle = '#272822';
					ctx.stroke();
					ctx.beginPath();
					ctx.moveTo(nextPos.x -rx2, nextPos.y -ry2);
					ctx.lineTo((nextPos.x - rx) + arrowX, (nextPos.y - ry) + arrowY);
					ctx.lineTo((nextPos.x - rx) - arrowX, (nextPos.y - ry) - arrowY);
					ctx.closePath();
					ctx.stroke();
					ctx.fillStyle = 'black';
					ctx.fill();
					 


					var red = 64-Math.round(32*self.getEdgeHover(edge));
					var green = 64-Math.round(32*self.getEdgeHover(edge));
					var blue = 64+Math.round(140*self.getEdgeHover(edge));

					if (self.edgeEditing != undefined && self.edgeEditing == edge){
						red = 255;
					}

					ctx.font='20px Verdana';
					var tx = nodePos.x + (3*self.nodeRadius)*Math.cos(angle);
					var ty = nodePos.y + (3*self.nodeRadius)*Math.sin(angle);
					tx += (1*self.nodeRadius)*Math.sin(angle);
					ty -= (1*self.nodeRadius)*Math.cos(angle);
					ctx.fillStyle = "rgba(" + red + "," +green + "," + blue+", 1)";
                    ctx.font = "13pt sans-serif";
					ctx.fillText(edge.character, tx, ty)
					self.setEdgePosition(edge, {x:tx, y:ty});

				}
			});
		}
	});


	if (this.arrowNode != undefined){
	
		var nodePos = this.getNodePosition(this.arrowNode);
		ctx.beginPath();
		ctx.moveTo(nodePos.x, nodePos.y);
		ctx.lineTo(this.arrowEnd.x, this.arrowEnd.y);
		ctx.strokeStyle = '#542C52';
		ctx.stroke();
	}
	


}
