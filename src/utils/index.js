export const checkIfNumberInBetween = (num, st, en) => {
  return (st - num) * (en - num) <= 0;
};

export function _isFunction(f) {
  return typeof f === "function";
}

export function _throttle(f, throttleBy) {
  const FRAME_RATE = 60;
  const throtteldFunction = function (...args) {
    throtteldFunction.count++;
    if (throtteldFunction.count >= FRAME_RATE / throtteldFunction.throttleBy) {
      f(...args);
      throtteldFunction.count = 0;
    }
  };

  throtteldFunction.throttleBy = throttleBy;
  throtteldFunction.count = 0;
  return throtteldFunction;
}
