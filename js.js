/*
ORDER
    P1 places mark                  V
    Make checked areas unclickable  V
    Checks for win
        if win
        Add to win counter
        switch player               V
        reset                       X
    Checks if area filled
        if filled
        Add to tie counter
        switch player               V
        reset                       X
            Added a reset button instead
    Switches player                 V
    repeat
*/
const winOutputX = document.getElementById("win-x");
const winOutputO = document.getElementById("win-o");
const tiesOutput = document.getElementById("ties");

const overlay = document.getElementById("overlay");

var currentPlayer = "x";
var winsX = 0;
var winsO = 0;
var ties = 0;

document.getElementById("body").onload = function () {
    reset();
}

// Reset button
document.getElementById("reset").addEventListener("click",() => {
    reset();
})

// document.querySelectorAll(".empty").forEach(square => {
//     square.addEventListener("click", () => {
//         console.log(square.id)
//         square.classList.toggle("empty")
//     })
// })

function placeMark(player, square) {
    square.classList.toggle("empty")
    switch (player) {
        case "x":
            square.classList.toggle("x");
            square.innerHTML = `
            <img src="./assets/cross.svg">
            `;
            console.log("placemark case x");
            break;
        case "o":
            square.classList.toggle("o");
            square.innerHTML = `
            <img src="./assets/circle.svg">
            `;
            console.log("placemark case o");
            break;
    }

    console.log(player);

    checkWin(player); // CAUSES PROBLEMS
    // checkTie(player) // WORKS
    // switchPlayer(player) // WORKS
}

// Empties playing area
function reset() {
    document.querySelectorAll(".square").forEach(square => {
        square.innerHTML = "";
        square.className = "square";
        square.classList.add("empty");

        // Remove any existing click event listeners
        let newSquare = square.cloneNode(true);
        square.parentNode.replaceChild(newSquare, square);

        // Add the click event listener once
        newSquare.addEventListener("click", () => {
            placeMark(currentPlayer, newSquare);
        }, {once: true});
    }); 
    overlay.style.display = "none";
}


function checkWin(player) {
    var filledSquares = [];
    document.querySelectorAll(`.${player}`).forEach((square)=>{
        filledSquares.push(parseInt(square.id))
    });
    // console.log(checkH(filledSquares)+" | "+checkV(filledSquares)+" | "+checkD(filledSquares))
    if(checkH(filledSquares)||checkV(filledSquares)||checkD(filledSquares)){
        // WIN
        addWin(player);
        overlay.style.display = "block";
        // Switch player
        switchPlayer(player);
    } else {
        checkTie(player);
    }
}

function addWin(player) {
    if(player == "x"){
        winsX ++;
    } else {
        winsO ++;
    }
    winOutputX.innerText = `X Wins: ${winsX}`;
    winOutputO.innerText = `O Wins: ${winsO}`;
}

function isRowStart(square) {
    if(square == 1 || square == 4 || square == 7) {
        return square
    } else {
        return false
    }
}

function checkH(filledSquares) {
    const filteredSquares = filledSquares.filter(isRowStart);
    var horizontalRow = 0;
    filteredSquares.forEach(square => {
        if(includesAll(filledSquares, [square, square+1, square+2])){
            horizontalRow = 1;
        }
    })
    if (horizontalRow == 1) {
        return true;
    } else {
        return false;
    }
}

function checkV(filledSquares) {
    // ALWAYS +3
    // filter to max of 3
    const filteredSquares = filledSquares.filter(square => square <= 3);
    var verticalRow = 0;
    filteredSquares.forEach(square => {
        if(includesAll(filledSquares, [square, square+3, square+6])){
            verticalRow = 1;
        }
        // return includesAll(filledSquares, [square, square+3, square+6])
    })
    if (verticalRow == 1) {
        return true;
    } else {
        return false;
    }
}

function checkD(filledSquares) {
    // 'ARD CODE THIS ONE
    if(includesAll(filledSquares, [1,5,9])||includesAll(filledSquares, [3,5,7])){
        return true
    } else {
        return false
    }
}

// Magic, basically just a foreach.
const includesAll = (array, values) => values.every(value => array.includes(value))

function checkTie(player) {
    switch (document.querySelectorAll(".empty").length) {
        case 0:
            switchPlayer(player);
            ties++;
            tiesOutput.innerText = `Ties: ${ties}`;
            break;
        default:
            switchPlayer(player)
            break;
    }
}

function switchPlayer(player) {
    switch (player) {
        case "x":
            currentPlayer = "o";   
            break;
        case "o":
            currentPlayer = "x"; 
            break;
    }
    console.log("switchplayer: "+ player)
    document.getElementById("turn").innerText = `Player turn: ${currentPlayer.toUpperCase()}`
}