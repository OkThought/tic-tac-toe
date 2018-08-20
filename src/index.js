import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      positionInHistory: 0,
      xIsNext: true,
    }
  }

  get positionInHistory() {
    return this.state.positionInHistory;
  }

  get currentBoardConfiguration() {
    return this.state.history[this.positionInHistory];
  }

  performStep(i) {
    if (this.state.winner) {
      return;
    }

    const squares = this.currentBoardConfiguration.squares.slice();
    if (squares[i] === null) {
      // Make move
      squares[i] = this.state.xIsNext ? 'X' : 'O';

      const newPosition = this.positionInHistory + 1;
      // Forget the future
      const history = this.state.history.slice(0, newPosition);

      this.setState({
        history: history.concat({squares: squares}),
        positionInHistory: newPosition,
        xIsNext: !this.state.xIsNext,
        winner: calculateWinner(squares),
      });
    }
  }

  goTo(position) {
    this.setState({
      positionInHistory: position,
      xIsNext: (position % 2) === 0,
      winner: calculateWinner(this.state.history[position]),
    })
  }

  render() {
    const history = this.state.history;
    const moves = history.map((_, move) => {
      const description = move === 0 ?
        'Go to start' : 'Go to ' + move;
      return <li key={move}>
        <button onClick={() => this.goTo(move)}>
          {description}
        </button>
      </li>
    });

    const current = this.currentBoardConfiguration;
    const status = this.state.winner ?
      'Winner: ' + this.state.winner :
      'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares}
                 onClick={i => this.performStep(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
