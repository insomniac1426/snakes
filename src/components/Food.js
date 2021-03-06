import BoardLocation from "./BoardLocation";
import { GAME_DIM } from "../constants";

function Food(foodProps) {
  const { location, theme } = foodProps;

  this.location = location;

  this.draw = ({ canvas }) => {
    canvas.beginPath();
    canvas.rect(
      this.location.x,
      this.location.y,
      GAME_DIM.SNAKE_WIDTH,
      GAME_DIM.SNAKE_WIDTH
    );
    canvas.fillStyle = theme.FOOD_COLOR;
    canvas.fill();
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
