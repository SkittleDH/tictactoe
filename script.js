const cells = document.querySelectorAll('.cell');
const resultText = document.getElementById('resultText');
const restartBtn = document.getElementById('restartBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const botBtn = document.getElementById('botBtn');

// Leaderboard elements
const xWinsElement = document.getElementById('xWins');
const oWinsElement = document.getElementById('oWins');
const drawsElement = document.getElementById('draws');

let xWins = 0;
let oWins = 0;
let draws = 0;

let currentPlayer = 'X';
let gameActive = true;
let board = ['', '', '', '', '', '', '', '', ''];
let isBotMode = false;

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

const handleCellPlayed = (cell, index) => {
    board[index] = currentPlayer;
    cell.innerHTML = `<span>${currentPlayer}</span>`;
    cell.querySelector('span').style.color = currentPlayer === 'X' ? 'purple' : 'darkblue';
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const winCondition = winConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        resultText.textContent = `${currentPlayer} Wins!`;
        if (currentPlayer === 'X') {
            xWins++;
            xWinsElement.textContent = xWins;
        } else {
            oWins++;
            oWinsElement.textContent = oWins;
        }
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        resultText.textContent = `It's a Draw!`;
        draws++;
        drawsElement.textContent = draws;
        gameActive = false;
        return;
    }

    handlePlayerChange();
};

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (isBotMode && gameActive) {
        setTimeout(botMove, 500);
    }
};

const botMove = () => {
    let availableCells = [];
    board.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    let botCell = cells[randomIndex];

    handleCellPlayed(botCell, randomIndex);
    handleResultValidation();
};

const handleRestartGame = () => {
    const container = document.querySelector('.container');
    container.classList.add('fade-out');
    setTimeout(() => {
        gameActive = true;
        currentPlayer = 'X';
        board = ['', '', '', '', '', '', '', '', ''];
        resultText.textContent = '';
        cells.forEach(cell => {
            cell.innerHTML = '';
        });
        container.classList.remove('fade-out');
        container.classList.add('fade-in');
    }, 500);
};

const switchMode = (event) => {
    isBotMode = event.target.id === 'botBtn';
    twoPlayerBtn.classList.toggle('active', !isBotMode);
    botBtn.classList.toggle('active', isBotMode);
    
    const container = document.querySelector('.container');
    container.classList.add('fade-out');
    setTimeout(() => {
        handleRestartGame();
        container.classList.remove('fade-out');
        container.classList.add('fade-in');
    }, 500);
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);
twoPlayerBtn.addEventListener('click', switchMode);
botBtn.addEventListener('click', switchMode);
