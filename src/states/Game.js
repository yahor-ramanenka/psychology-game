import Phaser from 'phaser'
import axios from 'axios'
import querystring from 'querystring'
import sha1 from 'sha1'

import Target from '../sprites/Target'
import Crosshair from '../sprites/Crosshair'
import {rlist} from 'randgen'
import CONST from '../const/const'
import HitCalculator from '../logic/HitCalculator'

export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
		this.target = new Target({
			game: this.game,
			x: this.game.world.centerX,
			y: this.game.world.centerY,
			asset: 'target',
			shouldMove: true
		});

		this.crosshair = new Crosshair({
			game: this.game,
			x: this.game.world.centerX,
			y: this.game.world.centerY,
			asset: 'crosshair'
		});

		this.miss = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'miss');
		this.bang = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'bang');
		this.miss.anchor.setTo(0.5);
		this.bang.anchor.setTo(0.5);
		this.bang.visible = false;
		this.miss.visible = false;

		this.game.add.existing(this.target);
		this.target.inputEnabled = true;
		this.target.input.pixelPerfectClick = true;

		this.game.add.existing(this.crosshair);
		this.game.add.existing(this.miss);
		this.game.add.existing(this.bang);

		game.input.mouse.capture = true;

		this.initScore();
		this.initShotCount();

		this.nextShot = this.game.time.now;

		this.lastShot = {
			movementCount: 0,
			time: this.game.time.now
		};

		// some crazy user id generation
		this.userid = sha1(new Date().getTime().toString() + Math.ceil(Math.random() * 10000));
  }

	canPerformShot() {
		return this.nextShot < this.game.time.now;
	}

	maximumStepsReached() {
		return this.shotCount >= CONST.MAX_TURNS;
	}

	endGame() {
		this.gameEnded = true;
		this.target.shouldMove = false;
	}

  update () {
		if(this.gameEnded) {
			return;
		}
		if(game.input.activePointer.leftButton.isDown) {
			if(!this.canPerformShot()) {
				return;
			}
			if(this.maximumStepsReached()) {
				this.endGame();
				return;
			}

			this.shotCount++;
			this.updateStepsBanner();
			this.nextShot = this.game.time.now + CONST.TIME.PAUSE_BEFORE_NEXT_SHOT;
			this.shoot();
		}
  }

	shoot() {
		var currentTime = this.game.time.now;
		var shotInfo = {
			movements: this.target.movementCount - this.lastShot.movementCount,
			time: currentTime - this.lastShot.time,
			shotcnt: this.shotCount,
			cond: CONST.CONDITION
		};
		this.lastShot = {
			movementCount: this.target.movementCount,
			time: currentTime
		};
		this.crosshair.visible = false;
		if(this.target.input.pointerOver()) {
			if(HitCalculator.isHitShouldBeCounted()) {
				setTimeout(this.handleHit.bind(this), 0);
				shotInfo.hit = CONST.HIT_TYPES.HIT;
			} else {
				//shot is hit, but should be counted as 'miss'
				this.target.jumpFromShot();
				setTimeout(this.handleMiss.bind(this), 0);
				shotInfo.hit = CONST.HIT_TYPES.MISS_SIMULATED;
			}
		} else {
			setTimeout(this.handleMiss.bind(this), 0);
			shotInfo.hit = CONST.HIT_TYPES.MISS;
		}
		this.sendAjax(shotInfo);
	}

	handleMiss() {
		this.miss.visible = true;
		this.miss.x = this.game.world.centerX;
		this.miss.y = this.game.world.centerY;

		this.target.visible = false;
		this.target.shouldMove = false;

		setTimeout(this.hideAllAndShowTarget.bind(this), CONST.TIME.PAUSE_BEFORE_NEXT_SHOT);
	}

	handleHit() {
		this.bang.x = this.target.x;
		this.bang.y = this.target.y;
		this.bang.visible = true;
		this.setScore(this.score + 1);

		this.target.visible = false;
		this.target.shouldMove = false;

		setTimeout(this.hideAllAndShowTarget.bind(this), CONST.TIME.PAUSE_BEFORE_NEXT_SHOT);
	}

	hideAllAndShowTarget() {
		this.bang.visible = false;
		this.miss.visible = false;
		this.target.visible = true;

		this.crosshair.visible = true;

		this.target.shouldMove = true;
	}

	initScore() {
		this.realHitsCount = 0;
		this.score = 0;
		this.scoreBanner = this.add.text(10, 10, "Punkte: " + this.score);
		this.scoreBanner.font = 'Nunito';
    this.scoreBanner.fontSize = 30;
    this.scoreBanner.fill = '#77BFA3';
	}

	initShotCount() {
		this.shotCount = 0;
		this.stepsBanner = this.add.text(CONST.SCREEN.WIDTH - 10, 10, "Schüsse " + this.shotCount + "/" + CONST.MAX_TURNS);
		this.stepsBanner.anchor.setTo(1, 0);
		this.stepsBanner.font = 'Nunito';
    this.stepsBanner.fontSize = 30;
    this.stepsBanner.fill = '#77BFA3';
	}

	updateStepsBanner() {
		this.stepsBanner.text = "Schüsse " + this.shotCount + "/" + CONST.MAX_TURNS;
	}

	sendAjax(shotInfo) {
		Object.assign(shotInfo, {userid: this.userid});
		axios.post(CONST.SERVICE_URL, querystring.stringify(shotInfo), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }});
	}

	setScore(newScore) {
		this.score = newScore;
		this.scoreBanner.setText("Punkte: " + this.score);
	}
}
