const board = document.querySelector(".board");
const bLetters = document.querySelector(".letters");
const bNumbers = document.querySelector(".numbers");
const bGraveyard = document.querySelector(".bgraveyard");
const wGraveyard = document.querySelector(".wgraveyard");
const letters = ["a","b","c","d","e","f","g","h"];
const numbers = ["1","2","3","4","5","6","7","8"];
let whiteInCheck = false;
let blackInCheck = false;
let moves = [];
var position = [['br0','bkn0','bb0','bq0','bk0','bb1','bkn1','br1'],
				['bp0','bp1','bp2','bp3','bp4','bp5','bp6','bp7'],
				['','','','','','','',''],
				['','','','','','','',''],
				['','','','','','','',''],
				['','','','','','','',''],
				['wp0','wp1','wp2','wp3','wp4','wp5','wp6','wp7'],
				['wr0','wkn0','wb0','wq0','wk0','wb1','wkn1','wr1']];
var curPosition = position.map(a => ([...a]));
var turn = "white";


for(let i = 0 ; i<8; i++){
	let letter = document.createElement("li");
	letter.textContent = letters[i];
	bLetters.appendChild(letter);
	let number = document.createElement("li");
	number.textContent = numbers[i];
	bNumbers.appendChild(number);
}
let black = false;
for(let i = 1;i<=64;i++){
	const square = document.createElement("div");
	square.addEventListener('dragover',function(e){
		e.preventDefault();
	},false);
	square.addEventListener('drop',function(e){
		e.preventDefault();		
		let legalMoves = moves;
		returnOpacity();
		if(moves.length > 0 ){
			if(moves.indexOf(parseInt(square.id)) > -1){
			turn = (turn == 'white') ? "black": "white";
			let piece = e.dataTransfer.getData("text");
			//console.log("piece: " + piece);
			let takenPiece;
			if(square.hasChildNodes()){
				 takenPiece = square.removeChild(square.childNodes[0]);
				 (getColor(piece) == 'black') ?  wGraveyard.appendChild(takenPiece): bGraveyard.appendChild(takenPiece);
				
			}
			
			square.innerHTML = '';
			square.appendChild(document.getElementById(piece));
			let rowCol = convertSquareToRowCol(square.id);
			//console.log(rowCol);
			let prevPosition = findPreviousPosition(piece);
			//console.log(curPosition[rowCol[0]][rowCol[1]]);
			curPosition[rowCol[0]][rowCol[1]] = piece;
			curPosition[prevPosition[0]][prevPosition[1]] = '';
			
			}
			moves = [];
		}
	},false);
	if(black){
		square.classList.add("square");
		square.classList.add("black");
		square.setAttribute("id", ""+i-1);
		
	}else{
		square.classList.add("square");
		square.classList.add("white");
		square.setAttribute("id", ""+i-1);
	}
	if(i % 8 != 0){
		black = !black
	}
	board.appendChild(square);
}
function loadPieces(){
	turn = "white";
	deletePieces();
	curPosition = position.map(a => ([...a]));
	console.log("in load");
	console.log(position);
	for(let i = 0; i<8; i++){
		for(let j = 0; j < 8; j++){
			let pieceName = position[i][j].substring(0,position[i][j].length-1);
			let pieceID = position[i][j].substring(position[i][j].length-1,position[i][j].length);
			if(pieceID != ''){
				createPiece(pieceName,pieceID,i,j);
			}
	
		}
	}			
}
function createPiece(name,id,i,j) {
	add_img(name,id,i,j);
}
		
