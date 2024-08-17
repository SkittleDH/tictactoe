// DOM Elements
const cells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('gameStatus');
const restartBtn = document.getElementById('restartBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const botBtn = document.getElementById('botBtn');

// Game variables
let player = 'O';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
let botMode = false;

// Win conditions for the game
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]  // Diagonals
];

// Handle cell click events
const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedIndex] !== '' || !gameActive) return;

    updateCell(clickedIndex, player);
    checkGameResult();

    if (botMode && player === 'X' && gameActive) {
        setTimeout(botMove, 500); // Delay for bot move
    }
};

// Update cell with player's move
const updateCell = (index, currentPlayer) => {
    boardState[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].style.cursor = 'default';
};

// Check the game result after each move
const checkGameResult = () => {
    let roundWon = checkWinner();
    if (roundWon) {
        gameStatus.textContent = `${player} Wins!!!`;
        gameActive = false;
        return;
    }

    let roundDraw = !boardState.includes('');
    if (roundDraw) {
        gameStatus.textContent = `It's a Draw!`;
        gameActive = false;
        return;
    }

    player = player === 'O' ? 'X' : 'O';
    gameStatus.textContent = `Player ${player}'s Turn`;
};

// Check if there's a winner
const checkWinner = () => {
    let winner = false;
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            highlightWinningCells(condition);
            winner = true;
            break;
        }
    }
    return winner;
};

// Highlight the winning cells
const highlightWinningCells = (winningCombination) => {
    winningCombination.forEach(index => {
        cells[index].style.backgroundColor = '#8BD0E3';
    });
};

// Restart the game
const restartGame = () => {
    player = 'O';
    gameActive = true;
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#E1F6FC';
        cell.style.cursor = 'pointer';
    });
    gameStatus.textContent = `Player ${player}'s Turn`;
};

// Bot move logic
const botMove = () => {
    const availableCells = boardState.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    const randomCellIndex = Math.floor(Math.random() * availableCells.length);
    const chosenCell = availableCells[randomCellIndex];

    updateCell(chosenCell, 'X');
    checkGameResult();
};

// Switch game mode (2 Player or Bot)
const switchMode = (mode) => {
    botMode = mode === 'Bot';
    twoPlayerBtn.classList.toggle('active', !botMode);
    botBtn.classList.toggle('active', botMode);
    restartGame();
};

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
twoPlayerBtn.addEventListener('click', () => switchMode('2P'));
botBtn.addEventListener('click', () => switchMode('Bot'));

// Initial game setup
switchMode('2P');
