function Visualizer(nfa){

	this.nfa = nfa;
	this.nodePosMap = {};
	this.nodeHoverMap = {};
	this.nodeRadius = 25;

	this.options = [];


	this.options.push( new NodeOption("addpair", -Math.PI/7, Math.PI/8));

}

function NodeOption(name, theta, phi){
	this.name = name;
	this.theta = theta; //angle
	this.phi = phi;		//theta size
}

Visualizer.prototype.hashNode = function(node){
	return node.name;
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

Visualizer.prototype.generatePositions = function(){

	var self = this;
	this.nfa.nodes.forEach( function(node) {
		self.setNodePosition(node, {x:300 + Math.random()*30, y:300+ Math.random()*30});
	});

	for (var i = 0 ; i < 1 ; i ++){

		this.nfa.nodes.forEach( function(node) {
			
			var nodePos = self.getNodePosition(node);
			var fx = 0;
			var fy = 0;
			var k = .001;
			var goodX = 100;
			self.nfa.nodes.forEach( function(other) {
				if(other != node) {
					var otherPos = self.getNodePosition(other);		
					var dx = nodePos.x - otherPos.x;
					var dy = nodePos.y - otherPos.y;
					var dist = Math.sqrt(dx * dx + dy * dy);
					var force = goodX - dist;
					fx += k * (force * dx / dist);
					fy += k * (force * dy / dist);
					console.log(dx+","+dy+","+dist+","+force);
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

Visualizer.prototype.drawNfa = function(canvas){

	var self = this;

	this.nfa.nodes.forEach( function(node) {
		var nodePos = self.nodePosMap[ self.hashNode(node)];
		if (nodePos != undefined){

			var ctx = canvas.getContext('2d');
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
				ctx.fillStyle = "rgba(" + red + "," +green + "," + blue+", 1)";
				ctx.arc(nodePos.x + optX, nodePos.y + optY, (self.nodeRadius * self.getNodeHover(node)*.5)*.9, 0, 2 *Math.PI, false);
				ctx.fill();

			});


			ctx.beginPath();
			ctx.arc(nodePos.x, nodePos.y, self.nodeRadius, 0, 2 *Math.PI, false);
			ctx.fillStyle = "black";
			ctx.fill();
			ctx.beginPath();
			ctx.arc(nodePos.x, nodePos.y, self.nodeRadius-3, 0, 2 *Math.PI, false);
			
			ctx.fillStyle = "rgba(" + red + "," +green + "," + blue+", 1)";

			//ctx.fillStyle = "white";
			ctx.fill();
			//alert(nodePos.x + " " + nodePos.y);

			
		}
	});

}
