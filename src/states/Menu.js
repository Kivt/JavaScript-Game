class Menu extends Phaser.State {

    create() {
        // Background
        let bg_gameover = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg_gameover')

        let start_button = this.game.add.button(this.game.width - 150, 250, 'menu_button', this.onStartButtonClick, this, 0, 0, 1)
        start_button.click_sound = this.game.add.audio('button_click')
        start_button.text = this.game.add.text(this.game.width - 150, 255, 'Start Game', { font: '40px Helvetica', fill: '#eeff00', align: 'center' })

        /*
        * By default position calculates from top left corner of object,
        * anchor setTo(0.5) means that position will be calculated from center of object
        */
        start_button.text.anchor.setTo(0.5)
        start_button.anchor.setTo(0.5)
        start_button.scale.setTo(0.7, 0.6)
    }

    onStartButtonClick (button) {
        button.click_sound.play()
        this.game.state.start('Tutorial')
    }
}

export default Menu
