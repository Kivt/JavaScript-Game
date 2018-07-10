class GameOver extends Phaser.State {

    create() {
        let centerX = this.game.width * 0.5
        let centerY = this.game.height * 0.5
        let bg_gameover = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg_gameover')

        let restart_button = this.game.add.button(centerX, centerY, 'menu_button', this.restart, this, 0, 0, 1)
        restart_button.click_sound = this.game.add.audio('button_click')
        restart_button.text = this.game.add.text(centerX, centerY + 5, 'Restart Game', { font: '40px Helvetica', fill: '#ee0000', align: 'center' });
        restart_button.text.anchor.setTo(0.5)
        restart_button.anchor.setTo(0.5)
        restart_button.scale.setTo(1, 0.7)
    }

    restart () {
        this.game.state.start(localStorage.getItem('phaser_level'))
    }

}

export default GameOver
