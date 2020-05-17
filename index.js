import "./index.css";

// board size is effectively 100 x 100
const WINDOW_HEIGHT = 160;
const WINDOW_WIDTH = 320;
const SNAKE_WIDTH = 8;

// DIRECTION TAGS
const UP = "U";
const DOWN = "D";
const LEFT = "L";
const RIGHT = "R";

// innitializing canvas
const canvas = document.querySelector("canvas");
canvas.height = WINDOW_HEIGHT;
canvas.width = WINDOW_WIDTH;
const c = canvas.getContext("2d");

function checkIfNumberInBetween(num, st, en) {
	if (st > en) {
		return num <= st && num >= en;
	} else if (st < en) {
		return num <= en && num >= st;
	} else {
		return num === en && num === st;
	}
}
// Board Location
function BoardLocation(x, y, isWrap = false) {
	this.x = x * SNAKE_WIDTH;
	this.y = y * SNAKE_WIDTH;
	this.isWrap = false;
}

BoardLocation.isEqual = function (loc1, loc2) {
	return loc1.x === loc2.x && loc1.y === loc2.y;
};

BoardLocation.copy = function (loc) {
	return new BoardLocation(loc.x, loc.y);
};

function Food(location) {
	this.location = location;

	this.draw = function () {
		c.beginPath();
		c.rect(this.location.x, this.location.y, SNAKE_WIDTH, SNAKE_WIDTH);
		c.fillStyle = "#2d3436";
		c.fill();
	};
}

Food.spawnFood = function (snake) {
	const BoardCols = WINDOW_WIDTH / SNAKE_WIDTH;
	const BoardRows = WINDOW_HEIGHT / SNAKE_WIDTH;
	const totalBoardBlocks = BoardCols * BoardRows;
	const availBoardBlocks = totalBoardBlocks - snake.length;

	const randomBoardBlockNumber = Math.floor(
		Math.random() * (availBoardBlocks - 1)
	);

	const foodY = Math.floor((randomBoardBlockNumber - 1) / BoardCols);
	const foodX = (randomBoardBlockNumber - 1) % BoardRows;
	return new BoardLocation(foodX, foodY);
};

