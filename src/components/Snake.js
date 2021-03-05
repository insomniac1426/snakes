import { GAME_DIM, GAME_DIR } from "../constants";
import BoardLocation from "./BoardLocation";
import { checkIfNumberInBetween } from "../utils";

function Snake(snakeProps) {
  const {
    initalHeadLocation,
    initialTailLocation,
    initialDirection,
  } = snakeProps;

  this.joints = [initalHeadLocation, initialTailLocation];
  this.dir = initialDirection;
  this.length = Snake.calculateInitialLengthSnake(
    initalHeadLocation,
    initialTailLocation
  );
  this.alive = true;

  this.draw = function ({ canvas: c }) {
    c.beginPath();

    this.joints.forEach((joint, index) => {
      if (index != this.joints.length - 1) {
        if (this.joints[index + 1].isWrap) return;
        const dimsOfSnakePart = Snake.calculatePartDims(
          joint,
          this.joints[index + 1]
        );

        c.rect(
          dimsOfSnakePart.x,
          dimsOfSnakePart.y,
          dimsOfSnakePart.width,
          dimsOfSnakePart.height
        );
      }
    });
    c.fillStyle = "#636e72";
    c.fill();

    c.beginPath();
    c.rect(
      this.joints[0].x,
      this.joints[0].y,
      GAME_DIM.SNAKE_WIDTH,
      GAME_DIM.SNAKE_WIDTH
    );
    c.fillStyle = "#2d3436";
    c.fill();
  };

  this.updateTail = function () {
    const STail = this.joints[this.joints.length - 1];
    const STailButOne = this.joints[this.joints.length - 2];

    // identify tail movement direction
    if (STail.x === STailButOne.x && STail.y < STailButOne.y) {
      // tail moving GAME_DIR.DOWN
      STail.y += GAME_DIM.SNAKE_WIDTH;
    } else if (STail.x === STailButOne.x && STail.y > STailButOne.y) {
      // moving GAME_DIR.UP
      STail.y -= GAME_DIM.SNAKE_WIDTH;
    } else if (STail.y === STailButOne.y && STail.x < STailButOne.x) {
      // moving GAME_DIR.RIGHT
      STail.x += GAME_DIM.SNAKE_WIDTH;
    } else if (STail.y === STailButOne.y && STail.x > STailButOne.x) {
      STail.x -= GAME_DIM.SNAKE_WIDTH;
    }

    // popping tail if it has met a joint
    if (BoardLocation.isEqual(STail, STailButOne)) {
      this.joints.pop();
      if (STailButOne.isWrap) {
        this.joints.pop();
      }
    }
  };

  this.checkIfFoodEaten = function (food) {
    let SHead = this.joints[0];
    return (
      ((this.dir === GAME_DIR.UP || this.dir === GAME_DIR.DOWN) &&
        Math.abs(SHead.y - food.y) === GAME_DIM.SNAKE_WIDTH &&
        SHead.x === food.x) ||
      ((this.dir === GAME_DIR.LEFT || this.dir === GAME_DIR.RIGHT) &&
        Math.abs(SHead.x - food.x) === GAME_DIM.SNAKE_WIDTH &&
        SHead.y === food.y)
    );
  };

  this.updateHeadOnSoftBoundaryHit = function () {
    const SHead = this.joints[0];
    const headXBoardCoord = SHead.x / GAME_DIM.SNAKE_WIDTH;
    const headYBoardCoord = SHead.y / GAME_DIM.SNAKE_WIDTH;

    let newCoordinatesX = SHead.x;
    let newCoordinatesY = SHead.y;
    // if upper soft boundaary is hit
    if (this.dir === GAME_DIR.UP && headYBoardCoord === 0) {
      SHead.isWrap = true;
      newCoordinatesY = GAME_DIM.WINDOW_HEIGHT;
    }

    // if lower soft boundary is hit
    if (
      this.dir === GAME_DIR.DOWN &&
      headYBoardCoord + 1 === GAME_DIM.WINDOW_HEIGHT / GAME_DIM.SNAKE_WIDTH
    ) {
      SHead.isWrap = true;
      newCoordinatesY = -GAME_DIM.SNAKE_WIDTH;
    }

    // if left soft boundary is hit
    if (this.dir === GAME_DIR.LEFT && headXBoardCoord === 0) {
      SHead.isWrap = true;
      newCoordinatesX = GAME_DIM.WINDOW_WIDTH;
    }

    // if right soft boundary is hit
    if (
      this.dir === GAME_DIR.RIGHT &&
      headXBoardCoord + 1 === GAME_DIM.WINDOW_WIDTH / GAME_DIM.SNAKE_WIDTH
    ) {
      SHead.isWrap = true;
      newCoordinatesX = -GAME_DIM.SNAKE_WIDTH;
    }

    if (SHead.isWrap) {
      this.joints = [
        new BoardLocation(
          newCoordinatesX / GAME_DIM.SNAKE_WIDTH,
          newCoordinatesY / GAME_DIM.SNAKE_WIDTH
        ),
        new BoardLocation(
          newCoordinatesX / GAME_DIM.SNAKE_WIDTH,
          newCoordinatesY / GAME_DIM.SNAKE_WIDTH
        ),
        ...this.joints,
      ];
    }
  };

  this.checkIfPointLiesOnSnake = function (location) {
    return this.joints.reduce((result, joint, index) => {
      let isColliding = false;
      if (index !== this.joints.length - 1 && index !== 0) {
        // if a verical piece
        if (joint.x === this.joints[index + 1].x) {
          // no wrap and moving down
          if (
            location.x === joint.x &&
            !this.joints[index + 1].isWrap &&
            checkIfNumberInBetween(
              location.y,
              joint.y,
              this.joints[index + 1].y
            )
          ) {
            isColliding = true;
          }
        }

        // if a horizontal piece
        if (joint.y === this.joints[index + 1].y) {
          // no wrap and moving down
          if (location.y === joint.y && !this.joints[index + 1].isWrap) {
            console.log(location, joint, this.joints);
            isColliding = checkIfNumberInBetween(
              location.x,
              joint.x,
              this.joints[index + 1].x
            );
          }
        }
      }
      return result || isColliding;
    }, false);
  };

  this.isEatSelf = function () {
    // check if currently th head is colliding with any of snake's body.
    const SHead = this.joints[0];
    if (this.checkIfPointLiesOnSnake(SHead)) {
      this.stop();
    }
  };

  this.update = function ({ canvas, food }) {
    let wasFoodEaten = false;
    // calculate next move only if snake alive
    if (this.alive) {
      // has snake eaten food
      wasFoodEaten = this.checkIfFoodEaten(food.location);
      if (wasFoodEaten) {
        this.joints[0].x = food.location.x;
        this.joints[0].y = food.location.y;
      }

      // -------------- Check for all boundary collisions --------------
      // is passing a soft boundary
      // this method updates the head.
      this.updateHeadOnSoftBoundaryHit();

      // ------------- Check food after collision has ended ------------

      if (!wasFoodEaten) {
        wasFoodEaten = this.checkIfFoodEaten(food.location);
        if (wasFoodEaten) {
          this.joints[0].x = food.location.x;
          this.joints[0].y = food.location.y;
        }
      }

      let SHead = this.joints[0];

      // update HEAD checking if wrapped
      if (this.dir === GAME_DIR.DOWN) {
        SHead.y += GAME_DIM.SNAKE_WIDTH;
      } else if (this.dir === GAME_DIR.UP) {
        SHead.y -= GAME_DIM.SNAKE_WIDTH;
      } else if (this.dir === GAME_DIR.LEFT) {
        SHead.x -= GAME_DIM.SNAKE_WIDTH;
      } else if (this.dir === GAME_DIR.RIGHT) {
        SHead.x += GAME_DIM.SNAKE_WIDTH;
      }
      this.updateTail();
      this.isEatSelf();
    }
    this.draw({ canvas });
    return wasFoodEaten;
  };

  this.isDirectionOpposite = function (dir) {
    return (
      (this.dir === GAME_DIR.DOWN && dir === GAME_DIR.UP) ||
      (this.dir === GAME_DIR.UP && dir === GAME_DIR.DOWN) ||
      (this.dir === GAME_DIR.RIGHT && dir === GAME_DIR.LEFT) ||
      (this.dir === GAME_DIR.LEFT && dir === GAME_DIR.RIGHT)
    );
  };

  this.turn = function (dir) {
    if (this.isDirectionOpposite(dir) || dir === this.dir) {
      return;
    }

    // update snake direction;
    this.dir = dir;

    // aad a joint and move head by one block
    const SHead = this.joints[0];
    const newHead = { ...SHead };
    this.joints = [newHead, ...this.joints];
  };

  this.stop = function () {
    this.alive = false;
  };
}

