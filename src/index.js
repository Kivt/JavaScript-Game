import { Menu, Main, Preload, Splash, Tutorial, GameOver } from 'states/'

class Game extends Phaser.Game {

    constructor() {
        super(800, 600, Phaser.AUTO, 'content', null)

        // Global variables, like background music, etc.
        this.global = {}

        // Initialize game states
        this.state.add('Preload', Preload, false)
        this.state.add('Splash', Splash, false)
        this.state.add('Menu', Menu, false)
        this.state.add('Tutorial', Tutorial, false)
        this.state.add('GameOver', GameOver, false)

        this.state.start('Preload')
    }

}

new Game();
