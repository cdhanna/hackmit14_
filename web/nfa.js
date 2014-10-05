//An NFA is a non-deterministic autamaton (sp)
function NFA() {
    this.nodes = [];
    this.active = [];
}

NFA.prototype.add_node = function(node) {
    this.nodes.push(node);
}

NFA.prototype.remove_node = function(node) {
    var i = this.nodes.indexOf(node);
    if(i >= 0) {        
        for(var k = 0; k < node.prevEdges.length; k++) {
            node.remove_edge(node.prevEdges[k]);
        }
        for(var j = 0; j < node.nextEdges.length; j++) {
            node.remove_edge(node.nextEdges[j]); 
        }
        this.nodes.splice(i,1); 
    }
}

NFA.prototype.make_starting_node = function(node) {
    node.starting = True; 
}

//A node is a state inside an NFA. A node has edges connecting it to other nodes (states)
function Node(name) {
    this.id = Node.id;
    Node.id += 1;
    this.starting = false;
    this.final = false; 
    this.name = name;
    this.nextEdges = [];
    this.prevEdges = []; 
}

Node.id = 0;

Node.prototype.add_next_edge = function(edge) {
    //add next edge to current node
    this.nextEdges.push(edge);
    //add prev edge to next node
    edge.next_node.prevEdges.push(edge)
}

Node.prototype.remove_edge = function(edge) {   
    //remove nextedge
    var i = this.nextEdges.indexOf(edge);
    if(i >= 0) this.nextEdges.splice(i, 1);
    
    var j = edge.prev_node.nextEdges.indexOf(edge);
    if(j >= 0) edge.prev_node.nextEdges.splice(j, 1);
}

//edge between nodes. The to_node will be reached on the character
function Edge(prev_node, character, next_node) {
    this.prev_node = prev_node;
    this.character = character; 
    this.next_node = next_node; 
}


/*
 * Regex parser
 */
function RegexParser(i) {
    this.inp = i;
}

RegexParser.prototype.peek = function() {
    return this.inp.charAt(0);
};

RegexParser.prototype.eat = function(c) {
    if(this.peek() == c) {
        this.inp = this.inp.substring(1);
    }
    else throw (this.peek() + "did not equal" + c);
};

RegexParser.prototype.next = function() {
    var c = this.peek();
    this.eat(c);
    return c;
};

RegexParser.prototype.more = function() {
    return this.inp.length > 0;
}

RegexParser.prototype.regex = function() {
    var term = this.term();

    if (this.more() && this.peek() == '|') {
      this.eat('|');
      var regex = this.regex();
      return new Choice(term,regex);
    }
    return term;
};

RegexParser.prototype.term = function() {
    var f = null;
    while (this.more() && this.peek() != ')' && this.peek() != '|') {
      var nextFactor = this.factor();
      if(f == null) f = nextFactor;
      else f = new Sequence(f,nextFactor);
    }

    return f;
};

RegexParser.prototype.factor = function() {
    var base = this.base();
    
    while (this.more() && this.peek() == '*') {
      this.eat('*');
      base = new Repetition(base);
    }

    return base;
};

RegexParser.prototype.base = function() {
    var p = this.peek();

    if(p == '(') {
        this.eat('(');
        var r = this.regex();  
        this.eat(')');
        return r;
    }
    return new Primitive(this.next()) ;
};


function Choice(thisOne, thatOne) {
    this.rtype = 'c';

    this.thisOne = thisOne;
    this.thatOne = thatOne;
}

function Sequence(first, second) {
    this.rtype = 's';

    this.first = first;
    this.second = second;
}

function Repetition(internal) {
    this.rtype = 'r';

    this.internal = internal;
}

function Primitive(c) {
    this.rtype = 'p';

    this.c = c;
}

/*
 * Regex to NFA graph
 */
 function RegexGrapher(regex, nfa) {
    this.nfa = nfa;
    var p = regex.rtype;

    if(p == 'p') {      // Primitive
        this.start = new Node("");
        this.end = new Node("");
        nfa.add_node(this.start);
        nfa.add_node(this.end);
        this.start.add_next_edge(new Edge(this.start, regex.c, this.end));
    }
    else if(p == 's') { // Sequence
        var first = new RegexGrapher(regex.first, nfa);
        var second = new RegexGrapher(regex.second, nfa);
        this.start = first.start;
        this.end = second.end;
        var edgesToUpdate = second.start.nextEdges;
        for (var i = edgesToUpdate.length - 1; i >= 0; i--) {
            // Update outgoing edges to start at first.end
            edgesToUpdate[i].prev_node = first.end;
        };
        // Replace outgoing edges at first.end
        // (There should be none to begin with)
        first.end.nextEdges = edgesToUpdate;
        // Remove the extra node from the graph
        nfa.nodes.splice(nfa.nodes.indexOf(second.start), 1);
    }
    else if(p == 'c') { // Choice
        var thisOne = new RegexGrapher(regex.thisOne, nfa);
        var thatOne = new RegexGrapher(regex.thatOne, nfa);
        this.start = new Node("");
        this.end = new Node("");
        nfa.add_node(this.start);
        nfa.add_node(this.end);
        this.start.add_next_edge(new Edge(this.start, "eps", thisOne.start));
        this.start.add_next_edge(new Edge(this.start, "eps", thatOne.start));
        thisOne.end.add_next_edge(new Edge(thisOne.end, "eps", this.end));
        thatOne.end.add_next_edge(new Edge(thatOne.end, "eps", this.end));
    }
    else if(p == 'r') {             // Repetition
        var internal = new RegexGrapher(regex.internal, nfa);
        this.start = new Node("");
        this.end = new Node("");
        nfa.add_node(this.start);
        nfa.add_node(this.end);
        this.start.add_next_edge(new Edge(this.start, "eps", internal.start));
        this.start.add_next_edge(new Edge(this.start, "eps", this.end));
        internal.end.add_next_edge(new Edge(internal.end, "eps", internal.start));
        internal.end.add_next_edge(new Edge(internal.end, "eps", this.end));
    }
    else throw "Regex type not found";
}

RegexGrapher.prototype.toGraph = function() {
    this.start.starting = true;
    this.start.name = "Start";
    this.end.name = "End";
    this.end.final = true;
    return this.nfa;
};