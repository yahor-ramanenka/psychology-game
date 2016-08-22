import Phaser from 'phaser'

export default class extends Phaser.Sprite {

  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset);

    this.game = game;
    this.anchor.setTo(0.5);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);

		game.input.addMoveCallback(this.onMouseMove.bind(this));
  }

  update () {

  }

	onMouseMove(pointer, x, y) {
		this.x = x;
		this.y = y;
	}

}
