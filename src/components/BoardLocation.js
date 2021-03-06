import { GAME_DIM } from "../constants";

function BoardLocation(x, y, isWrap = false) {
  this.x = x * GAME_DIM.SNAKE_WIDTH;
  this.y = y * GAME_DIM.SNAKE_WIDTH;
  this.isWrap = isWrap;
}

BoardLocation.isEqual = function (loc1, loc2) {
  return loc1.x === loc2.x && loc1.y === loc2.y;
};

BoardLocation.copy = function (loc, shouldWrap = false) {
  return new BoardLocation(loc.x, loc.y, shouldWrap);
};

BoardLocation.copyExact = function (loc) {
  return new BoardLocation(loc.x, loc.y, loc.isWrap);
};

export default BoardLocation;