function add_img(name,id,i,j) { 
	//console.log(name + i + j);
	let color = getColor(name);
	var img = document.createElement('img'); 
	img.src = "pieces assets\\"+color+"\\" +name+ ".png";
	img.id = name+id;
	img.draggable = true;
	img.onload = function(event){
		this.addEventListener('dragstart',drag,false);
	};
	document.getElementById(""+ (i*8+j)).appendChild(img);
}
function drag(e){
	e.dataTransfer.setData("text",e.target.id);
	moves = checkMove(e.target.id);
}
function checkMove(piece) {
	//console.log("square" + square + "piece: "+ piece);
	let pieceType = piece.substring(1,piece.length-1)
	let legalMoves = [];
	if(getColor(piece) != turn){
		return legalMoves;
	}
	if( pieceType == 'p'){
		legalMoves = pawnLogic(piece);
	}else {
		legalMoves = majorPieceLogic(piece);
	}
	return legalMoves;
}
function getColor(piece){
	let color = null;
	if(piece[0] == 'b'){
		color = "black";
	}else if(piece[0] == 'w'){
		color = "white";
	}
	return color;
}
function findPreviousPosition(piece){
	let row = -1;
	let col = -1;
	for( i = 0; i < 8; i++){
		 col = curPosition[i].indexOf(piece);
		if(col > -1){
			row = i;
			break;
		}
	}
	//console.log("row: " + row + " col: " + col);
	return[row,col];
}
function convertSquareToRowCol(text){
	let square = parseInt(text);
	//console.log("square: " + square);
	return [Math.floor(square/8) , square % 8];
}
function convertRowColToSquare(row, col){
	return row * 8 + col; 
}
function pawnLogic(piece){
	
	let prevPosition = findPreviousPosition(piece);
	let legalMoves = [];
	//if pawn is in starting postion, ability to jump two squares
	if(getColor(piece) == 'black' && prevPosition[0] == 1 && curPosition[prevPosition[0]+2][prevPosition[1]] == '') {
		legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]+2,prevPosition[1]);		
	}
	if(getColor(piece) == 'white' && prevPosition[0] == 6 && curPosition[prevPosition[0]-2][prevPosition[1]] == '') {
		legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]-2,prevPosition[1]);		
	}
	//if empty square is in front,pawn can move one
	if(getColor(piece) == 'black' && curPosition[prevPosition[0]+1][prevPosition[1]] == '') {
		legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]+1,prevPosition[1]);		
	}
	if(getColor(piece) == 'white'&& curPosition[prevPosition[0]-1][prevPosition[1]] == '') {
		legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]-1,prevPosition[1]);		
	}
	//if enemy piece is diagonally forward,can take
	if(getColor(piece) == 'black'){
		if(prevPosition[1] < 7) {
			if(getColor(curPosition[prevPosition[0]+1][prevPosition[1]+1]) == 'white'){
				legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]+1,prevPosition[1]+1);
			}
		}
		if(prevPosition[1] > 0) {
			if(getColor(curPosition[prevPosition[0]+1][prevPosition[1]-1]) == 'white'){
				legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]+1,prevPosition[1]-1);
			}
		}
	}
	if(getColor(piece) == 'white'){
		if(prevPosition[1] < 7) {
			if(getColor(curPosition[prevPosition[0]-1][prevPosition[1]+1]) == 'black'){
				legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]-1,prevPosition[1]+1);
			}
		}
		if(prevPosition[1] > 0) {
			if(getColor(curPosition[prevPosition[0]-1][prevPosition[1]-1]) == 'black'){
				legalMoves[legalMoves.length] = convertRowColToSquare(prevPosition[0]-1,prevPosition[1]-1);
			}
		}
	}
	for( let i = 0; i < legalMoves.length; i++){
		document.getElementById(parseInt(legalMoves[i])).style.border = "4px solid pink";
	}
	console.log(legalMoves);
	return legalMoves;

	
}
function majorPieceLogic(piece){
	
	let prevPosition = findPreviousPosition(piece);
	let testingPos = prevPosition.slice();
	let knightOrKing = false;
	let legalMoves = [];
	let directions;
	if(piece[1] == 'r'){
	//rook movement abilities
		directions = [[-1,0],[1,0],[0,-1],[0,1]];
	}else if(piece[1] == 'b'){
	//bishop movement abilities
		directions = [[-1,-1],[1,1],[1,-1],[-1,1]];
	}else if(piece[1] == 'q' || piece.substring(1,piece.length-1) == 'k'){
	//queen and king movement abilities
		directions = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1]];
	}else if(piece.substring(1,piece.length-1) == 'kn'){
	//knight movement abilities
		directions = [[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1],[-2,-1],[-2,1]];
	}
	if(piece[1] == 'k'){
		//if knight or king, can only head in their direction vectors once
		knightOrKing = true;
	}

	for(let i = 0; i < directions.length; i ++){
		let barrier = false;
		while(barrier == false){
		console.log("testingPos: "+ testingPos);
			//check bounds of board
			if(testingPos[0] + directions[i][0] > 7 || testingPos[0] + directions[i][0] < 0 || testingPos[1] + directions[i][1] > 7 || testingPos[1] + directions[i][1] < 0) {
				barrier = true;
				continue;
			}
			//if empty space, continue looking in that direction
			if(curPosition[testingPos[0] + directions[i][0]][testingPos[1] + directions[i][1]] == ''){
				legalMoves[legalMoves.length] = convertRowColToSquare(testingPos[0]+ directions[i][0], testingPos[1] + directions[i][1]);
			}
			else if(curPosition[testingPos[0] + directions[i][0]][testingPos[1] + directions[i][1]] != ''){
				if(getColor(piece) != getColor(curPosition[testingPos[0] + directions[i][0]][testingPos[1] + directions[i][1]])){
					//taking piece, that square is the furthest allowed in that direction
					legalMoves[legalMoves.length] = convertRowColToSquare(testingPos[0]+ directions[i][0], testingPos[1] + directions[i][1]);
				}
				barrier = true;
				
			}
			testingPos = [testingPos[0] + directions[i][0], testingPos[1] + directions[i][1]];
			if(knightOrKing){
			// only can search in the direction vector once
				barrier = true;
			}
		}
		testingPos = prevPosition.slice();
	}
	legalMoves = movesIntoCheck(piece,legalMoves);
	console.log(legalMoves);
	for( let i = 0; i < legalMoves.length; i++){
		//document.getElementById(parseInt(legalMoves[i])).style.opacity = ".5";
		document.getElementById(parseInt(legalMoves[i])).style.border = "4px solid pink";
	}
	
	return legalMoves;
}
function returnOpacity(){
	console.log("in return opacity")
	for(let i = 0; i < 64; i++){
		//document.getElementById(""+i).style.opacity = "1";
		document.getElementById(""+i).style.border = "";
	}
}