function Snake(head, tail, initDir) {
	this.joints = [head, tail];
	this.dir = initDir;
	this.length = Snake.calculateInitialLengthSnake(head, tail);
	this.alive = true;

	this.draw = function () {
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
		c.rect(this.joints[0].x, this.joints[0].y, SNAKE_WIDTH, SNAKE_WIDTH);
		c.fillStyle = "#2d3436";
		c.fill();
	};

	this.updateTail = function () {
		const STail = this.joints[this.joints.length - 1];
		const STailButOne = this.joints[this.joints.length - 2];

		// identify tail movement direction
		if (STail.x === STailButOne.x && STail.y < STailButOne.y) {
			// tail moving DOWN
			STail.y += SNAKE_WIDTH;
		} else if (STail.x === STailButOne.x && STail.y > STailButOne.y) {
			// moving UP
			STail.y -= SNAKE_WIDTH;
		} else if (STail.y === STailButOne.y && STail.x < STailButOne.x) {
			// moving RIGHT
			STail.x += SNAKE_WIDTH;
		} else if (STail.y === STailButOne.y && STail.x > STailButOne.x) {
			STail.x -= SNAKE_WIDTH;
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
			((this.dir === UP || this.dir === DOWN) &&
				Math.abs(SHead.y - food.y) === SNAKE_WIDTH &&
				SHead.x === food.x) ||
			((this.dir === LEFT || this.dir === RIGHT) &&
				Math.abs(SHead.x - food.x) === SNAKE_WIDTH &&
				SHead.y === food.y)
		);
	};

	this.updateHeadOnSoftBoundaryHit = function () {
		const SHead = this.joints[0];
		const headXBoardCoord = SHead.x / SNAKE_WIDTH;
		const headYBoardCoord = SHead.y / SNAKE_WIDTH;

		let newCoordinatesX = SHead.x;
		let newCoordinatesY = SHead.y;
		// if upper soft boundaary is hit
		if (this.dir === UP && headYBoardCoord === 0) {
			SHead.isWrap = true;
			newCoordinatesY = WINDOW_HEIGHT;
		}

		// if lower soft boundary is hit
		if (
			this.dir === DOWN &&
			headYBoardCoord + 1 === WINDOW_HEIGHT / SNAKE_WIDTH
		) {
			SHead.isWrap = true;
			newCoordinatesY = -SNAKE_WIDTH;
		}

		// if left soft boundary is hit
		if (this.dir === LEFT && headXBoardCoord === 0) {
			SHead.isWrap = true;
			newCoordinatesX = WINDOW_WIDTH;
		}

		// if right soft boundary is hit
		if (
			this.dir === RIGHT &&
			headXBoardCoord + 1 === WINDOW_WIDTH / SNAKE_WIDTH
		) {
			SHead.isWrap = true;
			newCoordinatesX = -SNAKE_WIDTH;
		}

		if (SHead.isWrap) {
			this.joints = [
				new BoardLocation(
					newCoordinatesX / SNAKE_WIDTH,
					newCoordinatesY / SNAKE_WIDTH
				),
				new BoardLocation(
					newCoordinatesX / SNAKE_WIDTH,
					newCoordinatesY / SNAKE_WIDTH
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

	this.update = function (food) {
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
			if (this.dir === DOWN) {
				SHead.y += SNAKE_WIDTH;
			} else if (this.dir === UP) {
				SHead.y -= SNAKE_WIDTH;
			} else if (this.dir === LEFT) {
				SHead.x -= SNAKE_WIDTH;
			} else if (this.dir === RIGHT) {
				SHead.x += SNAKE_WIDTH;
			}
			this.updateTail();
			this.isEatSelf();
		}
		this.draw();
		return wasFoodEaten;
	};

	this.isDirectionOpposite = function (dir) {
		return (
			(this.dir === DOWN && dir === UP) ||
			(this.dir === UP && dir === DOWN) ||
			(this.dir === RIGHT && dir === LEFT) ||
			(this.dir === LEFT && dir === RIGHT)
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
	if (head.x === tail.x) return Math.abs(head.y - tail.y) / SNAKE_WIDTH;
	else return Math.abs(head.x - head.y) / SNAKE_WIDTH;
};

Snake.calculatePartDims = function (loc1, loc2) {
	if (loc1.x === loc2.x) {
		// verical
		if (loc1.y > loc2.y) {
			//move DOWN
			return {
				x: loc1.x,
				y: loc1.y + SNAKE_WIDTH,
				width: SNAKE_WIDTH,
				height: loc2.y - loc1.y,
			};
		} else {
			//move UP
			return {
				x: loc1.x,
				y: loc1.y,
				width: SNAKE_WIDTH,
				height: loc2.y - loc1.y,
			};
		}
	} else {
		// horizontal
		if (loc1.x > loc2.x) {
			// move RIGHT
			return {
				x: loc1.x + SNAKE_WIDTH,
				y: loc1.y,
				width: loc2.x - loc1.x,
				height: SNAKE_WIDTH,
			};
		} else {
			// move LEFT
			return {
				x: loc1.x,
				y: loc1.y,
				width: loc2.x - loc1.x,
				height: SNAKE_WIDTH,
			};
		}
	}
};

let saanp = null;
let food = null;

function init() {
	const LengthInit = 3;
	const SHeadInit = new BoardLocation(5, 10);
	const STailInit = new BoardLocation(5, 10 - LengthInit);
	const DirInit = DOWN;
	saanp = new Snake(SHeadInit, STailInit, DirInit);
	food = new Food(Food.spawnFood(saanp));
}

// setup event handlers
window.addEventListener("keydown", (e) => {
	if (saanp) {
		if (e.key === "ArrowUp") {
			saanp.turn(UP);
		} else if (e.key === "ArrowDown") {
			saanp.turn(DOWN);
		} else if (e.key === "ArrowLeft") {
			saanp.turn(LEFT);
		} else if (e.key === "ArrowRight") {
			saanp.turn(RIGHT);
		}
	}
});

const frameRate = 60;
let frameCount = 0;

function animate() {
	requestAnimationFrame(animate);

	if (saanp && food) {
		if (!saanp.alive) {
			showReincarnate();
		}
		// create a timer
		frameCount++;
		if (frameCount === frameRate / 10) {
			// do something
			c.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
			food.draw();
			if (saanp.update(food)) {
				food = new Food(Food.spawnFood(saanp));
			}
			frameCount = 0;
		}
	}
}
animate();

const reincarnateButton = document.getElementById("reincarnate");
reincarnateButton.addEventListener("click", () => {
	init();
	reincarnateButton.style.visibility = "hidden";
	reincarnateButton.style.zIndex = -1;
});

function showReincarnate() {
	reincarnateButton.style.zIndex = 1;
	reincarnateButton.style.visibility = "visible";
}
