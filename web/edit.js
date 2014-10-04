//edit.js

function Editor(){



}

//called when a mousedown event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseDown = function (pos){
	console.log('mouse down' + pos);

}

//called when a mouseup event is fired on the html canvas
//pos = x:?, y:?
Editor.prototype.onMouseUp = function (pos){
	console.log('mouse up' + pos);

}


