import Phaser from 'phaser'

import Target from '../sprites/Target'
import Crosshair from '../sprites/Crosshair'

import CONST from '../const/const'


export default class extends Phaser.State {
  init () {}
  preload () {}

  create () {
    let banner = this.add.text(this.game.world.centerX, this.game.height - 30, 'Left click to shoot, right click to end tutorial');
    banner.font = 'Nunito';
    banner.fontSize = 30;
    banner.fill = '#77BFA3';
    banner.anchor.setTo(0.5);

		this.target = new Target({
			game: this.game,
			x: this.game.world.centerX,
			y: this.game.world.centerY,
			asset: 'target',
			shouldMove: false
		});

		this.crosshair = new Crosshair({
			game: this.game,
			x: this.game.world.centerX,
			y: this.game.world.centerY,
			asset: 'crosshair'
		});

		this.target.inputEnabled = true;
		this.target.input.pixelPerfectClick = true;

		this.miss = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'miss');
		this.bang = new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'bang');
		this.miss.anchor.setTo(0.5);
		this.bang.anchor.setTo(0.5);
		this.bang.visible = false;
		this.miss.visible = false;


		this.game.add.existing(this.target);
		this.game.add.existing(this.crosshair);
		this.game.add.existing(this.miss);
		this.game.add.existing(this.bang);


		game.input.mouse.capture = true;

		this.nextShot = this.game.time.now;
	}

	update () {
		if(game.input.activePointer.rightButton.isDown) {
			this.state.start('Game');
		}
		if(game.input.activePointer.leftButton.isDown) {
			if(this.nextShot < this.game.time.now) {
				this.nextShot = this.game.time.now + CONST.TIME.PAUSE_BEFORE_NEXT_SHOT;
				this.shoot();
			}
		}
	}

	shoot() {
		this.crosshair.visible = false;
		if(this.target.input.pointerOver()) {
			setTimeout(this.handleHit.bind(this), 0);
		} else {
			setTimeout(this.handleMiss.bind(this), 0);
		}
	}

	handleMiss() {
		this.miss.visible = true;
		this.miss.x = this.game.world.centerX;
		this.miss.y = this.game.world.centerY;

		this.target.visible = false;

		setTimeout(this.hideAllAndShowTarget.bind(this), CONST.TIME.PAUSE_BEFORE_NEXT_SHOT);
	}

	handleHit() {
		this.bang.x = this.target.x;
		this.bang.y = this.target.y;
		this.bang.visible = true;

		this.target.visible = false;

		setTimeout(this.hideAllAndShowTarget.bind(this), CONST.TIME.PAUSE_BEFORE_NEXT_SHOT);
	}

	hideAllAndShowTarget() {
		this.bang.visible = false;
		this.miss.visible = false;
		this.target.visible = true;

		this.crosshair.visible = true;
	}
}
