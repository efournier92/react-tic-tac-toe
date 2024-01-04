# React Tic Toe

## Challenge Description

- The goal is to create a functioning [Tic Tac Toe](https://en.wikipedia.org/wiki/Tic-tac-toe) game.
- The game should work as follows:
  - The 1st player places an `X` anywhere on the board by clicking a square.
  - The 2nd player places an `O` on the board.
  - The game continues to alternate the same way after each turn.
- Implement a function to determine if any player won by getting 3 `X`s or 3 `O`s diagonally, horizontally, or vertically.
- If there is a winner, display a message at the top indicating who won.
  - If nobody has yet won, then do not display any message.
- Implement a function to reset the entire game board.
- Ensure one player cannot override the other player's move during the game.

## Noteworthy Logic

- [Algorithm to check for a winner.](https://github.com/efournier92/react-tic-tac-toe/blob/7a9ab06d4019b15dba6298d3b81b57446f61c3e2/src/App.jsx#L98)
- [Game board implementation.](https://github.com/efournier92/react-tic-tac-toe/blob/7a9ab06d4019b15dba6298d3b81b57446f61c3e2/src/App.jsx#L160)
- [Handling when a player marks a square.](https://github.com/efournier92/react-tic-tac-toe/blob/7a9ab06d4019b15dba6298d3b81b57446f61c3e2/src/App.jsx#L198)

## Technologies Utilized

- JavaScript
- React
- Vite

## Demo Screenshots

### Initial State

![Initial State](https://raw.githubusercontent.com/efournier92/react-tic-tac-toe/master/public/screenshots/screenshot_init.png)

### Winner State

![Draw State](https://raw.githubusercontent.com/efournier92/react-tic-tac-toe/master/public/screenshots/screenshot_winner.png)

### Draw State

![Draw State](https://raw.githubusercontent.com/efournier92/react-tic-tac-toe/master/public/screenshots/screenshot_draw.png)

