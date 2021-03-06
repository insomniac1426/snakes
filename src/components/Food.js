import BoardLocation from "./BoardLocation";
import { GAME_DIM } from "../constants";

const getFoodPath = (x, y, s) => {
  return `M${x} ${y + s / 2} L ${x + s / 2} ${y} L ${x + s} ${y + s / 2} L ${
    x + s / 2
  } ${y + s} Z`;
};

function Food(foodProps) {
  const { location, theme } = foodProps;

  this.location = location;

  this.draw = ({ canvas }) => {
    canvas.beginPath();

    const stX = this.location.x;
    const stY = this.location.y;

    let foodPath = new Path2D(getFoodPath(stX, stY, GAME_DIM.SNAKE_WIDTH));
    canvas.strokeStyle = theme.FOOD_COLOR;
    canvas.stroke(foodPath);
    canvas.fillStyle = theme.FOOD_COLOR;
    canvas.fill(foodPath);
  };
}

Food.spawnFood = function (snake) {
  const BoardCols = GAME_DIM.WINDOW_WIDTH / GAME_DIM.SNAKE_WIDTH;
  const BoardRows = GAME_DIM.WINDOW_HEIGHT / GAME_DIM.SNAKE_WIDTH;
  const totalBoardBlocks = BoardCols * BoardRows;
  const availBoardBlocks = totalBoardBlocks - snake.length;

  const randomBoardBlockNumber = Math.floor(
    Math.random() * (availBoardBlocks - 1)
  );

  const foodY = Math.floor((randomBoardBlockNumber - 1) / BoardCols);
  const foodX = (randomBoardBlockNumber - 1) % BoardRows;
  return new BoardLocation(foodX, foodY);
};

export default Food;