function deletePieces(){
	console.log("in delete");
	for(let i = 0; i<64; i++){
		let square = document.getElementById(i);
		square.innerHTML = "";
	}
	//delete graveyard
	bGraveyard.innerHTML = "";
	wGraveyard.innerHTML = "";
}
function directLineToKing(piece,legalMoves,kingColor){
	let nonChecks = legalMoves.slice();
	
	let directions =  [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[1,-1],[-1,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1],[-2,-1],[-2,1]];
	for(let i = 0; i < legalMoves.length; i++){
		let testingPosition = curPosition.map(a => ([...a]));
		let rowCol = findPreviousPosition(piece);
		testingPosition[rowCol[0]][rowCol[1]] = "";
		let newRowCol = convertSquareToRowCol(legalMoves[i])
		testingPosition[newRowCol[0]][newRowCol[1]] = piece;
		let kingPos = getKingPos(kingColor);

		for(let j = 0; j < directions.length; j++){
			let barrier = false;
			let iterations = 0;
			while(barrier == false){
				console.log("testingPos: "+ testingPos);
				//check bounds of board
			

				if(kingPos[0] + directions[j][0] > 7 || kingPos[0] + directions[j][0] < 0 || kingPos[1] + directions[j][1] > 7 || kingPos[1] + directions[j][1] < 0) {
					barrier = true;
					continue;
				}
				let searchSquare = testingPosition[kingPos[0] + directions[j][0]][kingPos[1] + directions[j][1]];
				else if(searchSquare != '' && (kingColor != searchSquareColor)){
					let searchSquareColor = getColor(searchSquare);
					//if not empty, check for oppisite color and if the directions match with an attacking piece.
					if((j < 8 && j>=4) ){
						//bishop, queen,king and pawn
						if(iterations == 0 && searchSquare[1] == 'p' ) {
							if(kingColor == "white" && (j==4 || j == 7)){
								nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
							}else if(kingColor == "black" && (j==5 || j == 6)){
								nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
							}
						if(iterations == 0 && searchSquare.substring(1,searchSquare.length-1) == 'k'){
							nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
						}
						if(searchSquare[1] == 'b' || searchSquare[1] == 'q' ){
							nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
						}
					}
					else if(j < 4){
						//rook, king, and queen
						if(iterations == 0 && searchSquare.substring(1,searchSquare.length-1) == 'k'){
							nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
						}
						if(searchSquare[1] == 'q' ||searchSquare[1] == 'r' ){
							nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
						}
					}else if(j >= 8 && iterations == 0){
						//knights
						if(searchSquare.substring(1,searchSquare.length-1) == 'kn' ){
							nonChecks.splice(nonChecks.indexOf(legalMoves[i]),1);
						}
					}
					iterations++; 
				}
			}
		}
	}
	return nonChecks;	
}

function getKingPos(kingColor){
	let target = (kingColor == 'white')?"wk0":"bk0";
	for(let i = 0; i< curPosition.length;i++){
		for(let j = 0; j< curPosition.length;j++){
			if(curPosition[i][j] == target){
				return [i,j];
			}
		}
	}
}