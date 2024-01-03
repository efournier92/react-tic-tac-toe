import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const rowStyle = {
  'display': 'flex',
  'flexWrap': 'wrap'
}

const squareStyle = {
  'width': '120px',
  'height': '120px',
  'backgroundColor': '#BDBDBD',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '80px',
  'color': '#212121',
}

const boardStyle = {
  'width': '385px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '8px #00C853 solid',
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column',
  'border': '3px white solid',
  'padding': '36px 80px',
}

const instructionsStyle = {
  'marginBottom': '36px',
  'fontWeight': 'bold',
  'fontSize': '42px',
  'color': '#00C853',
}

const buttonStyle = {
  'marginTop': '36px',
  'height': '40px',
  'backgroundColor': '#FF6D00',
  'color': 'white',
  'fontSize': '16px',
}

function Square( { data, onSelectSquare } ) {
  return (
    <div
      className="square"
      style={squareStyle}
      onClick={ () => { 
        console.log(`PLAYER ${data.mark} CLICKED ${data.index}!`)
        onSelectSquare(data.index, data.mark)
      }}
    >
      { data.mark }
    </div>
  )
}

function checkForWinningPlayerMark(boardState, playerMark) {
  const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [0, 3, 8],
    [2, 5, 7],
  ]
  
  let hasWinner = false

  winningPatterns.forEach((indexArr) => {
    let isWinningPattern = true

    indexArr.forEach((index) => {
      if (isWinningPattern && boardState[index].mark !== playerMark) {
        isWinningPattern = false
      }
    })

    if (isWinningPattern === true) {
      hasWinner = true
    }
  })

  return hasWinner
}

function getInitialBoardState() {
  return Array.from({ length: 9 }, (value, index) => {
    return {
      index: index,
      mark: '',
    }
  })
}

function Board() {
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [winningPlayer, setWinningPlayer] = useState('None')

  const resetBoardState = () => {
    setBoardState(getInitialBoardState())
    setCurrentPlayer('X')
    setWinningPlayer('None')
  }

  const [boardState, setBoardState] = useState(getInitialBoardState())

  const handleSelectSquare = (index) => {
    if (!!boardState[index].mark) {
      console.log(`This square is already selected by ${boardState[index]}`)
      return
    }
    console.log(`${currentPlayer} Selected ${index}.`)
    boardState[index].mark = currentPlayer
    setBoardState(boardState)

    const hasWinner = checkForWinningPlayerMark(boardState, currentPlayer)

    if (hasWinner) {
      setWinningPlayer(currentPlayer)
      setCurrentPlayer('None')
      document.querySelector('.board').style.borderColor = '#D50000'
      return
    }

    if (currentPlayer === 'X') {
      setCurrentPlayer('O')
    } else {
      setCurrentPlayer('X')
    }
  }

  return (
    <div style={containerStyle} className="gameBoard">
      { winningPlayer === 'None' &&
        <div id="statusArea" className="status" style={instructionsStyle}>
          Next Player: <span>{currentPlayer}</span>
        </div>
      }
      { winningPlayer !== 'None' &&
        <div id="winnerArea" className="winner" style={instructionsStyle}>
          Winner: <span>{winningPlayer}</span>
        </div>
      }
      <div className="board" style={boardStyle}>
        <div className="board-row" style={rowStyle}>
          {boardState.map((square) => (
            <Square 
              key={square.index}
              data={square}
              onSelectSquare={handleSelectSquare} />
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

