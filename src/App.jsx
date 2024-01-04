import { useState } from 'react'
import './App.css'

// Hex Colors
const colors = {
  white: '#BDBDBD',
  black: '#212121',
  yellow: '#FFD600',
  green: '#00C853',
  orange: '#FF6D00',
  red: '#D50000',
  blue: '#0091EA',
}

// Magic Strings
const strings = {
  x_mark: 'X',
  o_mark: 'O',
  none: 'None',
  draw: 'Draw!'
}

const rowStyle = {
  'display': 'flex',
  'flexWrap': 'wrap',
}

const squareStyle = {
  'width': '120px',
  'height': '120px',
  'backgroundColor': colors.white,
  'color': colors.black,
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '80px',
  'userSelect': 'none',
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column',
  'border': `3px ${colors.white} solid`,
  'padding': '36px 80px',
}

const instructionsStyle = {
  'marginBottom': '36px',
  'fontWeight': 'bold',
  'fontSize': '42px',
  'color': colors.yellow,
}

const buttonStyle = {
  'marginTop': '36px',
  'height': '40px',
  'backgroundColor': colors.orange,
  'color': 'white',
  'fontSize': '16px',
}

const titleStyle = {
  'fontSize': '72px',
  'fontWeight': '300',
  'color': colors.blue,
}

// Dynamically returns an object for styling the board
// Border color defaults to green
// A custom border color can be passed as a prop
function getBoardStyle({ borderColor = colors.green }) {
  return {
    'width': '385px',
    'alignItems': 'center',
    'justifyContent': 'center',
    'display': 'flex',
    'flexDirection': 'column',
    'border': `8px ${borderColor} solid`,
  }
}

function Square( { props, onMarkSquare } ) {
  return (
    <div
      className="square"
      style={squareStyle}
      onClick={() => { 
        onMarkSquare(props.index, props.playerMark)
      }}
    >
      { props.playerMark }
    </div>
  )
}

function checkHasWinningPlayer(boardSquares, playerMark) {
  // All the possible winning combinations of indexes
  // In order to win, a player needs marks matching one of these configurations
  const winningIndexCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  // Builds a string representation of a winning combination
  // Example: Player O's winning combination string is 'OOO'
  const buildWinningString = (playerMark) => {
    return playerMark + playerMark + playerMark
  }
  
  // Builds a string representation of the winning-index combination we're checking
  // Example: If the top row of the board is marked ['X', 'O', 'X'], the string representation is 'XOX'
  const buildStringToTest = (boardSquares, indexes, playerMark) => {
    const playerMarks = Array.from({ length: 3 }, (value, count) => {
      const winningIndex = indexes[count]
      return boardSquares[winningIndex].playerMark
    })
    
    // Join the resulting array as a string without commas
    return playerMarks.join('')
  }
  
  // Build the winning string up front for efficiency
  // No need to rebuild this on each iteration of `some`
  const winningString = buildWinningString(playerMark)
  
  // Return whether any of the winning index combinations are marked by the current player
  // This `some` approach is significantly more efficient than checking via a nested loop
  return winningIndexCombinations.some((indexes) => {
    const stringToTest = buildStringToTest(boardSquares, indexes, playerMark)

    return stringToTest === winningString
  })
}

function checkIsDraw(boardSquares) {
  const isEmptySquare = (square) => square.playerMark === ''
  
  // If any squares are empty
  // This is not a draw
  return !boardSquares.some(isEmptySquare)
}

// Returns an array of 9 objects with integer-based indexes
// Initializes to a blank state, with no player marks
function getInitialBoardState() {
  return Array.from({ length: 9 }, (value, index) => {
    return {
      index: index,
      playerMark: '',
    }
  })
}

function Board() {
  const [currentPlayer, setCurrentPlayer] = useState(strings.x_mark)
  const [winningPlayer, setWinningPlayer] = useState(strings.none)
  const [boardSquares, setBoardState] = useState(getInitialBoardState())
  const [boardStyle, setBoardStyle] = useState(getBoardStyle({}))

  // Re-initializes the board to a blank state
  const resetBoardState = () => {
    setBoardState(getInitialBoardState())
    setCurrentPlayer(strings.x_mark)
    setWinningPlayer(strings.none)
    setBoardStyle(getBoardStyle({}))
  }
  
  // Finalizes the board to a winning state
  const setWinningState = (currentPlayer) => {
    setWinningPlayer(currentPlayer)
    setCurrentPlayer(strings.none)
    setBoardStyle(getBoardStyle({ borderColor: colors.blue }))
  }

  // Finalizes the board to a draw state
  const setDrawState = () => {
    setWinningPlayer(strings.draw)
    setCurrentPlayer(strings.none)
    setBoardStyle(getBoardStyle({ borderColor: colors.red }))
  }

  // Switches to the other player's turn
  const alternateCurrentPlayer = () => {
    if (currentPlayer === strings.x_mark) {
      setCurrentPlayer(strings.o_mark)
    } else {
      setCurrentPlayer(strings.x_mark)
    }
  }

  // Called whenever a player marks a square
  const handleMarkSquare = (index) => {
    // Ensure one player cannot override the other player's mark
    if (!!boardSquares[index].playerMark) {
      console.warn(`The square with index ${index} has already been selected by the ${boardSquares[index].playerMark} player.`)
      return
    }
    
    // Ensure no more marks can be made once the game is over
    if (winningPlayer !== strings.none) {
      console.warn(`The game is over, so no more selections can be made.`)
      return
    }
    
    // Mark the player's selected square
    boardSquares[index].playerMark = currentPlayer
    setBoardState(boardSquares)
    
    // Check if the current player won with their last move
    const hasWinningPlayer = checkHasWinningPlayer(boardSquares, currentPlayer)

    // Set the board to an end-game state if the current player won
    if (hasWinningPlayer) {
      setWinningState(currentPlayer)
      return
    }
    
    // Check if the game is a draw
    const isDraw = checkIsDraw(boardSquares)

    // Set the board to a draw state if all squares are marked and there is no winner
    if (isDraw) {
      setDrawState() 
      return
    }
    
    // Now it's the other player's turn
    alternateCurrentPlayer(currentPlayer)
  }

  return (
    <div style={containerStyle} className="gameBoard">
      { winningPlayer === strings.none &&
        <div id="statusArea" className="status" style={instructionsStyle}>
          Next Player: <span>{currentPlayer}</span>
        </div>
      }
      { winningPlayer !== strings.none &&
        <div id="winnerArea" className="winner" style={instructionsStyle}>
          Winner: <span>{winningPlayer}</span>
        </div>
      }
      <div className="board" style={boardStyle}>
        <div className="board-row" style={rowStyle}>
          {boardSquares.map((square) => (
            <Square 
              key={square.index}
              props={square}
              onMarkSquare={handleMarkSquare} />
          ))}
        </div>
      </div>
      <button 
        style={buttonStyle}
        onClick={resetBoardState}>Reset Board
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div style={titleStyle}>
        React Tic-Tac-Toe
      </div>
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <Game />
    </>
  )
}

export default App

