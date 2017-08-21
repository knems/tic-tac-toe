"use strict"

var loadScreen =(function(){

	let $start = $('#start');
	let $finish = $('#finish');
	let $board = $('#board');
	let $button = $start.find('#startButton');
	let $playerNames = $start.find('.playerNames');
	let $api = $start.find('#api');
	let $startButton = $start.find('#startButton');
	let $hidePlayerTwo = $playerNames.children().eq(1);

	$startButton.hide();
	$playerNames.hide();
	$board.hide();
	$finish.hide();

	$api.find('a').on('click', apiPlaying);
	$button.on('click', startGame);

	function apiPlaying(event){
		if(event.target.innerHTML == 'Yes'){
			$api.hide();
			$startButton.show();
			$playerNames.show();
			$hidePlayerTwo.hide();
			events.emit('apiIsPlaying');
		}else if (event.target.innerHTML == 'No') {
			$api.hide();
			$startButton.show();
			$playerNames.show();}}

	function startGame(){
		var player1Name = document.getElementsByTagName('input')[0].value || 'Player 1';
		var player2Name = document.getElementsByTagName('input')[1].value || 'Player 2';
		events.emit('setPlayersName', [player1Name, player2Name]);
		$('#player1').addClass('active');
		$start.hide();
		$board.show();}}
)();

var runGame = (() => {
	let player1 = {
		is: 'Player1',
		class: 'box-filled-1',
		svg: 'url(img/o.svg)',
		winClass: 'screen-win-one',
		playerName: ''}
	let player2 = {
		is: 'Player2',
		class: 'box-filled-2',
		svg: 'url(img/x.svg)',
		winClass: 'screen-win-two',
		playerName: ''}

	// cache dom
	let $finish = $('#finish')
	let $message = $finish.find('.message');
	let $newGameButton = $finish.find('.button');
	let $board = $('#board');
	let $gameBoard = $board.find('.boxes');
	let $gameBoxes = $gameBoard.find('.box');
	let $boardChildren = $gameBoard.children();

	let movesMade = 0;
	let currentPlayer = player1;
	let apiEnabled = false;

	// bound events
	$gameBoxes.hover(playerCanMakeMove, playerDidnNotMakeMove);
	$gameBoxes.on('click', playerMakesAMove);
	$newGameButton.on('click', startNewGame);

	events.on('setPlayersName', setPlayersName);
	events.on('apiIsPlaying', enableApi);

	function enableApi(){
		apiEnabled = true;
		player2.playerName = 'API';
	}

	// event handlers
	function boxHasNotBeenTaken(box){
	  return (!$(box).hasClass('box-filled-1') && !$(box).hasClass('box-filled-2'));}

	function playerCanMakeMove (event) {
		if(boxHasNotBeenTaken(event.target)){
			event.target.style.backgroundImage = currentPlayer.svg;}}

	function playerDidnNotMakeMove (event) {
		if(boxHasNotBeenTaken(event.target)){
			event.target.style.backgroundImage = '';}}

	function playerMakesAMove(event){
		if(boxHasNotBeenTaken(event.target)){
			$(event.target).addClass(currentPlayer.class);
			movesMade++;
			isGameOver();
		}else{//player tries making a move on a take box
			alert('Square is taken punk');}}

	function apiMakesMove(){
		var randomNumber = Math.floor((Math.random() * 9));
		while(true){
			if(boxHasNotBeenTaken($boardChildren.eq(randomNumber))){
				break;}
			else{
				randomNumber = Math.floor((Math.random() * 9));}}
		$boardChildren.eq(randomNumber).addClass(player2.class);
		if(didPlayerWin(currentPlayer)){
			gameOver(currentPlayer.winClass, (currentPlayer.playerName + ' Wins'));
		}else if(isGameTied()){
			gameOver('screen-win-tie', 'Tie');
		}else{
			movesMade++;
			changePlayer()}}

	function changePlayer(){
		currentPlayer = returnOppositePlayer();
		events.emit('updatePlayerBoard', currentPlayer);}

	var returnOppositePlayer = function(){
		if (currentPlayer == player1) {
			return player2;
		}else if (currentPlayer == player2) {
			return player1;}}

	function setPlayersName(playerNames){
		player1.playerName = playerNames[0];
		player2.playerName = playerNames[1];
		$('#player1 div:first-child').html(player1.playerName);
		$('#player2 div:first-child').html(player2.playerName);}

	function isGameOver(){
		if(didPlayerWin(currentPlayer)){
			gameOver(currentPlayer.winClass, (currentPlayer.playerName + ' Wins'));
		}else if(isGameTied()){
			gameOver('screen-win-tie', 'Tie');
		}else{
			changePlayer();
			apiEnabled ? apiMakesMove() : false;}}

	function didPlayerWin(player){
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

	function isGameTied(){
		return (movesMade > 8);}

	function gameOver(classToAdd, msg){
		$board.hide();
		$finish.show();
		$finish.addClass(classToAdd);
		$message.html('' + msg +'!');}

	function startNewGame(){
		movesMade = 0;
		currentPlayer = player1;
		$('#player1').addClass('active');
		$('#player2').removeClass('active');
		for(let i = 0; i < $boardChildren.length; i++){
			$boardChildren.eq(i).attr('class', 'box');
			$boardChildren.eq(i).css('backgroundImage', '');}
		$board.show();
		$finish.hide();
		$finish.attr('class', 'screen screen-win');}
})();
