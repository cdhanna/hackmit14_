//function traverse_now(test_string, nfa) {
//    this.activeStates = [];
//    for(var i = 0; i<nfa.nodes; i++){
//        if(nfa.nodes[i].starting == True) {
//            this.activeStates.push(nfa.nodes[i]);
//        }
//    }
//    
//    this.doneTraversing = false; 
//    this.newactivestates = []; 
//    this.test = test_string.split("");
//    this.tempPlace = 0;
//    this.basePlace = 0;
//    this.foundState = false; 
//    
//    for(var i = 0; i<this.test.length; i++) {
//        this.newactivestates = [];
//        for(var j = 0; j<this.activeStates.length; j++){
//            for(var k = 0; k<this.activeStates[j].nextEdges; k++){
//                if(this.activeStates[j].nextEdges[k].character == test[i]) {
//                    this.newactivestates.push(activeStates[j].nextEdges[k].next_node); 
//                    this.foundStates = true;
//                }
//                if(this.activeStates[j].nextEdges[k].character == "eps") {
//                    this.activeStates.push(this.activeStates[j].nextEdges[k].next_node); 
//                }
//            }
//        }
//        if(!this.foundStates) {
//            return;
//        }
//        if(i == this.test.length - 1) {
//            for(l = 0; l<this.newactivestates.length; l++){
//                if(this.newactivestates[l].final == true){
//                    this.doneTraversing = true; 
//                }
//            }
//        }
//        this.activeStates = this.newactivestates; 
//        this.foundStates = false; 
//    }
//    
//    if(this.doneTraversing){
//        return;
//    }
//}

function clearVisisted(nfa) {
    for(var i = 0; i<nfa.nodes.length; i++){
        nfa.nodes[i].visited = false;
    }   
}

function init(nfa) {
    var activeStates = [];
    for(var i = 0; i<nfa.nodes.length; i++){
        if(nfa.nodes[i].starting == true) {
            activeStates.push(nfa.nodes[i]);
        }
        nfa.nodes[i].visited = false;
    }   
    return activeStates; 
}

function traverse_now(c, activeStates) {
    var newActive = [];
    
    //var test = test_string.split("");

    for(var i = 0; i<activeStates.length; i++){
        newActive = newActive.concat(travel(c, activeStates[i]));     
    }
    
    return newActive;   
}

function travel(c, n) {
    var activelist = [];
    
        for(var i = 0; i<n.nextEdges.length; i++) {
            console.log(n.starting);
            if(n.nextEdges[i].character == "eps") {
                if(!n.nextEdges[i].next_node.visited) {
                     n.nextEdges[i].next_node.visited = true;
                     activelist = activelist.concat(travel(c, n.nextEdges[i].next_node));
                }
            }
            console.log("hi");
            if(n.nextEdges[i].character == c) {
                if(!n.nextEdges[i].next_node.visited) {
                    console.log('got ' + c);
                    n.nextEdges[i].next_node.visited = true; 
                    activelist = activelist.concat(n.nextEdges[i].next_node)
                }
            }
        }
        console.log('final ' + activelist);
        return activelist;

}


/*function traverse_one_char(char, activeStates){
    activestartstates = [];
    finalstates = [];
    //check for epsiolon transitions
    (j = 0; j<activeStates.length; j++){
        (k = 0; k<activeStates[j].nextEdges.length; k++){
            if(activeStates[j].nextEdges[k].character == "eps") {
                activeStates.push(activeStates[j].nextEdges[k].next_node);    
            }
        }
    }
    
    //find the next set of active states
    (j = 0; j<activeStates.length; j++){
        (k = 0; k<activeStates[j].nextEdges.length; k++){
            if(activeStates[j].nextEdges[k].character == test[i]) {
                newactivestates.push(activeStates[j].nextEdges[k].next_node); 
                
                //if newly added state is a final state, then add it to the final state list
                if(activeStates[j].nextEdges[k].next_node.final){
                    finalstates.push(newactivestates[l]);  
                    doneTraversing = True;
                }
                foundStates = True;
            }
        }
    }
    
    //if there are no states to add to new active state list
    if(!foundStates) {
        return {active: [], final []}; //will return empty lists 
    }
    
    return {active:newactivestates, final: finalStates};
}*/