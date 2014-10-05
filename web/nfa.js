//An NFA is a non-deterministic autamaton (sp)
function NFA() {
    this.nodes = [];
    this.active = [];
}

NFA.prototype.add_node = function(node) {
    this.nodes.push(node);
}

NFA.prototype.remove_node = function(node) {
    var i = nodes.indexOf(node);
    if(i >= 0) {
        nodes.splice(i, 1);
        
        for(var i = 0; i < node.prevEdges.length; i++) {
        //find each pair in list of nextPairs in the node that points to deleted node. Delete the pairs. 
        //find each pair in list of prevPairs in the node that deleted node points to. Delete the pairs.
        }
    }
}

//A node is a state inside an NFA. A node has edges connecting it to other nodes (states)
function Node(name) {
    this.starting = false;
    this.name = name;
    this.nextEdges = [];
    this.prevEdges = []; 
    
    //each node also has a name :)
    //node contains a list of pairs, each pair in form <character in alphabet, node it points to>
}

Node.prototype.add_next_edge = function(edge) {
    
    // //add next edge to current node
    // nextEdges.push(edge);
    // //add prev edge to next node
    // pair.next_node.prevEdges.push(new Pair(pair.character, this.nameo)e_next_edge = function(edge) {
    // var i = nextEdges.indexOf(edge);
    // if(i >= 0) nextEdges.splice(i, 1);
    
    // var j = edge.next_node.nextEdges.indexOf(edge);
    // if(j >= 0) edge.next_node.nextEdges.splice(j, 1);
}

//edge between nodes. The to_node will be reached on the character
function Edge(prev_node, character, next_node) {
    this.prev_node = prev_node;
    this.character = character; 
    this.next_node = next_node; 
}