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
		this.currDepth = 0;
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
			this.currDepth = 0;
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

		if(cell.innerHTML === ''){
			cell.innerHTML = players[board.currPlayer];
			board.cells[cell.id] = board.currPlayer;
			var isThereWinner = checkForWinner(board.cells, board.currPlayer);

			if(!isThereWinner){
				board.currDepth++;
				if(board.currDepth === endDepth){//if there is no winner but board has already reached end state (in other words, the game is a draw);
					var newGame = confirm('Game is draw!\nStart a new game?');
					if(newGame)
						board.empty();
				}else{
					board.currPlayer = (board.currPlayer === 1)?2:1;
					if(board.currPlayer === 2){
						var boardCells = board.cells.slice(0);//just clone the cells board
						var boardCurrPlayer = board.currPlayer;
						var boardCurrDepth = board.currDepth + 1;

						var bestMove = miniMax(boardCells, boardCurrPlayer, boardCurrDepth);
						var bestMoveCell = document.getElementById(bestMove);
            move(bestMoveCell);
					}
				}
			}else{
				var winner = board.currPlayer;
				for(var i = 0; i < 3; i++){
					document.getElementById(isThereWinner[i]).style.background = '#f00';
					document.getElementById(isThereWinner[i]).style.color = '#fff';
				}
				var newGame = confirm((winner === 1?'You':'Computer') + ' won!\nStart a new Game?');
				if(newGame)
					board.empty();
			}
		}
	}

	//miniMax algorithm
	function miniMax(boardCells, boardPlayer, boardDepth){
		var isThereWinner = checkForWinner(boardCells, boardPlayer);
		var bestMove;
		if(boardDepth === endDepth || isThereWinner){//check if you've reached a leaf node
			//ending value for leaf nodes
			if(isThereWinner){
				return (boardPlayer === 1)? -1: 1; //player 1 is human, player 2 is AI, if there is a winner already and current player is 1, it is a losing state, otherwise, a winning state
			}else{//game is a draw
				return 0;
			}
		}else{
			//get the value to compare depending on the current depth player
			var valueToCompare = (boardPlayer === 1)? 2: -2;
			//get all possible moves on the current board
			var possibleMoves = getPossibleMoves(boardCells);
			//iterate through possibleMoves
			for(var i = 0, maxMoves = possibleMoves.length; i < maxMoves; i++){
				var movedBoard = boardCells.slice(0);
				movedBoard[possibleMoves[i]] = boardPlayer;
				var nextPlayer = (boardPlayer === 1)? 2: 1;
				//recursively call minimax until you find leaf value
				var valueTemp = miniMax(movedBoard, nextPlayer, boardDepth + 1);
				if(boardPlayer === 1 && valueTemp < valueToCompare){
					valueToCompare = valueTemp;
          bestMove = possibleMoves[i];
				}else if(boardPlayer === 2 && valueTemp > valueToCompare){
					valueToCompare = valueTemp;
          bestMove = possibleMoves[i];
				}
			}
			if(boardDepth === board.currDepth + 1)//this is wrong, returns the first board that reaches the end depth FIX THIS!!!
				return bestMove;			

			return valueToCompare;
		}
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

	//for getting the cells in the board that the player has played
	function getPlayerCells(boardCells, boardPlayer){
		var playerCells = [];
		for(cellId in boardCells){
			if(boardCells[cellId] === boardPlayer){
				playerCells.push(cellId);
			}
		}
		return playerCells;
	}
	
	//intersecting 2 arrays between their similarities
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
	
	//intersects a player's cells and the winning combinations, 
	//if there are 3 similarly intersected, player has won so return the winning player's cells, otherwise false
	function cellIntersect(playerCells){
		for(var i = 0, maxCombi = winningCombinations.length; i < maxCombi; i++){
			var cellResult = arrayIntersect(playerCells, winningCombinations[i]);
			if(cellResult !== false && cellResult.length === 3)
				return cellResult;
		}

		return false;
	}
}());
