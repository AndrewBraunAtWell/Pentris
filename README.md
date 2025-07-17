# Pentris 🎮

A Tetris-inspired puzzle game with a unique twist - using **pentominoes** (5-square shapes) instead of traditional tetrominoes (4-square shapes). Built as a cross-platform desktop application using Electron.

## 🎯 Game Features

- **17 Unique Pentomino Shapes**: All standard pentomino pieces (I, L, N, P, Y, T, U, V, W, X, Z, F) plus 5 mirror pieces
- **Classic Tetris Mechanics**: Line clearing, increasing difficulty, score system
- **Smooth 60fps Gameplay**: Responsive controls and fluid animations
- **Modern UI**: Clean interface with score tracking and next piece preview
- **Desktop Native**: Cross-platform support for Windows, Mac, and Linux

## 🎮 Controls

- **Arrow Keys**: Move and rotate pieces
  - `←` / `→`: Move left/right
  - `↑`: Rotate piece
  - `↓`: Soft drop
- **Space**: Hard drop (instant drop)
- **P**: Pause/Resume game

## 🚀 Technology Stack

- **Framework**: Electron (desktop app framework)
- **Language**: JavaScript/TypeScript
- **Rendering**: HTML5 Canvas
- **Graphics**: PixiJS (high-performance 2D rendering)
- **Audio**: Howler.js (spatial audio)
- **Build**: Electron Builder (cross-platform packaging)

## 🛠️ Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/pentris.git
cd pentris

# Install dependencies
npm install

# Run in development mode
npm start

# Or run with development tools
npm run dev
```

### Building for Distribution
```bash
# Build for all platforms
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## 📁 Project Structure

```
pentris/
├── main.js                 # Electron main process
├── src/
│   ├── index.html          # Game UI and layout
│   ├── js/
│   │   └── game.js         # Core game logic
│   └── assets/             # Game assets
├── .github/
│   └── copilot-instructions.md
├── package.json
└── README.md
```

## 🎲 About Pentominoes

Pentominoes are geometric shapes composed of 5 unit squares, connected edge-to-edge. There are 12 distinct pentomino shapes, each named after a letter they resemble:

- **I**: Straight line (5 squares)
- **L**: L-shaped piece
- **N**: N-shaped piece
- **P**: P-shaped piece
- **Y**: Y-shaped piece
- **T**: T-shaped piece
- **U**: U-shaped piece
- **V**: V-shaped piece
- **W**: W-shaped piece
- **X**: Plus/cross shape
- **Z**: Z-shaped piece
- **F**: F-shaped piece

## 🎯 Scoring System

- **Single Line**: 100 × Level
- **Multiple Lines**: Bonus multiplier for clearing multiple lines
- **Level Progression**: Every 10 lines cleared increases level
- **Speed Increase**: Higher levels = faster piece drops

## 🔧 VS Code Setup

Recommended extensions for development:
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Debugger for Chrome**: Debugging support
- **Live Server**: Development server
- **TypeScript Hero**: TypeScript support

## 📝 Development Notes

- Game runs at 60fps with smooth piece movement
- Canvas-based rendering for optimal performance
- Modular code structure for easy feature additions
- Electron packaging for native desktop experience
- Cross-platform compatibility (Windows, Mac, Linux)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Game Screenshots

*Screenshots will be added once the game is fully developed*

## 🚀 Roadmap

- [ ] Add sound effects and background music
- [ ] Implement particle effects for line clearing
- [ ] Add themes and customizable colors
- [ ] High score persistence
- [ ] Multiplayer mode
- [ ] Additional game modes (time attack, puzzle mode)
- [ ] Accessibility features
- [ ] Steam integration

---

**Happy Gaming!** 🎮✨
