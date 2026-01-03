// Game State
let gameState = {
    active: false,
    grid: [], // 25 cells, true = mine, false = safe
    revealed: [],
    attempts: 10,
    roundGold: 0,
    totalGold: 10000, // Starting bonus
    displayedGold: 10000, // For animation
    hasAutoPick: false
};

const GRID_SIZE = 25;
const MINES_COUNT = 5; // Simple difficulty

const minesGrid = document.getElementById('mines-grid');
const balanceDisplay = document.getElementById('balance-amount');
const attemptsDisplay = document.getElementById('attempts-val');
const btnPlay = document.getElementById('btn-play');
const btnCashout = document.getElementById('btn-cashout');
const flashOverlay = document.getElementById('flash-overlay');
const appContainer = document.getElementById('app');
const timerDisplay = document.getElementById('timer-display');
const btnAutoPick = document.getElementById('btn-auto-pick');

function loadState() {
    const saved = localStorage.getItem('mines_game_state');
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState.totalGold = parsed.totalGold || 10000;
        gameState.displayedGold = gameState.totalGold;
        gameState.attempts = parsed.attempts !== undefined ? parsed.attempts : 10;
        gameState.hasAutoPick = !!parsed.hasAutoPick;
    }
}

function saveState() {
    localStorage.setItem('mines_game_state', JSON.stringify({
        totalGold: gameState.totalGold,
        attempts: gameState.attempts,
        hasAutoPick: gameState.hasAutoPick
    }));
}

function initGame() {
    loadState();
    renderGrid();
    updateUI();
    
    btnPlay.addEventListener('click', startGame);
    btnCashout.addEventListener('click', cashout);
    if (btnAutoPick) {
        btnAutoPick.addEventListener('click', handleAutoPick);
    }

    // Start timer interval
    setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (gameState.attempts > 0) {
        timerDisplay.classList.remove('visible');
        return;
    }

    timerDisplay.classList.add('visible');
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0); // Next midnight UTC
    
    const diff = tomorrow - now;
    
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    
    timerDisplay.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Smooth number animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function for smoother feel
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        
        gameState.displayedGold = Math.floor(progress * (end - start) + start);
        obj.textContent = gameState.displayedGold.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            gameState.displayedGold = end;
            obj.textContent = end.toLocaleString();
        }
    };
    window.requestAnimationFrame(step);
}

function updateBalance(newTotal) {
    if (newTotal === gameState.displayedGold) return;
    animateValue(balanceDisplay, gameState.displayedGold, newTotal, 800);
    gameState.totalGold = newTotal;
    saveState();
}

function renderGrid() {
    minesGrid.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        minesGrid.appendChild(cell);
    }
}

function startGame() {
    if (gameState.attempts <= 0) {
        return;
    }

    gameState.active = true;
    gameState.roundGold = 0;
    gameState.grid = generateGrid();
    gameState.revealed = new Array(GRID_SIZE).fill(false);
    
    gameState.attempts--;
    saveState();
    
    // Reset Grid Visuals
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.className = 'grid-cell';
        cell.innerHTML = '';
        cell.style.opacity = '1';
    });

    updateUI();
}

function generateGrid() {
    const grid = new Array(GRID_SIZE).fill(false);
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
        const idx = Math.floor(Math.random() * GRID_SIZE);
        if (!grid[idx]) {
            grid[idx] = true;
            minesPlaced++;
        }
    }
    return grid;
}

function handleCellClick(index) {
    if (!gameState.active || gameState.revealed[index]) return;

    const cell = minesGrid.children[index];
    gameState.revealed[index] = true;
    cell.classList.add('revealed', 'reveal-anim');

    if (gameState.grid[index]) {
        // HIT MINE
        cell.classList.add('mine');
        cell.innerHTML = '💣';
        triggerMineEffect();
        gameOver(false);
    } else {
        // SAFE
        cell.classList.add('safe');
        cell.innerHTML = '⭐';
        gameState.roundGold += 10;
        updateUI();
        
        // Check win condition (all safe cells revealed)
        const safeCellsCount = GRID_SIZE - MINES_COUNT;
        const revealedSafeCount = gameState.revealed.filter((r, i) => r && !gameState.grid[i]).length;
        
        if (revealedSafeCount === safeCellsCount) {
            cashout();
        }
    }
}

