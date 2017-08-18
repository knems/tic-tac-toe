"use strict"

let board = (() => {
	let $board = $('#board');
	let $player1 = $board.find('#player1');
	let $player2 = $board.find('#player2');
	
	events.on('updatePlayerBoard', updatePlayerBoard);

	function updatePlayerBoard(player){
		if(player.is == 'Player1'){
			$player1.addClass('active');
			$player2.removeClass('active');
		}else if(player.is == 'Player2'){
			$player1.removeClass('active');
			$player2.addClass('active');}}
})();
