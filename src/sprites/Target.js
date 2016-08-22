import Phaser from 'phaser'
import {rnorm, rlist} from 'randgen'
import CONST from '../const/const'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset, shouldMove }) {
    super(game, x, y, asset)

    this.game = game
    this.anchor.setTo(0.5)
		this.shouldMove = shouldMove;

		this.nextMove = this.game.time.now;

		this.leftWorldBorder = 0 + this.width * 1.5;
		this.rightWorldBorder = CONST.SCREEN.WIDTH - this.width * 1.5;

		this.topWorldBorder = 0 + this.height * 1.5;
		this.bottomWorldBorder = CONST.SCREEN.HEIGHT - this.height * 1.5;

		this.movementCount = 0;
  }

  update () {
    if(this.shouldMove) {
			if(this.game.time.now > this.nextMove) {
				let gapToNextMove = rnorm(CONST.MOVEMENT.TIME.MEAN, CONST.MOVEMENT.TIME.DEVIATION);
				this.nextMove = this.game.time.now + gapToNextMove * 1000; // convert gap to milliseconds
				this.move();
			}
		}
  }

	getXDirection() {
		if(this.x < this.leftWorldBorder) {
			return 1;
		} if(this.x > this.rightWorldBorder) {
			return -1;
		}
		return rlist([1, -1]);
	}

	getYDirection() {
		if(this.y < this.topWorldBorder) {
			return 1;
		} if(this.y > this.bottomWorldBorder) {
			return -1;
		}
		return rlist([1, -1]);
	}

	move(x, y) {
		this.x += this.getXDirection() * rnorm(CONST.MOVEMENT.X.MEAN, CONST.MOVEMENT.X.DEVIATION) * 20;
		this.y += this.getYDirection() * rnorm(CONST.MOVEMENT.Y.MEAN, CONST.MOVEMENT.Y.DEVIATION) * 20;
		this.movementCount++;
	}

	jumpFromShot() {
		this.move();
	}

}
