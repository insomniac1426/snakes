import Snake from "./Snake";
import Food from "./Food";
import { GAME_DIM, GAME_DIR } from "../constants";
import { setupGameControls } from "../utils/UI/gameControls";
import { _isFunction, _throttle } from "../utils";

function Game({ canvas, theme, gameUI }) {
  this.canvas = canvas;
  this.theme = theme;
  this.snake = null;
  this.food = null;
  this.score = 0;

  this.gameUI = {
    startBtn: gameUI.startBtn,
    scoreBoard: gameUI.scoreBoard,
  };

  this.isValidGame = function () {
    return this.snake && this.food && this.canvas;
  };

  this.createFood = (snake) => {
    if (!snake) {
      return null;
    }

    return new Food({
      location: Food.spawnFood(snake),
      theme: this.theme,
    });
  };

  this.updateFood = (snake, newFood = null) => {
    delete this.food;
    this.food = newFood || this.createFood(snake);
  };

  this.createSnake = () => {
    const snakeConfig = Snake.getStaticInitialConfig();
    this.snake = new Snake({ ...snakeConfig, theme: this.theme });
    return this.snake;
  };

  this.setupBasicGameControls = function (target) {
    setupGameControls({
      onUp: () => this.snake.turn(GAME_DIR.UP),
      onDown: () => this.snake.turn(GAME_DIR.DOWN),
      onLeft: () => this.snake.turn(GAME_DIR.LEFT),
      onRight: () => this.snake.turn(GAME_DIR.RIGHT),
      target,
    });
  };

  this.drawItemsInOneFrame = function () {
    this.canvas.clearRect(0, 0, GAME_DIM.WINDOW_WIDTH, GAME_DIM.WINDOW_HEIGHT);
    this.food.draw({ canvas: this.canvas });

    let isFoodConsumed = this.snake.update({
      canvas: this.canvas,
      food: this.food,
    });
    if (isFoodConsumed) {
      this.updateFood(this.snake);

      /** Increase score */
      this.score += 1;

      /** Increase speed */
      this.throttledDraw.throttleBy += 2;
      isFoodConsumed = false;
    }
  };

  this.paintBoardRAF = function (paint) {
    if (this.isValidGame()) {
      if (this.snake.isDead()) {
        this.gameUI.startBtn.show();
      }

      if (_isFunction(paint)) {
        paint();
      }

      this.gameUI.scoreBoard.updateScore(this.score);
    }

    requestAnimationFrame(this.paintBoardRAF.bind(this, paint));
  };

  this.setup = function ({ target }) {
    /** snake creation should preceed food creation */
    const snake = this.createSnake();
    this.updateFood(snake);
    this.setupBasicGameControls(target);
  };

  this.startGame = function ({ target }) {
    this.gameUI.startBtn.setup({
      startOnClick: () => this.setup({ target }),
    });
    const paint = _throttle(this.drawItemsInOneFrame.bind(this), 6);
    this.throttledDraw = paint;
    requestAnimationFrame(this.paintBoardRAF.bind(this, paint));
  };
}

export default Game;
