import { useState } from 'react'
import confetti from "canvas-confetti"
import { Square } from './components/Square'
import { TURNS, WINNER_COMBOS } from './constants'
import { WinnerModal } from './components/WinnerModal'
import { Board } from './components/Board'
import { Turn } from './components/Turn'

function App() {
  const [board, setBoard] = useState(()=>{
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    if (turnFromStorage) return turnFromStorage
    return TURNS.X
  })
  const [winner, setWinner] = useState(null) // null no hay ganador, false es empate

  const checkWinner = (boardToCheck) => {
    for (const combo of WINNER_COMBOS){
      const [a,b,c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ){
        return boardToCheck[a] //retorno x u o como ganador
      }
    }
    return null
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
  }

  const checkEndGame = (newBoard) => { //si ningun cuadrado es null, devuelve true
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    if (board[index] || winner) return // si en el cuadrado hay un null, no pasara if. Si hay algo, dara true y no podremos escribir nada en el square. Lo mismo para winner.
    //actualizar tablero
    const newBoard = [...board] //siempre hacer una copia superficial del state con spread operator
    newBoard[index] = turn
    setBoard(newBoard)
    //cambiar turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardamos partida en local storage, para que la recarga de pagina no afecte el juego
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    //revisamos si hay ganador
    const newWinner = checkWinner(newBoard)
    if (newWinner){
      setWinner(newWinner) //los set state son ASINCRONOS!!
      confetti()
    } else if (checkEndGame(newBoard)){ //ver si hay empate
      setWinner(false)
    }
  }

  return (
    <main className='board'>
      <h1>Tres en Linea</h1>
      <button onClick={resetGame}>Volver a empezar</button>
      <Board board={board} updateBoard={updateBoard}/>
      <Turn turn={turn}/>
      <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  )
}

export default App
