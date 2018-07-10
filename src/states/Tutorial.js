class Tutorial extends Phaser.State {

    create() {

        // Save game progress
        localStorage.setItem('phaser_level', 'Tutorial')

        this.boxesCollected = 0

        // Make game use Phaser Arcade Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE)

        // Create timer for loop events
        this.timer = this.game.time.create(false)

        // Create map and layers
        this.map = this.game.add.tilemap('lvl_tutorial')
        this.map.addTilesetImage('tileset')

        // Manage layers
        this.bg_layer = this.map.createLayer('background_layer')
        this.dangers = this.map.createLayer('dangers_layer')
        this.ground_layer = this.map.createLayer('ground_layer')
        this.map.setLayer(this.ground_layer)
        this.bg_layer.resizeWorld()
        this.ground_layer.resizeWorld()
        this.dangers.resizeWorld()

        // Enable collision
        this.map.setCollisionBetween(1, 3, this.ground_layer)
        this.map.setCollisionBetween(7, 9, this.ground_layer)
        this.map.setCollision([10, 12], true, this.dangers)

        // Manage moving platforms
        this.moving_platforms = this.game.add.group()
        this.moving_platforms.enableBody = true
        this.moving_platforms.physicsBodyType = Phaser.Physics.ARCADE
        this.map.createFromObjects('platforms_layer', 26, 'moving_platform', 0, true, false, this.moving_platforms)
        this.moving_platforms.setAll('body.immovable', true)
        this.moving_platforms.children[0].body.velocity.x = 150
        this.moving_platforms.children[0].prev_velocity = 150

        // Vertical Platforms
        this.vertical_platforms = this.game.add.group()
        this.vertical_platforms.enableBody = true
        this.vertical_platforms.physicsBodyType = Phaser.Physics.ARCADE
        this.map.createFromObjects('v_platforms_layer', 26, 'moving_platform', 0, true, false, this.vertical_platforms)
        this.vertical_platforms.setAll('body.immovable', true)
        //this.vertical_platforms.setAll('body.velocity.y', -150)
        this.vertical_platforms.forEach((platform) => {
            platform.isActive = false
        })

        // Door
        this.doors = this.game.add.group()
        this.doors.enableBody = true
        this.doors.physicsBodyType = Phaser.Physics.ARCADE
        this.map.createFromObjects('door_layer', 25, 'door_closed', 0, true, false, this.doors)
        this.doors.forEach((door) => {
            door.topText = this.game.add.text(door.centerX, door.centerY - 100, 'Activate a panel to open', { font: '20px Helvetica', fill: '#fff', align: 'center' })
            door.topText.anchor.setTo(0.5)
            door.isActive = false
        })

        // Switches
        this.switches = this.game.add.group()
        this.switches.enableBody = true
        this.switch_click_sound = this.game.add.audio('switch_click')
        this.switches.physicsBodyType = Phaser.Physics.ARCADE
        this.map.createFromObjects('switch_layer', 27, 'switch_off', 0, true, false, this.switches)
        this.switches.forEach((elem) => {
            elem.topText = this.game.add.text(elem.centerX, elem.centerY - 70, 'Panel seems broken \n get some tools', { font: '20px Helvetica', fill: '#fff', align: 'center' })
            elem.topText.anchor.setTo(0.5)
        })

        this.switches.children[0].activateItem = (current_switch) => {
            let isActive = this.vertical_platforms.children[0].isActive
            let isboxesCollected = this.boxesCollected > 0

            if (isboxesCollected && !isActive) {
                current_switch.topText.setText('Press E to activate')
            }

            if (this.use_key.isDown && isboxesCollected && !isActive) {
                this.switch_click_sound.play()
                this.vertical_platforms.children[0].body.velocity.y = -150
                this.vertical_platforms.children[0].isActive = true
                this.vertical_platforms.children[1].body.velocity.y = -150
                this.vertical_platforms.children[1].isActive = true
                this.timer.loop(2900, this.changeDirection, this.vertical_platforms.children[0])
                this.timer.loop(2900, this.changeDirection, this.vertical_platforms.children[1])
                this.moving_platforms.children[1].body.velocity.x = -250
                this.moving_platforms.children[1].prev_velocity = -250
                this.moving_platforms.children[2].body.velocity.x = 250
                this.moving_platforms.children[2].prev_velocity = 250
                this.timer.start()
                current_switch.loadTexture('switch_on', 0)
                current_switch.topText.setText('Panel is active')
            }
        }

        this.switches.children[1].activateItem = (current_switch) => {
            let isActive = this.doors.children[0].isActive
            let isboxesCollected = this.boxesCollected > 0

            if (isboxesCollected && !isActive) {
                current_switch.topText.setText('Press E to activate')
            }

            if (this.use_key.isDown && isboxesCollected && !isActive) {
                this.switch_click_sound.play()
                this.doors.children[0].loadTexture('door_open', 0)
                this.doors.children[0].topText.setText('Press E')
                this.doors.children[0].isActive = true
                current_switch.loadTexture('switch_on', 0)
                current_switch.topText.setText('Panel is active')
            }
        }

        // Collectable
        this.collectable = this.game.add.group()
        this.collectable.enableBody = true
        this.map.createFromObjects('data_layer', 32, 'box_img', 0, true, false, this.collectable)

        // Create player
        this.player = this.game.add.sprite(32, this.game.world.height - 250, 'robot')
        this.player.scale.setTo(0.7)
        this.player_jump = this.game.add.audio('jump_sound')

        // Enable physics for player
        this.game.physics.arcade.enable(this.player)
        this.player.body.gravity.y = 2000
        this.player.body.maxVelocity = 800
        this.player.body.collideWorldBounds = true
        this.player.anchor.set(0.5)

        // Animations for player
        this.player.animations.add('run_right', [7, 8, 9, 10], 15)
        this.player.animations.add('run_left', [11, 12, 13, 14], 15)
        this.player.animations.add('stand_idle', [0])

        // Keyboard input handle
        this.left_key = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        this.right_key = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        this.jump_key = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
        this.use_key = this.game.input.keyboard.addKey(Phaser.Keyboard.E)

        // Texts 
        this.text_first = this.game.add.text(50, this.game.world.height - 350,'Use A, D keys for movement', { font: '25px Helvetica', fill: '#fff', align: 'center' })
        this.text_jump_first = this.game.add.text(850, this.game.world.height - 350,'Use W for jumping', { font: '25px Helvetica', fill: '#fff', align: 'center' })
    }

    update () {

        // Reset values
        this.reset()

        // Makes camera follow player
        this.game.camera.follow(this.player)

        // Enable collisions
        this.game.physics.arcade.collide(this.player, this.ground_layer)
        this.game.physics.arcade.collide(this.player, this.dangers, this.gameOver, null, this)
        this.game.physics.arcade.collide(this.player, this.moving_platforms, this.playerOnPlatform, null, this)
        this.game.physics.arcade.collide(this.player, this.vertical_platforms, this.playerOnPlatform, null, this)
        this.game.physics.arcade.collide(this.player, this.collectable, this.collect, null, this)
        this.game.physics.arcade.collide(this.ground_layer, this.moving_platforms, this.platformsCallback)

        // Overlapping
        this.switches.children.forEach((elem) => {
            this.game.physics.arcade.overlap(this.player, elem, this.switchHandle, null, this)
        })

        this.doors.children.forEach((elem) => {
            this.game.physics.arcade.overlap(this.player, elem, this.doorHandle, null, this)
        })
        
        // Player movement handle 
        if (this.jump_key.isDown && this.player.body.onFloor()) {
            this.player_jump.play()
            this.player.body.velocity.y = -750
        } else if (this.right_key.isDown) {
            this.player.body.velocity.x = 500
            this.player.animations.play('run_right')
        } else if (this.left_key.isDown) {
            this.player.body.velocity.x = -500
            this.player.animations.play('run_left')
        } else {
            this.player.body.velocity.x = 0
            this.player.animations.play('stand_idle')
        }
    }

    gameOver (player, tile) {
        this.game.state.start('GameOver')
    }

    platformsCallback (platform, ground) {
        platform.prev_velocity *= -1
        platform.body.velocity.x = platform.prev_velocity
    }

    switchHandle (player, item) {
        item.topText.visible = true
        item.activateItem(item)
    }

    playerOnPlatform (player, platform) {
        let isTouchingDown = player.body.touching.down

        if (this.jump_key.isDown && isTouchingDown) {
            player.body.velocity.y = -750
        }
    }

    changeDirection() {
        this.body.velocity.y *= -1 
        this.body.velocity.x *= -1 
    }

    reset () {
        this.switches.forEach((item) => {
            item.topText.visible = false
        })

        this.doors.forEach((item) => {
            item.topText.visible = false
        })
    }

    collect (player, obj) {
        obj.kill()
        this.boxesCollected += 1
    }

    doorHandle (player, door) {
        door.topText.visible = true

        if (door.isActive && this.use_key.isDown) {
            alert('Congratulations, level cleared')
        }
    }

}

export default Tutorial
