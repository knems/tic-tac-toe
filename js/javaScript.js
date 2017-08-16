"use strict"

var loadScreen =(function(){

	let canvas = document.getElementById('gameStart');
	let context = canvas.getContext('2d');
	let body = document.getElementsByTagName('body')[0];

	canvas.width  = $(window).width();
	canvas.height = $(window).height()*2;

	context.font = "50px Impact";
	context.fillStyle = "white";
	context.textAlign = "center";
	context.fillText("TIC TAC TOE", canvas.width/2, canvas.height/4);

	context.font = "20px Arial";
	context.fillText("Press Enter To Start", canvas.width/2, canvas.height/4 + 50);

	body.addEventListener("keydown", readyToPlay);

	function readyToPlay(event){
		(event.keyCode == 13) ? clearCanvas() : null;
	}

	function clearCanvas(){
		canvas.width  = 0;
		canvas.height = 0;
		context.clearRect(0, 0, canvas.width, canvas.height);
		startGame();
	}
})();

var startGame =(() => {

});

//
//
// function startGame(){
// 	gameStarted = true;
// 	clearCanvas();
//
// 	setInterval(function(){
// 		clearCanvas();
// 		loop();
// 	}, 1000/30)
// }
//
// function loop(){
// 	console.log('game running');
// }
//
//
//
// 	//cache dom
//
// 	//bind events
//
// 	//events
