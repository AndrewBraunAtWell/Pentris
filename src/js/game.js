// Pentris Game - Basic Implementation
class PentrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextPiece');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // Game settings
        this.GRID_WIDTH = 10;
        this.GRID_HEIGHT = 20;
        this.CELL_SIZE = 30;
        this.COLORS = [
            '#000000', // Empty
            '#FF0000', // Red
            '#00FF00', // Green
            '#0000FF', // Blue
            '#FFFF00', // Yellow
            '#FF00FF', // Magenta
            '#00FFFF', // Cyan
            '#FFA500', // Orange
            '#800080', // Purple
            '#FFC0CB', // Pink
            '#A52A2A', // Brown
            '#808080', // Gray
            '#008000'  // Dark Green
        ];
        
        // Game state
        this.grid = this.createGrid();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameRunning = false;
        this.isPaused = false;
        this.dropTimer = 0;
        this.dropInterval = 1000; // 1 second
        this.gameOverScreen = false;
        
        // Pentomino shapes (all 17 pieces including mirrors) - carefully defined
        this.pentominoes = {
            'I': [
                [1, 1, 1, 1, 1]
            ],
            'L': [
                [1, 0, 0, 0],
                [1, 1, 1, 1]
            ],
            'L_MIRROR': [
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            'N': [
                [1, 1, 0, 0],
                [0, 1, 1, 1]
            ],
            'N_MIRROR': [
                [0, 0, 1, 1],
                [1, 1, 1, 0]
            ],
            'P': [
                [1, 1],
                [1, 1],
                [1, 0]
            ],
            'P_MIRROR': [
                [1, 1],
                [1, 1],
                [0, 1]
            ],
            'Y': [
                [0, 1, 0, 0],
                [1, 1, 1, 1]
            ],
            'Y_MIRROR': [
                [0, 0, 1, 0],
                [1, 1, 1, 1]
            ],
            'T': [
                [1, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            'U': [
                [1, 0, 1],
                [1, 1, 1]
            ],
            'V': [
                [1, 0, 0],
                [1, 0, 0],
                [1, 1, 1]
            ],
            'W': [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            'X': [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            'Z': [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            'F': [
                [0, 1, 1],
                [1, 1, 0],
                [0, 1, 0]
            ],
            'F_MIRROR': [
                [1, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateNextPiece();
        this.spawnNewPiece();
        this.gameRunning = true;
        this.gameLoop();
    }
    
    createGrid() {
        return Array(this.GRID_HEIGHT).fill().map(() => Array(this.GRID_WIDTH).fill(0));
    }
    
    getPieceWidth(shape) {
        let maxWidth = 0;
        for (let row of shape) {
            maxWidth = Math.max(maxWidth, row.length);
        }
        return maxWidth;
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOverScreen) {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.restartGame();
                }
                return;
            }
            
            if (!this.gameRunning || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
    }
    
    generateNextPiece() {
        const shapes = Object.keys(this.pentominoes);
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        const colorIndex = Math.floor(Math.random() * (this.COLORS.length - 1)) + 1;
        
        this.nextPiece = {
            shape: this.pentominoes[randomShape],
            color: colorIndex,
            x: 0,
            y: 0
        };
    }
    
    spawnNewPiece() {
        if (!this.nextPiece) this.generateNextPiece();
        
        // Calculate the actual width of the piece
        const pieceWidth = this.getPieceWidth(this.nextPiece.shape);
        
        this.currentPiece = {
            shape: this.nextPiece.shape,
            color: this.nextPiece.color,
            x: Math.floor(this.GRID_WIDTH / 2) - Math.floor(pieceWidth / 2),
            y: 0
        };
        
        this.generateNextPiece();
        
        // Check for game over
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y)) {
            this.gameOver();
        }
    }
    
    checkCollision(x, y, shape = this.currentPiece.shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.GRID_WIDTH || newY >= this.GRID_HEIGHT) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.grid[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (!this.checkCollision(newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        return rotated;
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {
            // Keep dropping until collision
        }
        this.placePiece();
    }
    
    placePiece() {
        const shape = this.currentPiece.shape;
        const color = this.currentPiece.color;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = this.currentPiece.x + col;
                    const y = this.currentPiece.y + row;
                    if (y >= 0) {
                        this.grid[y][x] = color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnNewPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let row = this.GRID_HEIGHT - 1; row >= 0; row--) {
            if (this.grid[row].every(cell => cell !== 0)) {
                this.grid.splice(row, 1);
                this.grid.unshift(Array(this.GRID_WIDTH).fill(0));
                linesCleared++;
                row++; // Check the same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            this.updateUI();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameOverScreen = true;
    }
    
    restartGame() {
        this.grid = this.createGrid();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameRunning = true;
        this.gameOverScreen = false;
        this.isPaused = false;
        this.dropTimer = 0;
        this.dropInterval = 1000;
        this.generateNextPiece();
        this.spawnNewPiece();
        this.updateUI();
    }
    
    update(deltaTime) {
        if (!this.gameRunning || this.isPaused) return;
        
        this.dropTimer += deltaTime;
        if (this.dropTimer >= this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.placePiece();
            }
            this.dropTimer = 0;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameOverScreen) {
            this.drawGameOverScreen();
            return;
        }
        
        // Draw grid
        this.drawGrid();
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece, this.ctx);
        }
        
        // Draw next piece
        this.drawNextPiece();
        
        // Draw pause overlay
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
    
    drawGameOverScreen() {
        // Dark overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Futuristic "Game Over" text
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 32px "Orbitron", "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, 60);
        
        // Add glitch effect to the text
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillText('G▄ME ▄VER', this.canvas.width / 2 + 2, 62);
        
        // Score display
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px "Orbitron", "Courier New", monospace';
        this.ctx.fillText(`FINAL SCORE: ${this.score}`, this.canvas.width / 2, 90);
        this.ctx.fillText(`LEVEL: ${this.level}`, this.canvas.width / 2, 110);
        this.ctx.fillText(`LINES: ${this.lines}`, this.canvas.width / 2, 130);
        
        // Jeff Goldblum anime-style art
        this.drawAnimeJeffGoldblum();
        
        // Jurassic Park quote (properly wrapped)
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = '11px "Orbitron", "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("Your scientists were so preoccupied", this.canvas.width / 2, 440);
        this.ctx.fillText("with whether or not they could,", this.canvas.width / 2, 455);
        this.ctx.fillText("they didn't stop to think if they should.", this.canvas.width / 2, 470);
        this.ctx.fillText("- Dr. Ian Malcolm", this.canvas.width / 2, 490);
        
        // Restart button
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.canvas.width / 2 - 60, 510, 120, 35);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '16px "Orbitron", "Courier New", monospace';
        this.ctx.fillText('REPLAY', this.canvas.width / 2, 532);
        
        // Instructions
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '12px "Orbitron", "Courier New", monospace';
        this.ctx.fillText('Press ENTER or SPACE', this.canvas.width / 2, 565);
    }
    
    drawAnimeJeffGoldblum() {
        // Anime-style Jeff Goldblum drawing
        const centerX = this.canvas.width / 2;
        const centerY = 280;
        
        // Save context for transformations
        this.ctx.save();
        
        // Head shape (anime style - more elongated)
        this.ctx.fillStyle = '#FDBCB4';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY - 20, 45, 55, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.strokeStyle = '#E8A282';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Iconic curly hair (anime style)
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        // Left curls
        this.ctx.arc(centerX - 35, centerY - 60, 15, 0, 2 * Math.PI);
        this.ctx.arc(centerX - 20, centerY - 70, 12, 0, 2 * Math.PI);
        this.ctx.arc(centerX - 5, centerY - 75, 10, 0, 2 * Math.PI);
        // Right curls
        this.ctx.arc(centerX + 5, centerY - 75, 10, 0, 2 * Math.PI);
        this.ctx.arc(centerX + 20, centerY - 70, 12, 0, 2 * Math.PI);
        this.ctx.arc(centerX + 35, centerY - 60, 15, 0, 2 * Math.PI);
        // Top curls
        this.ctx.arc(centerX - 10, centerY - 65, 8, 0, 2 * Math.PI);
        this.ctx.arc(centerX + 10, centerY - 65, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Eyebrows (anime style - expressive)
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 25, centerY - 35);
        this.ctx.quadraticCurveTo(centerX - 15, centerY - 40, centerX - 5, centerY - 35);
        this.ctx.moveTo(centerX + 5, centerY - 35);
        this.ctx.quadraticCurveTo(centerX + 15, centerY - 40, centerX + 25, centerY - 35);
        this.ctx.stroke();
        
        // Iconic glasses (anime style)
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
        // Left lens
        this.ctx.beginPath();
        this.ctx.arc(centerX - 15, centerY - 25, 12, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        // Right lens
        this.ctx.beginPath();
        this.ctx.arc(centerX + 15, centerY - 25, 12, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        // Bridge
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 3, centerY - 25);
        this.ctx.lineTo(centerX + 3, centerY - 25);
        this.ctx.stroke();
        
        // Eyes (anime style - large and expressive)
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.ellipse(centerX - 15, centerY - 25, 8, 6, 0, 0, 2 * Math.PI);
        this.ctx.ellipse(centerX + 15, centerY - 25, 8, 6, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Eye highlights (anime style)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 12, centerY - 27, 2, 0, 2 * Math.PI);
        this.ctx.arc(centerX + 18, centerY - 27, 2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Nose (anime style - subtle)
        this.ctx.strokeStyle = '#E8A282';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 10);
        this.ctx.lineTo(centerX - 2, centerY - 5);
        this.ctx.moveTo(centerX, centerY - 10);
        this.ctx.lineTo(centerX + 2, centerY - 5);
        this.ctx.stroke();
        
        // Signature Jeff Goldblum smirk (anime style)
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 12, centerY + 5);
        this.ctx.quadraticCurveTo(centerX, centerY + 10, centerX + 12, centerY + 5);
        this.ctx.stroke();
        
        // Jawline definition (anime style)
        this.ctx.strokeStyle = '#E8A282';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 35, centerY + 15);
        this.ctx.quadraticCurveTo(centerX, centerY + 30, centerX + 35, centerY + 15);
        this.ctx.stroke();
        
        // Neck
        this.ctx.fillStyle = '#FDBCB4';
        this.ctx.fillRect(centerX - 15, centerY + 25, 30, 20);
        
        // Shirt collar (anime style with shading)
        const gradient = this.ctx.createLinearGradient(centerX - 40, centerY + 45, centerX + 40, centerY + 85);
        gradient.addColorStop(0, '#000080');
        gradient.addColorStop(1, '#000040');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(centerX - 40, centerY + 45, 80, 40);
        
        // Shirt details (anime style highlights)
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(centerX - 35, centerY + 50, 70, 5);
        this.ctx.fillRect(centerX - 30, centerY + 60, 60, 3);
        
        // Anime-style sparkle effects around the character
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 60, centerY - 40, 2, 0, 2 * Math.PI);
        this.ctx.arc(centerX + 55, centerY - 30, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(centerX - 50, centerY + 20, 1, 0, 2 * Math.PI);
        this.ctx.arc(centerX + 45, centerY + 10, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Anime-style star sparkles
        this.drawAnimeStar(centerX - 65, centerY - 45, 3);
        this.drawAnimeStar(centerX + 60, centerY - 35, 2);
        this.drawAnimeStar(centerX - 55, centerY + 25, 2.5);
        
        // Restore context
        this.ctx.restore();
    }
    
    drawAnimeStar(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            this.ctx.lineTo(Math.cos((i * 2 * Math.PI) / 5) * size, Math.sin((i * 2 * Math.PI) / 5) * size);
            this.ctx.lineTo(Math.cos(((i + 0.5) * 2 * Math.PI) / 5) * size * 0.5, Math.sin(((i + 0.5) * 2 * Math.PI) / 5) * size * 0.5);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }
    
    drawPixelArt(x, y, pixelSize, pattern) {
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    this.ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
    
    drawGrid() {
        // Draw grid background and borders
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        // // Draw vertical lines
        for (let col = 0; col <= this.GRID_WIDTH; col++) {
            this.ctx.beginPath();
            this.ctx.moveTo(col * this.CELL_SIZE, 0);
            this.ctx.lineTo(col * this.CELL_SIZE, this.GRID_HEIGHT * this.CELL_SIZE);
            this.ctx.stroke();
        }
        
        // // Draw horizontal lines
        for (let row = 0; row <= this.GRID_HEIGHT; row++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, row * this.CELL_SIZE);
            this.ctx.lineTo(this.GRID_WIDTH * this.CELL_SIZE, row * this.CELL_SIZE);
            this.ctx.stroke();
        }
        
        // Draw filled cells
        for (let row = 0; row < this.GRID_HEIGHT; row++) {
            for (let col = 0; col < this.GRID_WIDTH; col++) {
                const color = this.grid[row][col];
                if (color) {
                    this.ctx.fillStyle = this.COLORS[color];
                    this.ctx.fillRect(
                        col * this.CELL_SIZE,
                        row * this.CELL_SIZE,
                        this.CELL_SIZE,
                        this.CELL_SIZE
                    );
                    this.ctx.strokeStyle = '#333';
                    this.ctx.strokeRect(
                        col * this.CELL_SIZE,
                        row * this.CELL_SIZE,
                        this.CELL_SIZE,
                        this.CELL_SIZE
                    );
                }
            }
        }
    }
    
    drawPiece(piece, context) {
        const shape = piece.shape;
        const color = this.COLORS[piece.color];
        
        context.fillStyle = color;
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = (piece.x + col) * this.CELL_SIZE;
                    const y = (piece.y + row) * this.CELL_SIZE;
                    context.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                    context.strokeStyle = '#333';
                    context.strokeRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                }
            }
        }
    }
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#111';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const cellSize = 15;
            const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * cellSize) / 2;
            const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * cellSize) / 2;
            
            this.nextCtx.fillStyle = this.COLORS[this.nextPiece.color];
            for (let row = 0; row < this.nextPiece.shape.length; row++) {
                for (let col = 0; col < this.nextPiece.shape[row].length; col++) {
                    if (this.nextPiece.shape[row][col]) {
                        const x = offsetX + col * cellSize;
                        const y = offsetY + row * cellSize;
                        this.nextCtx.fillRect(x, y, cellSize, cellSize);
                        this.nextCtx.strokeStyle = '#333';
                        this.nextCtx.strokeRect(x, y, cellSize, cellSize);
                    }
                }
            }
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    gameLoop() {
        let lastTime = 0;
        
        const loop = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;
            
            this.update(deltaTime);
            this.render();
            
            if (this.gameRunning || this.gameOverScreen) {
                requestAnimationFrame(loop);
            }
        };
        
        requestAnimationFrame(loop);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PentrisGame();
});
