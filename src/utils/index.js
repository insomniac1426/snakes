import { GAME_DIM, GAME_LOCALE } from "../constants/index";

export const checkIfNumberInBetween = (num, st, en) => {
  return (st - num) * (en - num) <= 0;
};

export const getCanvasFromDOM = ({
  canvasHeight = GAME_DIM.WINDOW_HEIGHT,
  canvasWidth = GAME_DIM.WINDOW_WIDTH,
} = {}) => {
  const C = document.querySelector("canvas");

  C.height = canvasHeight;
  C.width = canvasWidth;

  return C.getContext("2d");
};

const getStartButtonFromDOM = () => {
  const start = document.getElementById("start");
  return start;
};

export const setupStartButton = ({ startOnClick }) => {
  const startBtn = getStartButtonFromDOM();
  startBtn.innerText = GAME_LOCALE.START_BTN_CAPTION;
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (_isFunction(startOnClick)) {
        startOnClick();
      }

      hideElement(startBtn);
    });
  }
  return startBtn;
};

export const showStartButton = () => {
  const startBtn = getStartButtonFromDOM();
  showElement(startBtn);
  startBtn.innerText = GAME_LOCALE.RESTART_BTN_CAPTION;
};

export function _isFunction(f) {
  return typeof f === "function";
}

export function showElement(element) {
  element.style.zIndex = 1;
  element.style.visibility = "visible";
}

export function hideElement(element) {
  element.style.zIndex = -1;
  element.style.visibility = "hidden";
}
