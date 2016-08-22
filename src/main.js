import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import TutorialState from './states/Tutorial'

import CONST from './const/const'

class Game extends Phaser.Game {

  constructor () {
    super(CONST.SCREEN.WIDTH, CONST.SCREEN.HEIGHT, Phaser.AUTO, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
		this.state.add('Tutorial', TutorialState, false)

    this.state.start('Boot')
  }
}

window.game = new Game()
