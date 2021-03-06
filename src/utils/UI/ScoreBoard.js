function ScoreBoard() {
  this.element = document.getElementById("score-board");

  this.getScoreText = function (value) {
    return `Score: ${value}`;
  };

  this.updateScore = function (value) {
    this.element.innerText = this.getScoreText(value);
  };
}

ScoreBoard.getScoreBoard = function () {
  if (!ScoreBoard.sb) {
    ScoreBoard.sb = new ScoreBoard();
  }
  return ScoreBoard.sb;
};

export default ScoreBoard;
