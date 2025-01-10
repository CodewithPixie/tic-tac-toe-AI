const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#status-text");
const restartBtn = document.querySelector("#restart-btn");
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
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cell-index");

    if (options[cellIndex] !== "" || !running || currentPlayer !== "X") {
        return; // Ensure only the human player can make a move
    }

    updateCell(this, cellIndex);
    checkWinner();

    // Trigger AI's turn if the game is still running
    if (running && currentPlayer === "O") {
        setTimeout(() => {
            makeAIMove();
            checkWinner();
        }, 500);
    }
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA === "" || cellB === "" || cellC === "") {
            continue;
        }
        if (cellA === cellB && cellB === cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

function makeAIMove() {
    const bestMove = minimax(options, true).index;
    options[bestMove] = "O";
    cells[bestMove].textContent = "O";

    // Check for a winner after AI makes a move
    checkWinner();

    // Switch back to the human player if the game is still running
    if (running) {
        changePlayer();
    }
}

function minimax(board, isMaximizing) {
    const winner = getWinner(board);
    if (winner === "X") return { score: -10 };
    if (winner === "O") return { score: 10 };
    if (!board.includes("")) return { score: 0 };

    let bestMove;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const result = minimax(board, false);
                board[i] = "";
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, index: bestMove };
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                const result = minimax(board, true);
                board[i] = "";
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = i;
                }
            }
        }
        return { score: bestScore, index: bestMove };
    }
}

function getWinner(board) {
    for (const condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    return null;
}
