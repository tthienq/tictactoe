import React from "react";
import Board from "./Board";

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerLine: lines[i] };
    }
  }

  return { winner: null, winnerLine: null };
};

const checkDraw = (squares) =>{
  for (let i = 0; i < squares.length; i++) {
    if(!squares[i]) return false;
  }
  return true;
}

const getLocation = (move) => {
  const locationMap = {
    0: '[row: 1, col: 1]',
    1: '[row: 1, col: 2]',
    2: '[row: 1, col: 3]',
    3: '[row: 2, col: 1]',
    4: '[row: 2, col: 2]',
    5: '[row: 2, col: 3]',
    6: '[row: 3, col: 1]',
    7: '[row: 3, col: 2]',
    8: '[row: 3, col: 3]',
  };

  return locationMap[move];
};

class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        currentstepNumber: 0,
        xIsNext: true,
      
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.currentstepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares).winner || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          { squares: squares, 
            location: getLocation(i),
            stepNumber: history.length,
         }]),
        currentstepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
  
    sortMoves(){
      this.setState({        
        history: this.state.history.reverse(),
        currentstepNumber: this.state.history.length -1 - this.state.currentstepNumber,
      })
    }
  
    jumpTo(step) {
      this.setState({
        currentstepNumber: step,
        xIsNext: step % 2 === 0,     
      });
    }
  
 
  
    render() {
      const history = this.state.history;
      const current = history[this.state.currentstepNumber];
      const {winner, winnerLine} = calculateWinner(current.squares);
      const draw = checkDraw(current.squares);

      const moves = history.map((step, move) => {
        const style = this.state.currentstepNumber === move ? 'button' : '';
        const location = step.location ? step.location : '';
        
        const desc = step.stepNumber
        ? "Go to move #" + step.stepNumber + location
        : "Go to game start";
        return (
          <li key={move}>
            <button className = {`${style}`} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else if(draw){
        status = "Draw"
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              winnerSquares={winnerLine}
              squares={current.squares}
              onClick={(location) => this.handleClick(location)}
            />
          </div>
          <div className="game-info">
              <div>{status}</div>
              <button className="" onClick={() => this.sortMoves()}>
                Sort moves
              </button>
              
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

export default Game;