// Borrowed code from Professor Pavol Federl
// Borrowed code from TA Emmanuel Onu
"use strict";
var timeoutHandle;
var flags;
let nbuttons;

// On load of javascript create a 10x8 board
onload = function(){
  makeGame('10','8','10');
}

// Reset the Time each time a new level is selected
function resetTime(){

  clearInterval(timeoutHandle);
  let t = 0;

  timeoutHandle = setInterval(function(){
    t++;
    if(t>999){
      clearInterval(timeoutHandle);
      t=999;
    }
    document.getElementById("timer").innerHTML = ('000' + t).substr(-3);
  }, 1000);


}

// Clear a div for board
// https://www.geeksforgeeks.org/how-to-clear-the-content-of-a-div-using-javascript/
function clearBox(elementID) {
  var div = document.getElementById(elementID);
  while(div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

// Create button and based on right or left click render accordingly
function button_cb(s, i, newGame, ncols, nrows, button, clickSide) {
  const col = i % ncols;
  const row = Math.floor(i / ncols);
  console.log(col);


  //left click
  if(clickSide === 0){
    newGame = renderLeftClickBoardButton(newGame, col, row, button);

  }
  //right click
  if(clickSide === 1){
    newGame = renderRightClickBoardButton(newGame, col, row, button);
  }
  newGame = renderRemainingButtons(newGame, ncols, nrows);
  console.log(newGame.getRendering().join("\n"));
  console.log(newGame.getStatus());

  return newGame;
}

// Render all squares after click
function renderRemainingButtons(newGame, ncols, nrows, currCol, currRow){
  let idx = 0;
  let shownArr = [];
  for(let i = 0; i < nrows; i++){
    for(let j = 0; j < ncols; j++){
      if(newGame.arr[i][j].state === "shown"){
        shownArr.push(idx);

      }
      idx++;
    }
  }
  for (let k = 0; k < shownArr.length; k++){
    let button = document.querySelector(`[data-cardInd="${shownArr[k]}"]`);

    newGame = renderLeftClickBoardButton(newGame, shownArr[k] % ncols, Math.floor(shownArr[k] / ncols), button);
  }


  return newGame;
}

// Render game board on left click
function renderLeftClickBoardButton(newGame, col, row, button){
  console.log("Left Button Pressed (Uncover)");

  //end game and show min
  if(newGame.getStatus().exploded == true) {
    clearInterval(timeoutHandle);
    let idx = 0;
    let mineArr = [];
    for(let i = 0; i < newGame.nrows; i++){
      for(let j = 0; j < newGame.ncols; j++){
        if(newGame.arr[i][j].mine === true){
          mineArr.push(idx);

        }
        idx++;
      }
    }
    for (let k = 0; k < mineArr.length; k++){
      let button = document.querySelector(`[data-cardInd="${mineArr[k]}"]`);
      button.style.backgroundImage = "url('bomb.png')";
      button.style.backgroundColor = "black";
      button.innerHTML = null;
    }

    document.querySelector("#overlay").classList.toggle("active");


    document.querySelector("#overlay").addEventListener("click", () => {
      document.querySelector("#overlay").classList.remove("active");
      makeGame('10','8','10');
    });
  }

  else if(newGame.arr[row][col].state != "marked" && newGame.getStatus().exploded == false){
    button.style.backgroundColor = "red";
    button.innerHTML = newGame.arr[row][col].count;
    newGame.uncover(row, col);
  }
  winningCondition(newGame);

  return newGame;
}

// Render right click by being able to put flags on the hidden box
function renderRightClickBoardButton(newGame, col, row, button){
  console.log("Right Button Pressed (Mark)");
  console.log(newGame.arr[row][col]);

  if(newGame.arr[row][col].state === "hidden"){

    button.style.backgroundImage = "url('flag.png')";
    newGame.mark(row, col);
    flags--;
  }
  else if(newGame.arr[row][col].state === "marked"){
    button.style.backgroundImage = null;
    newGame.mark(row, col);
    flags++;
  }
  document.getElementById("flags").innerHTML = "Flags: " + flags;
  winningCondition();
  return newGame;
}


// Create the grid
function prepare_dom(s, rows, cols, newGame) {
  let container = document.getElementById('btnContainer');
  for( let i = 0 ; i < nbuttons ; i ++) {
    const button = document.createElement("button");
    button.className = "button";
    button.setAttribute("data-cardInd", i);

    let clickSide = 0;//left click is 0, right click is 1
    button.addEventListener("click", () => {
      clickSide = 0;
      newGame = button_cb(s, i, newGame, cols, rows, button, clickSide);

    });
    button.addEventListener("contextmenu", rightClick => {
      clickSide = 1;
      newGame = button_cb(s, i, newGame, cols, rows, button, clickSide);
      rightClick.preventDefault();
    });
    container.appendChild(button);
  }
  return newGame;
}

// Check if a player has won the game
function winningCondition(newGame){
  let totalUncovered = newGame.nuncovered + newGame.nmines;
  if(totalUncovered == nbuttons && flags == 0){
    clearInterval(timeoutHandle);
    document.querySelector("#overlayWin").classList.toggle("active");


    document.querySelector("#overlayWin").addEventListener("click", () => {
      document.querySelector("#overlayWin").classList.remove("active");
      makeGame('10','8','10');
    });
  }
}

// Create the game with input from html, create a grid with rows and coloumns specified.
// Create the number of mines specified
function makeGame(ncols,nrows,mines){
  let newGame = new MSGame();

  let state = {
    cols: null,
    rows: null,
    moves: 0,
    onoff: []
  }

  resetTime();
  flags = mines;
  document.getElementById("flags").innerHTML = "Flags: " + flags;

  newGame.init(nrows,ncols,mines);
  console.log(newGame.getRendering().join("\n"));
  console.log(newGame.getStatus());
  nbuttons = ncols*nrows;
  clearBox('btnContainer');
  let container = document.getElementById('btnContainer');
  let buttonSize = container.clientWidth / ncols;

  container.style.gridTemplateColumns = `repeat(${ncols}, ${buttonSize}px)`;
  container.style.gridTemplateRows = `repeat(${nrows}, ${buttonSize}px)`;
  newGame = prepare_dom(state, nrows, ncols, newGame);

  console.log(newGame.getRendering().join("\n"));
  console.log(newGame.getStatus());

}
