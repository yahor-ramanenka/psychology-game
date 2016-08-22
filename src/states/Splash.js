import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
		this.loaderBg.anchor.setTo(0.5)
		this.loaderBar.anchor.setTo(0.5)

    this.load.setPreloadSprite(this.loaderBar)

		this.load.image('crosshair', 'assets/images/crosshair.png')
		this.load.image('miss', 'assets/images/miss.png')
		this.load.image('bang', 'assets/images/bang.png')
		this.load.image('target', 'assets/images/target.png')

  }

  create () {
    this.state.start('Tutorial')
  }

}
