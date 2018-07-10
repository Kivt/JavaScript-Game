import { Main, Menu } from 'index.js'

class Splash extends Phaser.State {

    preload() {
         // Show loader bar
        let loader = this.game.add.sprite(this.game.world.centerX - (387 * 0.5), 400, "loader")    

        // Make phaser use our loader image as actual loader
        this.game.load.setPreloadSprite(loader)                                                     

        this.loadMaps()
        this.loadImages()
        this.loadSounds()
        this.setGlobal()
    }

    create() {
        this.playBgMusic()
        this.game.state.start('Menu')
    }

    loadImages () {
        this.game.load.image('bg_sky', 'img/bg/sky.png')
        this.game.load.image('bg_gameover', 'img/bg/gameover.jpg')
        this.game.load.image('moving_platform', 'img/tiles/platform.png')
        this.game.load.image('switch_off', 'img/tiles/SwitchOff.png')
        this.game.load.image('switch_on', 'img/tiles/SwitchOn.png')
        this.game.load.image('door_open', 'img/tiles/DoorOpen.png')
        this.game.load.image('door_closed', 'img/tiles/DoorLocked.png')
        this.game.load.image('box_img', 'img/tiles/box.png')

        // Spritesheets, third and fourth parameters are width and height of single sprite
        this.game.load.spritesheet('menu_button', 'img/buttons/menu_button.png', 340, 130)
        this.game.load.spritesheet('robot', 'img/tiles/robot.png', 80, 120)

        // Tilesets
        this.game.load.image('tileset', 'img/tiles/tileset.png')
    }

    loadSounds () {
        this.game.load.audio('bg_music', 'audio/dangerous.mp3')
        this.game.load.audio('laser_simple', 'audio/laser_simple.wav')
        this.game.load.audio('button_click', 'audio/menu_button_click.mp3')
        this.game.load.audio('switch_click', 'audio/switch_click.mp3')
        this.game.load.audio('jump_sound', 'audio/jump_sound.wav')
    }

    playBgMusic () {
        this.game.global.bg_music = this.game.add.audio('bg_music')
        this.game.global.bg_music.loop = true
        this.game.global.bg_music.play()
    }

    loadMaps () {
        this.game.load.tilemap('lvl_tutorial', 'maps/tutorial.json', null, Phaser.Tilemap.TILED_JSON)
    }

    setGlobal () {
        this.game.global.player = {
            dataCollected: 0
        }
    }

}

export default Splash
