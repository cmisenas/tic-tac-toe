;(function(){
	var socket;

	//network stuff
	function init(){
		socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
	}

	init();
	
	//ui stuff
	function Board(){
		var boardTiles = {};
		var draw = function(){
			var table = document.createElement('table');
			var tableObj = {rows: 3, cols: 3};
			var currId = 1;

			for(var i = 0, rows = tableObj.rows; i < rows; i++){
				var tableRow = document.createElement('tr');			

				for(var j = 0, cols = tableObj.cols; j < cols; j++, currId++){
					var tableCol = document.createElement('td');	
					tableCol.id = currId;
	
					tableCol.onclick = function(){
						move(this);
					}		
	
					tableRow.appendChild(tableCol);
				
					boardTiles[currId] = '';
				}
	
				table.appendChild(tableRow);
			}
			document.body.appendChild(table);
		}
		
		var empty = function(){
			for(tiles in boardTiles){
				boardTiles[tiles] = '';
			}
			var tableTiles = document.getElementsByTagName('td');
			for(var i = 0, maxTiles = tableTiles.length; i < maxTiles; i++){
				tableTiles[i].innerHTML = '';
				tableTiles[i].style.background = '#fff';
				tableTiles[i].style.color = '#000';
			}
			currPlayer = 1;
		}

		return {
			tiles: boardTiles,
			draw: draw,
			empty: empty
		}
	}

	function miniMax(){
		
	}

	var board = new Board();
	board.draw();

	//game logic, controls functions and stuff
	var players = {1: 'X', 2:'O'};
	var currPlayer = 1;
	var winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];

	function move(tile){		
		if(tile.innerHTML === ''){
			tile.innerHTML = players[currPlayer];
			board.tiles[tile.id] = currPlayer;
			var isThereWinner = checkForWinner(currPlayer);
			if(isThereWinner === false){
				currPlayer = (currPlayer === 1)?2:1;
			}else{
				for(var i = 0; i < 3; i++){
					document.getElementById(isThereWinner[i]).style.background = '#f00';
					document.getElementById(isThereWinner[i]).style.color = '#fff';
				}
				var newGame = confirm('Player ' + currPlayer + ' won!\nStart a new Game?');
				if(newGame)
					board.empty();	
			}
		}
	}

	function checkForWinner(player){
		var playerTiles = getPlayerTiles(player);
		//check if current player's tiles matches winning combinations
		var isWinningTiles = tileIntersect(playerTiles);
		if(isWinningTiles)
			return isWinningTiles;	
		return false;
	}
	
	function getPlayerTiles(playerId){
		var playerTiles = [];
		for(tileId in board.tiles){
			if(board.tiles[tileId] === playerId){
				playerTiles.push(tileId);
			}
		}
		return playerTiles;
	}

	//AI stuff


	//helper functions
	function arrayIntersect(arrA, arrB){
		var arrIntersect = [];
		
		for(var i = 0, maxA = arrA.length; i < maxA; i++){
			for(var j = 0, maxB = arrB.length; j < maxB; j++){
				if(parseInt(arrA[i]) === parseInt(arrB[j]))
					arrIntersect.push(arrB[j]);
			}
		}
		return arrIntersect.length === 0? false: arrIntersect;
	}

	function tileIntersect(playerTiles){
		for(var i = 0, maxCombi = winningCombinations.length; i < maxCombi; i++){
			var tileResult = arrayIntersect(playerTiles, winningCombinations[i]);
			if(tileResult !== false && tileResult.length === 3)
				return tileResult;
		}

		return false;
	}
}());
