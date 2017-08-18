"use strict"

var loadScreen =(function(){

	var $start = $('#start');
	var $finish = $('#finish');
	var $board = $('#board');
	var $button = $start.find('a');
	$board.hide();
	$finish.hide();
	$button.on('click', startGame);

	function startGame () {
		$('#player1').addClass('active');
		$start.hide();
		$board.show();
	}
})();

let runGame = (() => {
	let player1 = {
		is: 'Player1',
		class: 'box-filled-1',
		svg: 'url(img/o.svg)',
		winClass: 'screen-win-one',
		playerName: ''
	}
	let player2 = {
		is: 'Player2',
		class: 'box-filled-2',
		svg: 'url(img/x.svg)',
		winClass: 'screen-win-two',
		playerName: ''
	}

	let $finish = $('#finish')
	let $message = $finish.find('.message');
	let $newGameButton = $finish.find('.button');
	// cache dom
	let $board = $('#board');
	let $gameBoard = $board.find('.boxes');
	let $gameBoxes = $gameBoard.find('.box');
	let $boardChildren = $gameBoard.children();

	let movesMade = 0;
	let currentPlayer = player1;
	// bound events
	$gameBoxes.hover(playerCanMakeMove, playerDidnNotMakeMove);
	$gameBoxes.on('click', playerMakesAMove);
	$newGameButton.on('click', startNewGame);

	// event handlers
	function boxHasNotBeenTaken(event){
	  return (!$(event.target).hasClass('box-filled-1') && !$(event.target).hasClass('box-filled-2'));}

	function playerCanMakeMove (event) {
		if(boxHasNotBeenTaken(event)){
			event.target.style.backgroundImage = currentPlayer.svg;}}

	function playerDidnNotMakeMove (event) {
		if(boxHasNotBeenTaken(event)){
			event.target.style.backgroundImage = '';}}

	function playerMakesAMove(event){
		if(boxHasNotBeenTaken(event)){
			$(event.target).addClass(currentPlayer.class);
			movesMade++;
			if(isGameOver(currentPlayer)){
				gameOver(currentPlayer.winClass, 'Winner');
			}else if(checkTie()){
				gameOver('screen-win-tie', 'Tie');
			}else{//no tie, no winner, game moves on
				currentPlayer = returnOppositePlayer();
				events.emit('updatePlayerBoard', currentPlayer);}
		}else{//player tries making a move on a take box
			alert('Square is taken punk');}}

	function returnOppositePlayer(){
		if (currentPlayer == player1) {
			return currentPlayer = player2;
		}else if (currentPlayer == player2) {
			return currentPlayer = player1;}}

	function isGameOver(player){
		let playerClass = player.class;
		let result = false;
		let check = [
			//horizontal indexs
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			//vertical indexs
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			//diaginal indexs
			[0, 4, 8],
			[2, 4, 6]
		];
		for (let index of check) {
		  if($boardChildren.eq(index[0]).hasClass(playerClass) && $boardChildren.eq(index[1]).hasClass(playerClass) && $boardChildren.eq(index[2]).hasClass(playerClass)){
				result = true;
		    break;}}
		return result;}

	function checkTie(){
		return (movesMade > 8)}

	function gameOver(classToAdd, msg){
		$board.hide();
		$finish.show();
		$finish.addClass(classToAdd);
		$message.html('' + msg +'!');
	}

	function startNewGame(){
		movesMade = 0;
		currentPlayer = player1;
		$('#player1').addClass('active');
		$('#player2').removeClass('active');
		for(let i = 0; i < $boardChildren.length; i++){
			$boardChildren.eq(i).attr('class', 'box');
			$boardChildren.eq(i).css('backgroundImage', '');
		}
		$board.show();
		$finish.hide();
		$finish.attr('class', 'screen screen-win');
	}
})();