Snake.calculateInitialLengthSnake = function (head, tail) {
  if (head.x === tail.x)
    return Math.abs(head.y - tail.y) / GAME_DIM.SNAKE_WIDTH;
  else return Math.abs(head.x - head.y) / GAME_DIM.SNAKE_WIDTH;
};

Snake.calculatePartDims = function (loc1, loc2) {
  if (loc1.x === loc2.x) {
    // verical
    if (loc1.y > loc2.y) {
      //move GAME_DIR.DOWN
      return {
        x: loc1.x,
        y: loc1.y + GAME_DIM.SNAKE_WIDTH,
        width: GAME_DIM.SNAKE_WIDTH,
        height: loc2.y - loc1.y,
      };
    } else {
      //move GAME_DIR.UP
      return {
        x: loc1.x,
        y: loc1.y,
        width: GAME_DIM.SNAKE_WIDTH,
        height: loc2.y - loc1.y,
      };
    }
  } else {
    // horizontal
    if (loc1.x > loc2.x) {
      // move GAME_DIR.RIGHT
      return {
        x: loc1.x + GAME_DIM.SNAKE_WIDTH,
        y: loc1.y,
        width: loc2.x - loc1.x,
        height: GAME_DIM.SNAKE_WIDTH,
      };
    } else {
      // move GAME_DIR.LEFT
      return {
        x: loc1.x,
        y: loc1.y,
        width: loc2.x - loc1.x,
        height: GAME_DIM.SNAKE_WIDTH,
      };
    }
  }
};

Snake.getStaticInitialConfig = function () {
  const initalLength = GAME_DIM.SNAKE_INITIAL_LENGTH;
  const initalHeadLocation = new BoardLocation(5, 10);
  const initialTailLocation = new BoardLocation(5, 10 - initalLength);
  const initialDirection = GAME_DIR.DOWN;
  return {
    initalHeadLocation,
    initialTailLocation,
    initialDirection,
  };
};

export default Snake;
