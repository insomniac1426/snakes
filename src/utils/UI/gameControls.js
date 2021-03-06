import { _isFunction } from "..";

export const setupGameControls = (setupConfig) => {
  const { onUp, onDown, onLeft, onRight, target } = setupConfig;

  if (!target) {
    return false;
  }

  target.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && _isFunction(onUp)) {
      onUp(e);
    } else if (e.key === "ArrowDown" && _isFunction(onDown)) {
      onDown(e);
    } else if (e.key === "ArrowLeft" && _isFunction(onLeft)) {
      onLeft(e);
    } else if (e.key === "ArrowRight" && _isFunction(onRight)) {
      onRight(e);
    }
  });

  return true;
};
