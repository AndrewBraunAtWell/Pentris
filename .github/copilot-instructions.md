<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Pentris Game Development Instructions

This is a desktop game development project using Electron, TypeScript, and Canvas/PixiJS for rendering. The game is a Tetris-inspired puzzle game using pentominoes (5-square shapes) instead of traditional tetrominoes.

## Project Structure
- `main.js`: Electron main process
- `src/index.html`: Game UI and layout
- `src/js/game.js`: Core game logic
- `src/assets/`: Game assets (images, sounds, icons)

## Key Technologies
- **Electron**: Desktop application framework
- **TypeScript/JavaScript**: Primary language
- **Canvas API**: 2D rendering
- **PixiJS**: High-performance 2D graphics (available)
- **Howler.js**: Audio management (available)

## Game Features
- 12 standard pentomino shapes (I, L, N, P, Y, T, U, V, W, X, Z, F)
- Line clearing mechanics
- Score and level progression
- Smooth 60fps gameplay
- Keyboard controls (arrows, space, P for pause)

## Development Guidelines
- Follow modern JavaScript/TypeScript practices
- Use ES6+ features
- Maintain 60fps performance
- Implement proper error handling
- Follow object-oriented design patterns
- Use Canvas API for efficient 2D rendering
- Keep game logic separate from rendering

## Build Commands
- `npm start`: Run the game in development mode
- `npm run build`: Build desktop executables
- `npm run dev`: Development mode with live reload
