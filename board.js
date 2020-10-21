
"use strict";
var timeoutHandle;



function resetTime(){

clearInterval(timeoutHandle);
let t = 0;

timeoutHandle = setInterval(function(){
  t++;
  document.getElementById("timer").innerHTML = ('000' + t).substr(-3);
}, 1000);

if(t===999){
  alert("Time Limit Exceeded");
}

}

/*function button_cb(s, cols, rows) {
  s.cols = cols;
  s.rows = rows;
  //make_solvable(s);
  //getRendering(s);
  uncover(cols, rows);
}*/




// https://www.geeksforgeeks.org/how-to-clear-the-content-of-a-div-using-javascript/
function clearBox(elementID) {
           var div = document.getElementById(elementID);
           if(timer){
             window.clearInterval(timer);
           }
           while(div.firstChild) {
               div.removeChild(div.firstChild);
           }
}


function button_cb(s, i, newGame) {
  const col = i % s.cols;
  const row = Math.floor(i / s.cols);

  //s.cols = cols;
  //s.rows = rows;
  //make_solvable(s);
  //getRendering();
  newGame.mark(col, row);
  newGame.getRendering();
  //return inputGame;
  return newGame;
}

// function prepare_dom(s, inputGame) {
//   const grid = document.querySelector(".grid");
//   const nCards = 9 * 9 ; // max grid size
//   for( let i = 0 ; i < nCards ; i ++) {
//     const card = document.createElement("div");
//     card.className = "card";
//     card.setAttribute("data-cardInd", i);
//     card.addEventListener("click", () => {
//       card_click_cb( s, card, i, inputGame);
//     });
//     grid.appendChild(card);
//   }
// }

// function card_click_cb(s, card_div, ind, inputGame){
//   inputGame.uncover(s.cols, s.rows);
// }
function prepare_dom(s, rows, cols, newGame) {
  let container = document.getElementById('btnContainer');
  const nButtons = rows * cols ; // max grid size
  for( let i = 0 ; i < nButtons ; i ++) {
    const button = document.createElement("button");
    button.className = "button";
    button.setAttribute("data-cardInd", i);
    button.addEventListener("click", () => {
      newGame = button_cb(s, i, newGame);
    });
    container.appendChild(button);
  }
  return newGame;
}



function makeGame(ncols,nrows,mines){
  let newGame = new MSGame();

  let state = {
    cols: null,
    rows: null,
    moves: 0,
    onoff: []
  }



  resetTime();

  let flags = mines;
  document.getElementById("flags").innerHTML = "Flags: " + flags;

  newGame.init(nrows,ncols,mines);
  console.log(newGame.getRendering().join("\n"));
  console.log(newGame.getStatus());




  let nbuttons = ncols*nrows;
  clearBox('btnContainer');
  let container = document.getElementById('btnContainer');
  let buttonSize = container.clientWidth / ncols;

  container.style.gridTemplateColumns = `repeat(${ncols}, ${buttonSize}px)`;
  container.style.gridTemplateRows = `repeat(${nrows}, ${buttonSize}px)`;






  //let button = null;
  //Dynamic button creation
  /*for(let i = 1; i <= nbuttons; i++){
    //______________
    document.querySelectorAll(".menuButton").forEach((button) =>{

      button.addEventListener("click", button.bind(null, state, cols, rows));
    });

    // callback for overlay click - hide overlay and regenerate game
    document.querySelector("#overlay").addEventListener("click", () => {
      document.querySelector("#overlay").classList.remove("active");
      make_solvable(state);
      render(state);
    });
    //______________



    /*let button = document.createElement('button');
    button.classList.add("btn");
    button.dataset.key = i;
    container.appendChild(button);
    //let b = button_cb(state, ncols, nrows, newGame);

    button.addEventListener("click", button.bind(null, state, ncols, nrows, newGame));
    const button = document.createElement("button");
    button.className = "button";
    button.setAttribute("data-cardInd", i);
    button.addEventListener("click", () => {

      const col = i % state.cols;
      const row = Math.floor(i / state.cols);

      newGame.uncover(col, row);
      state.moves ++;
      button_cb(state, i);
    });
    container.appendChild(button);
    console.log(newGame.getRendering().join("\n"));
    console.log(newGame.getStatus());
  }*/



  newGame = prepare_dom(state, nrows, ncols, newGame);

  //newGame.uncover(1,1);

  console.log(newGame.getRendering().join("\n"));
  console.log(newGame.getStatus());
  /*newGame.init(nrows,ncols,mines);
  console.log(newGame.getRendering().join("\n"));
  console.log(newGame.getStatus());*/





}


onload = function(){
  makeGame('10','8','10');
}
