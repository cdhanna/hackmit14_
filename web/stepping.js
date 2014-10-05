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