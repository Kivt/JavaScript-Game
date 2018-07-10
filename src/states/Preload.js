class Preload extends Phaser.State {

    preload() {
        // loading bar image
        this.game.load.image('loader', 'img/bg/loading.png');
    }

    create() {
        this.game.state.start('Splash')
    }

}

export default Preload