function triggerMineEffect() {
    // Red flash
    flashOverlay.classList.add('flash-active');
    setTimeout(() => {
        flashOverlay.classList.remove('flash-active');
    }, 100);

    // Screen Shake
    appContainer.classList.add('shake-screen');
    setTimeout(() => {
        appContainer.classList.remove('shake-screen');
    }, 500);

    // Bomb Animation: Clear field
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach((cell, i) => {
        setTimeout(() => {
            cell.style.transition = 'all 0.5s ease-out';
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.5) rotate(20deg)';
        }, i * 20);
    });

    // Vibrate
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function cashout() {
    if (!gameState.active) return;
    const newTotal = gameState.totalGold + gameState.roundGold;
    updateBalance(newTotal); // Trigger animation
    gameOver(true);
}

function gameOver(win) {
    gameState.active = false;
    gameState.roundGold = 0;
    
    if (!win) {
        // Reveal all mines
        gameState.grid.forEach((isMine, idx) => {
            if (isMine) {
                const cell = minesGrid.children[idx];
                cell.classList.add('revealed', 'mine', 'shake-anim');
                cell.innerHTML = '💣';
            }
        });
    } else {
        // Win animation/sound could go here
    }

    updateUI();
}

function updateUI() {
    if (gameState.active) {
        btnPlay.classList.add('hidden');
        btnCashout.classList.remove('hidden');
        btnCashout.textContent = `${t('cashout')} (+${gameState.roundGold})`;
        
        minesGrid.classList.remove('hidden', 'grid-hidden');
        timerDisplay.classList.remove('visible');
        
        if (gameState.hasAutoPick && btnAutoPick) {
            btnAutoPick.classList.remove('hidden');
        }
    } else {
        btnPlay.classList.remove('hidden');
        btnCashout.classList.add('hidden');
        if (btnAutoPick) btnAutoPick.classList.add('hidden');
        
        if (gameState.attempts <= 0) {
            btnPlay.classList.add('disabled');
            btnPlay.style.opacity = '0.5';
            btnPlay.style.cursor = 'not-allowed';
            
            if (!minesGrid.classList.contains('grid-hidden')) {
                minesGrid.classList.add('grid-hidden');
                setTimeout(() => {
                    minesGrid.style.display = 'none';
                    timerDisplay.style.display = 'block';
                    setTimeout(() => timerDisplay.classList.add('visible'), 50);
                }, 500);
            } else {
                minesGrid.style.display = 'none';
                timerDisplay.style.display = 'block';
                timerDisplay.classList.add('visible');
            }
        } else {
            btnPlay.classList.remove('disabled');
            btnPlay.style.opacity = '1';
            btnPlay.style.cursor = 'pointer';
            
            minesGrid.style.display = 'grid';
            minesGrid.classList.remove('grid-hidden');
            timerDisplay.classList.remove('visible');
            timerDisplay.style.display = 'none';
        }
    }
    
    attemptsDisplay.textContent = gameState.attempts;
    updateTimer();
}

// Boost buying logic
function buyBoost(cost) {
    if (gameState.totalGold >= cost) {
        const newTotal = gameState.totalGold - cost;
        
        // Handle specific boosts
        if (cost === 7000) {
            gameState.hasAutoPick = true;
        } else if (cost === 3000) {
            gameState.attempts += 5;
        }
        
        updateBalance(newTotal);
        saveState();
        updateUI();
        // Visual feedback
        alert("Boost Purchased!"); // Replace with custom toast later
    } else {
        alert(t('low_balance'));
    }
}

async function handleAutoPick() {
    if (!gameState.active || !gameState.hasAutoPick) return;
    
    // Pick 15 safe cells with 100% win rate logic
    // We already have the grid generated, so we just pick safe ones
    const safeIndices = [];
    gameState.grid.forEach((isMine, idx) => {
        if (!isMine) safeIndices.push(idx);
    });

    // Shuffle and pick 15
    const toPick = safeIndices.sort(() => 0.5 - Math.random()).slice(0, 15);
    
    for (const index of toPick) {
        if (gameState.active) {
            handleCellClick(index);
            await new Promise(r => setTimeout(r, 200)); // Delay for visual effect
        }
    }
}

function handleTGSubscribe() {
    const btn = document.getElementById('btn-tg-subscribe');
    if (btn.classList.contains('claimed')) return;

    window.open('https://t.me/stand2tapinfo', '_blank');
    
    // In a real app, you'd verify subscription. Here we just reward after click.
    setTimeout(() => {
        const reward = 5000;
        const newTotal = gameState.totalGold + reward;
        updateBalance(newTotal);
        
        btn.classList.add('claimed');
        btn.textContent = 'Claimed';
        btn.disabled = true;
        
        alert(t('claim_success'));
    }, 2000);
}
