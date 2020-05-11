import "./index.css";

// board size is effectively 100 x 100
const WINDOW_HEIGHT = "500";
const WINDOW_WIDTH = "500";
const SNAKE_WIDTH = 10;

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

// Board Location
function BoardLocation(x, y) {
	this.x = x * SNAKE_WIDTH;
	this.y = y * SNAKE_WIDTH;
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

	const foodY = Math.floor((randomBoardBlockNumber + 1) / BoardCols) - 1;
	const foodX = randomBoardBlockNumber % BoardCols;

	return new BoardLocation(foodX, foodY);
};

function Snake(head, tail, initDir) {
	this.joints = [head, tail];
	this.dir = initDir;
	this.length = Snake.calculateInitialLengthSnake(head, tail);

	this.draw = function () {
		c.beginPath();

		this.joints.forEach((joint, index) => {
			if (index != this.joints.length - 1) {
				const dimsOfSnakePart = Snake.calculatePartDims(
					joint,
					this.joints[index + 1],
					this.joints,
					index
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

	this.update = function (food) {
		let SHead = this.joints[0];

		// has snake eaten food
		const wasFoodEaten = this.checkIfFoodEaten(food.location);
		if (wasFoodEaten) {
			SHead.x = food.location.x;
			SHead.y = food.location.y;
		}

		// update HEAD
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

		// --- need to check if there is food just about when the snake is turning.

		// aad a joint and move head by one block
		const SHead = this.joints[0];
		if (dir === LEFT) {
			this.joints = [
				new BoardLocation(
					(SHead.x - SNAKE_WIDTH) / SNAKE_WIDTH,
					SHead.y / SNAKE_WIDTH
				),
				...this.joints,
			];
		} else if (dir === RIGHT) {
			this.joints = [
				new BoardLocation(
					(SHead.x + SNAKE_WIDTH) / SNAKE_WIDTH,
					SHead.y / SNAKE_WIDTH
				),
				...this.joints,
			];
		} else if (dir === DOWN) {
			this.joints = [
				new BoardLocation(
					SHead.x / SNAKE_WIDTH,
					(SHead.y + SNAKE_WIDTH) / SNAKE_WIDTH
				),
				...this.joints,
			];
		} else if (dir === UP) {
			this.joints = [
				new BoardLocation(
					SHead.x / SNAKE_WIDTH,
					(SHead.y - SNAKE_WIDTH) / SNAKE_WIDTH
				),
				...this.joints,
			];
		}

		this.updateTail();
	};
}

Snake.calculateInitialLengthSnake = function (head, tail) {
	if (head.x === tail.x) return Math.abs(head.y - tail.y) + SNAKE_WIDTH;
	else return Math.abs(head.x - head.y) + SNAKE_WIDTH;
};

Snake.calculatePartDims = function (loc1, loc2) {
	if (loc1.x === loc2.x) {
		// verical
		if (loc1.y < loc2.y) {
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
		if (loc1.x < loc2.x) {
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

const SHead = new BoardLocation(5, 10);
const STail = new BoardLocation(5, 8);
const willy = new Snake(SHead, STail, DOWN, 1);

// setup event handlers
window.addEventListener("keydown", (e) => {
	if (e.key === "ArrowUp") {
		willy.turn(UP);
	} else if (e.key === "ArrowDown") {
		willy.turn(DOWN);
	} else if (e.key === "ArrowLeft") {
		willy.turn(LEFT);
	} else if (e.key === "ArrowRight") {
		willy.turn(RIGHT);
	}
});

const frameRate = 60;
let frameCount = 0;

let food = new Food(Food.spawnFood(willy));
console.log(food);
function animate() {
	requestAnimationFrame(animate);

	// create a timer
	frameCount++;
	if (frameCount === frameRate / 10) {
		// do something
		c.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
		food.draw();
		if (willy.update(food)) {
			food = new Food(Food.spawnFood(willy));
		}
		frameCount = 0;
	}
}

animate();
