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
  'fontSize': '70px',
  'color': colors.white,
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

function getHasWinningPlayer(boardSquares, playerMark) {
  // All the possible winning combinations of indexes
  // In order to win, a player needs marks adhering one of these configurations
  const winningIndexes = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6],
  ]
  
  // Tracks whether the player has a winning index configuration
  let output = false

  // TODO: Investigate using more efficient JS array functions below
 
  // Iterate over each winning index combination
  winningIndexes.forEach((indexArr) => {
    // Tracks whether the player has the current index combination
    let hasWinningIndexes = true

    // Iterate over index in this combination
    indexArr.forEach((index) => {
      if (
        // Skip if we already know this is not a winner
        hasWinningIndexes &&
        // This is not a winning combination
        // If any square from this combination does not contain the current player's mark
        boardSquares[index].playerMark !== playerMark
      ) {
        // Track that this is not a winning combination
        hasWinningIndexes = false
      }
    })
    
    // Track that this is a winner
    if (hasWinningIndexes === true) {
      output = true
    }
  })
  
  return output
}

function getIsDraw(boardSquares) {
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

  const setWinningState = (currentPlayer) => {
    setWinningPlayer(currentPlayer)
    setCurrentPlayer(strings.none)
    setBoardStyle(getBoardStyle({ borderColor: colors.blue }))
  }

  const setDrawState = () => {
    setWinningPlayer(strings.draw)
    setCurrentPlayer(strings.none)
    setBoardStyle(getBoardStyle({ borderColor: colors.red }))
  }

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
    const hasWinningPlayer = getHasWinningPlayer(boardSquares, currentPlayer)

    // Set the board to an end-game state if the current player won
    if (hasWinningPlayer) {
      setWinningState(currentPlayer)
      return
    }
    
    // Check if the game is a draw
    const isDraw = getIsDraw(boardSquares)

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

