;(function(){
	var socket;

	//network stuff
	function init(){
		socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
	}

	init();
	
	//ui stuff
	function Board(){
		this.cells = [];
		this.currentDepth = 0;
		this.currPlayer = 1;//player 1 is always human, player 2 is always AI

		this.draw = function(){
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
					this.cells[currId] = '';
				}

				table.appendChild(tableRow);
			}
			document.body.appendChild(table);
		}
		
		this.empty = function(){
			for(var i = 0, maxCells = this.cells.length; i < maxCells; i++){
				this.cells[i] = '';
			}

			var tableCells = document.getElementsByTagName('td');
			for(var i = 0, maxTableCells = tableCells.length; i < maxTableCells; i++){
				tableCells[i].innerHTML = '';
				tableCells[i].style.background = '#fff';
				tableCells[i].style.color = '#000';
			}
			this.currPlayer = 1;
			this.currentDepth = 0;
		}	

		this.checkWin = function(){
		}

		this.evaluate = function(){
		}
	}

	var board = new Board();
	board.draw();

	//game logic, controls functions and stuff
	var players = {1: 'X', 2:'O'};
	var winningCombinations = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
	var endDepth = 9;

	function move(cell){
		console.log(cell);
		if(cell.innerHTML === ''){
			cell.innerHTML = players[board.currPlayer];
			board.cells[cell.id] = board.currPlayer;
			var isThereWinner = checkForWinner(board.cells, board.currPlayer);
			if(!isThereWinner){
				board.currentDepth++;
				if(board.currentDepth === endDepth){//if there is no winner but board has already reached end state (in other words, the game is a draw);
					var newGame = confirm('Game is draw!\nStart a new game?');
					if(newGame)
						board.empty();
				}else{
					board.currPlayer = (board.currPlayer === 1)?2:1;
					if(board.currPlayer === 2){
						var bestMove = miniMax(board.cells, board.currPlayer, board.currDepth, endDepth);
						var bestMoveCell = document.getElementById(bestMove);
						console.log(bestMove, bestMoveCell);
						move(bestMoveCell);
					}
				}
			}else{
				for(var i = 0; i < 3; i++){
					document.getElementById(isThereWinner[i]).style.background = '#f00';
					document.getElementById(isThereWinner[i]).style.color = '#fff';
				}
				var newGame = confirm((board.currPlayer === 1?'You':'Computer') + ' won!\nStart a new Game?');
				if(newGame)
					board.empty();	
			}
		}
	}

	//AI stuff
	//variables needed for determining the best possible move

	function miniMax(boardCells, boardPlayer, boardDepth, endDepth){
		var possibleMoves = getPossibleMoves(boardCells);
		var bestMove = possibleMoves[Math.floor(possibleMoves.length * Math.random())];

		
		return bestMove;
	}
	
	


	//helper functions
	function getPossibleMoves(boardCells){
			var possibleMoves = [];
			for(var i = 1, maxCells = boardCells.length; i <= maxCells; i++){
				if(boardCells[i] === '')
					possibleMoves.push(i);
			}
			return (possibleMoves.length === 0)? false: possibleMoves;
		}

	function checkForWinner(boardCells, boardPlayer){
		var playerCells = getPlayerCells(boardCells, boardPlayer);
		//check if current player's cells matches winning combinations
		var isWinningCells = cellIntersect(playerCells);
		if(isWinningCells)
			return isWinningCells;	
		return false;
	}
	
	function getPlayerCells(boardCells, boardPlayer){
		var playerCells = [];
		for(cellId in boardCells){
			if(boardCells[cellId] === boardPlayer){
				playerCells.push(cellId);
			}
		}
		return playerCells;
	}

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

	function cellIntersect(playerCells){
		for(var i = 0, maxCombi = winningCombinations.length; i < maxCombi; i++){
			var cellResult = arrayIntersect(playerCells, winningCombinations[i]);
			if(cellResult !== false && cellResult.length === 3)
				return cellResult;
		}

		return false;
	}
}());
