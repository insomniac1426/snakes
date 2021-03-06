import Game from "./components/Game";
import StartBtn from "./utils/UI/StartBtn";
import ScoreBoard from "./utils/UI/ScoreBoard";
import { getCanvasFromDOM } from "./utils/UI/canvas";

import { GAME_THEME } from "./constants";

import "./app.css";

const startBtn = StartBtn.getStartButton();
const scoreBoard = ScoreBoard.getScoreBoard();
const canvas = getCanvasFromDOM();

const game = new Game({
  canvas,
  gameUI: { startBtn, scoreBoard },
  theme: GAME_THEME,
});

game.startGame({ target: window, gameObject: game });
