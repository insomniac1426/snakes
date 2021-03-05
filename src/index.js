import Snake from "./components/Snake";
import Food from "./components/Food";
import { getCanvasFromDOM, setupStartButton, showStartButton } from "./utils";

import { GAME_DIM, GAME_DIR, GAME_THEME } from "./constants";
import "./app.css";

const canvas = getCanvasFromDOM();
let snake = null;
let food = null;

function boardAndControlSetup() {
  const snakeConfig = Snake.getStaticInitialConfig();
  snake = new Snake({ ...snakeConfig });
  food = new Food({ location: Food.spawnFood(snake), theme: GAME_THEME });

  // setup event handlers
  window.addEventListener("keydown", (e) => {
    if (snake) {
      if (e.key === "ArrowUp") {
        snake.turn(GAME_DIR.UP);
      } else if (e.key === "ArrowDown") {
        snake.turn(GAME_DIR.DOWN);
      } else if (e.key === "ArrowLeft") {
        snake.turn(GAME_DIR.LEFT);
      } else if (e.key === "ArrowRight") {
        snake.turn(GAME_DIR.RIGHT);
      }
    }
  });
}

const frameRate = 60;
let frameCount = 0;

function paintBoard() {
  if (snake && food) {
    if (!snake.alive) {
      showStartButton();
    }
    // create a timer
    frameCount++;
    if (frameCount === frameRate / 10) {
      canvas.clearRect(0, 0, GAME_DIM.WINDOW_WIDTH, GAME_DIM.WINDOW_HEIGHT);
      food.draw({ canvas });
      if (snake.update({ canvas: canvas, food: food })) {
        food = new Food({
          location: Food.spawnFood(snake),
          theme: GAME_THEME,
        });
      }
      frameCount = 0;
    }
  }
  requestAnimationFrame(() => paintBoard());
}

setupStartButton({ startOnClick: boardAndControlSetup });
requestAnimationFrame(() => paintBoard());
