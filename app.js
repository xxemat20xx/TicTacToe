
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let cellContainer = "";
        gameboard.forEach((cell, index) => {
            cellContainer += `<div class="cell" cell-index= "${index}">${cell}</div>`
        });
        document.querySelector(".cell-container").innerHTML = cellContainer;
        document.querySelector("#p1-score").innerHTML = `Score is: 0`
        document.querySelector("#p2-score").innerHTML = `Score is: 0`
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cells) => {
            cells.addEventListener("click", Game.cellClicked);
        });
    }
    const updateCell = (index, symbol) => {
        gameboard[index] = symbol;
        render();
    }
    const getGameBoard = () => gameboard;
    return {
        render,
        updateCell,
        getGameBoard,
    }
})();
const displayController = (() => {
    const renderMsg = (msg) => {
        document.querySelector("#message").innerHTML = msg;
    }
    return {
        renderMsg
    }
})();
const createPlayer = (name, symbol) => {
    return {
        name,
        symbol
    }
};
const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;
    let score = 0;
    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ];
        console.log(players)
        document.querySelector("#player1-displayName").innerHTML = players[0].name + " " + "your are player" + " " + players[0].symbol;
        document.querySelector("#player2-displayName").innerHTML = players[1].name + " " + "your are player" + " " + players[1].symbol;

        displayController.renderMsg("Player X's Turn!")

        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
    }
    const cellClicked = (event) => {
        if (gameOver) {
            return;
        }
        let index = event.target.getAttribute("cell-index");
        console.log(index, players[currentPlayerIndex].symbol)

        if (Gameboard.getGameBoard()[index] != "")
            return;



        Gameboard.updateCell(index, players[currentPlayerIndex].symbol);
        currentPlayerIndex === 0 ? displayController.renderMsg("Player O's Turn!") : displayController.renderMsg("Player X's Turn!");
        if (checkWinner(Gameboard.getGameBoard(), players[currentPlayerIndex].symbol)) {
            gameOver = true;
            displayController.renderMsg(`${players[currentPlayerIndex].name} WON!`);
        } else if (checkForDraw(Gameboard.getGameBoard())) {
            gameOver = true;
            displayController.renderMsg("IT'S A TIE!");
        }
        if (players[currentPlayerIndex].symbol === "X" && checkWinner(Gameboard.getGameBoard())) {
            score++;
            document.querySelector("#p1-score").innerHTML = `Score is: ${(score)}`

        }
        if (players[currentPlayerIndex].symbol === "O" && checkWinner(Gameboard.getGameBoard())) {
            score++;
            document.querySelector("#p2-score").innerHTML = `Score is: ${score}`
        }
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; //change player
    }
    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.updateCell(i, "");
        }
        gameOver = false;
        score = 0;
        displayController.renderMsg("");
        Game.start();
        Gameboard.render();

    }
    return {
        start,
        cellClicked,
        restart
    }
})();
// check for winners
function checkWinner(board) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}
// check for DRAW
function checkForDraw(board) {
    return board.every(cell => cell !== "");
}
// open player enter name
document.querySelector("#start-gameBtn").addEventListener("click", () => {
    document.querySelector(".start-game-container").classList.add("remove-el");
    document.querySelector(".popup-form-container").classList.remove("remove-el");
});

//create players after form is submitted
const form = document.querySelector("#form");
form.addEventListener("submit", function (e) {
    e.preventDefault(); //prevent the form to load all the page agai
    document.querySelector(".popup-form-container").classList.add("remove-el");//remove popup forn
    document.querySelector(".game-container").classList.remove("remove-el");

    Game.start();
});
// reset
document.querySelector("#reset-gameBtn").addEventListener("click", () => { Game.restart() });
// restartGame
document.querySelector("#restartGame").addEventListener("click", () => { window.location.reload() });