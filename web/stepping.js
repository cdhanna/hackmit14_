function traverse_now(test_string, nfa) {
    activeStates = [];
    for(i = 0; i<nfa.nodes; i++){
        if(nfa.nodes[i].starting == True) {
            activeStates.push(nfa.nodes[i]);
        }
    }
    
    doneTraversing = False; 
    newactivestates = []; 
    test = test_string.split("");
    tempPlace = 0;
    basePlace = 0;
    foundState = False; 
    
    for(i = 0; i<test.length; i++) {
        (j = 0; j<activeStates.length; j++){
            (k = 0; k<activeStates[j].nextEdges; k++){
                if(activeStates[j].nextEdges[k].character == test[i]) {
                    newactivestates.push(activeStates[j].nextEdges[k].next_node); 
                    foundStates = True;
                }
                if(activeStates[j].nextEdges[k].character == "eps") {
                    activeStates.push(activeStates[j].nextEdges[k].next_node); 
                }
            }
        }
        if(!foundStates) {
            //not valid string -- do whatever visual output to tell user this!   
        }
        if(i == test.length - 1) {
            for(l = 0; l<newactivestates.length; l++){
                if(newactivestates[l].final == True){
                    doneTraversing = True; 
                }
            }
        }
        activeStates = newactivestates; 
        newactivestates = [];
        foundStates = False; 
    }
    
    if(doneTraversing){
        //valid string -- do whatever visual output ot tell user this!   
    }
}

function traverse_one_char(char, activeStates){
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
}