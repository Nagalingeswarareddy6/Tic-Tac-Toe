document.addEventListener('DOMContentLoaded', () => {
  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameActive = true;
  let gameMode = 'singlePlayer';
  let difficulty = 'medium';
  let winningCells = [];

  const grid = document.getElementById('gameGrid');
  const statusText = document.getElementById('statusText');
  const playerX = document.getElementById('playerX');
  const playerO = document.getElementById('playerO');
  const newGameBtn = document.getElementById('newGameBtn');
  const singlePlayerBtn = document.getElementById('singlePlayerBtn');
  const twoPlayerBtn = document.getElementById('twoPlayerBtn');
  const difficultySelect = document.getElementById('difficulty');

  function initializeBoard() {
    grid.innerHTML = '';
    board.forEach((_, i) => {
      const cell = document.createElement('div');
      cell.className =
        'cell bg-gray-100 rounded-lg flex items-center justify-center text-5xl font-bold cursor-pointer hover:bg-gray-200';
      cell.dataset.index = i;
      cell.addEventListener('click', () => handleCellClick(i));
      grid.appendChild(cell);
    });
  }

  function handleCellClick(index) {
    if (!gameActive || board[index] !== '') return;
    makeMove(index, currentPlayer);

    if (gameActive && gameMode === 'singlePlayer' && currentPlayer === 'O') {
      setTimeout(() => {
        const aiMove = getAIMove();
        makeMove(aiMove, 'O');
      }, 500);
    }
  }

  function makeMove(index, player) {
    board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.innerHTML =
      player === 'X'
        ? '<i class="fas fa-times text-red-500"></i>'
        : '<i class="far fa-circle text-blue-500"></i>';
    cell.classList.add('occupied');

    const result = checkGameResult();
    if (result) handleGameEnd(result);
    else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
    }
  }

  function checkGameResult() {
    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of wins) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        winningCells = pattern;
        return { winner: board[a], pattern };
      }
    }

    if (!board.includes('')) return { winner: null };
    return null;
  }

  function handleGameEnd(result) {
    gameActive = false;
    if (result.winner) {
      winningCells.forEach(i => {
        const cell = document.querySelector(`[data-index="${i}"]`);
        cell.classList.add('winning-cell');
      });
      statusText.textContent =
        result.winner === 'X'
          ? gameMode === 'singlePlayer' ? 'You win!' : 'Player X wins!'
          : gameMode === 'singlePlayer' ? 'AI wins!' : 'Player O wins!';
      statusText.className = 'text-xl font-semibold text-green-600';
    } else {
      statusText.textContent = 'Game ended in a tie!';
      statusText.className = 'text-xl font-semibold text-yellow-600';
    }
  }

  function updateStatus() {
    if (currentPlayer === 'X') {
      statusText.textContent = gameMode === 'singlePlayer' ? 'Your turn (X)' : "Player X's turn";
      statusText.className = 'text-xl font-semibold text-red-500';
      playerX.classList.remove('opacity-50');
      playerO.classList.add('opacity-50');
    } else {
      statusText.textContent = gameMode === 'singlePlayer' ? 'AI thinking...' : "Player O's turn";
      statusText.className = 'text-xl font-semibold text-blue-500';
      playerX.classList.add('opacity-50');
      playerO.classList.remove('opacity-50');
    }
  }

  function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    winningCells = [];
    initializeBoard();
    updateStatus();

    if (gameMode === 'singlePlayer' && currentPlayer === 'O') {
      setTimeout(() => makeMove(getAIMove(), 'O'), 500);
    }
  }

  function getAIMove() {
    if (difficulty === 'easy') return getRandomMove();
    if (difficulty === 'medium' && Math.random() < 0.5) return getRandomMove();

    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        if (checkGameResult()?.winner === 'O') {
          board[i] = '';
          return i;
        }
        board[i] = '';
      }
    }

    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        if (checkGameResult()?.winner === 'X') {
          board[i] = '';
          return i;
        }
        board[i] = '';
      }
    }

    if (board[4] === '') return 4;

    const corners = [0, 2, 6, 8].filter(i => board[i] === '');
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

    const edges = [1, 3, 5, 7].filter(i => board[i] === '');
    if (edges.length) return edges[Math.floor(Math.random() * edges.length)];

    return getRandomMove();
  }

  function getRandomMove() {
    const available = board.map((v, i) => (v === '' ? i : null)).filter(v => v !== null);
    return available[Math.floor(Math.random() * available.length)];
  }

  newGameBtn.addEventListener('click', resetGame);

  singlePlayerBtn.addEventListener('click', () => {
    gameMode = 'singlePlayer';
    singlePlayerBtn.classList.add('active');
    twoPlayerBtn.classList.remove('active');
    resetGame();
  });

  twoPlayerBtn.addEventListener('click', () => {
    gameMode = 'twoPlayer';
    twoPlayerBtn.classList.add('active');
    singlePlayerBtn.classList.remove('active');
    resetGame();
  });

  difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
    if (gameMode === 'singlePlayer') resetGame();
  });

  initializeBoard();
  updateStatus();
});
