import { GAME_DIM } from "../../constants";

export const getCanvasFromDOM = ({
  canvasHeight = GAME_DIM.WINDOW_HEIGHT,
  canvasWidth = GAME_DIM.WINDOW_WIDTH,
} = {}) => {
  const C = document.querySelector("canvas");

  C.height = canvasHeight;
  C.width = canvasWidth;

  return C.getContext("2d");
};
