



// player
var player;
var head;
var currentSpeed = 0;
var playerMaxHealth = 3;
var nextHurt = 0;
var playerHealth;
var score = 0;

//barks
var barks;
var nextFire = 0;
var fireRate = 400;
var barkDamage = 1;

// enemies
var enemies;
var enemiesTotal = 0;
var enemiesAlive = 0;
var enemiesGroup;
var leashes;

// had to create a variable to store a time condition to stop displaying game over and go back to main menu
var endGame;


DontTouchMe.Game = function (game) {};
DontTouchMe.Game.prototype = {

    init: function(levelData){
        this.levelData = levelData;
    },

    create: function () {
        endGame = Infinity;
        this.world.setBounds(0, 0, this.levelData.wrldbounds.width, this.levelData.wrldbounds.height);
        grass = this.add.tileSprite(0, 0, 800, 600,'Background');
        grass.fixedToCamera = true;

        // setup player
        player = this.add.sprite(this.levelData.playerStart.x, this.levelData.playerStart.y, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.animations.add('moving', [0, 1, 2, 1], 15, true);
        player.animations.add('hurtmoving', [0, 3, 1, 3, 2, 3, 1] , 15, true);
        player.animations.add('hurtstill', [1, 3, 1] , true);
        this.physics.enable(player,Phaser.Physics.ARCADE);
        // player.body.drag.set(0.2);
        player.body.collideWorldBounds = true;
        playerHealth = playerMaxHealth;

        // head
        head = this.add.sprite(1000, 1000, 'head');
        head.anchor.setTo(0.5);
        head.animations.add('hurthead', [0, 1], 15, true);



        // hurtSound = this.add.audio('playerhurt');
        // dieSound = this.add.audio('playerdead');

        //setup barks
        barks = this.add.group();
        barks.enableBody = true;
        barks.physicsBodyType = Phaser.Physics.ARCADE;
        barks.createMultiple(100, 'bark', 0, false);
        barks.setAll('anchor.x', 0.5);
        barks.setAll('anchor.y', 0.5);
        barks.setAll('outOfBoundsKill', true);
        barks.setAll('checkWorldBounds', true);

        //setup enemies
        enemies = [];
        enemiesAlive = 0;
        enemiesGroup = this.add.group();
        enemiesGroup.enableBody = true;
        enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE;
            // sounds
        this.game.oldManDeadSound = this.add.audio('oldmandead');
        this.game.manDeadSound = this.add.audio('mandead');
            //enemy items
        leashes = this.add.group();
        leashes.enableBody = true;
        leashes.physicsBodyType = Phaser.Physics.ARCADE;
        leashes.createMultiple(30, 'leash');
        leashes.setAll('anchor.x', 0.5);
        leashes.setAll('anchor.y', 0.5);
        leashes.setAll('outOfBoundsKill', true);
        leashes.setAll('checkWorldBounds', true);

            // locations
        var locIndexCounter = 0;
        var locbucket = [];
        while (locIndexCounter <= ((this.levelData.wrldbounds.width / 100) - 2) *
                                   ((this.levelData.wrldbounds.height / 100) - 2) - 1){
            // 1 location per 100x100 square in the world that is at least 100 from the player start
            locbucket.push({x:(((locIndexCounter % ((this.levelData.wrldbounds.width / 100) - 2)) * 100) +
                               100 + this.levelData.playerStart.x) % this.levelData.wrldbounds.width,
                            y:((100 * Math.floor(locIndexCounter / ((this.levelData.wrldbounds.width / 100) - 2))) +
                               100 + this.levelData.playerStart.y) % this.levelData.wrldbounds.height});
            locIndexCounter++;
        }

        // spawn enemies randomly
        var randomloc = 0;
        var startingloc;
        var i = 0;
        while(i < this.levelData.numOldMen + 
                  this.levelData.numMen +
                  this.levelData.numChildren +
                  this.levelData.numBadDogs +
                  this.levelData.numTrainers){
            randomloc = Math.floor(Math.random()*locbucket.length);
            startingloc = locbucket.splice(randomloc, 1)[0];
            if (i < this.levelData.numOldMen){
                enemies.push(new oldMan(i, this.game, player, startingloc));
            } else if (i < this.levelData.numOldMen + this.levelData.numMen){
                enemies.push(new Man(i, this.game, player, startingloc));
            } else if (i < this.levelData.numOldMen + this.levelData.numMen + this.levelData.numChildren){
                enemies.push(new Child(i, this.game, player, startingloc));
            } else if (i < this.levelData.numOldMen + this.levelData.numMen +
                           this.levelData.numChildren + this.levelData.numBadDogs){
                enemies.push(new badDog(i, this.game, player, startingloc));
            } else if (i < this.levelData.numOldMen + this.levelData.numMen +
                           this.levelData.numChildren + this.levelData.numBadDogs +
                           this.levelData.numTrainers){
                enemies.push(new Trainer(i, this.game, player, startingloc, leashes));
            }
            i++;
        }

        // visuals
        player.bringToTop();
        head.bringToTop();
        this.camera.follow(player);
        this.camera.focusOnXY(0, 0);

        healthbar = this.add.sprite(this.camera.x, this.camera.y, playerHealth + 'heart');
        healthbar.fixedToCamera = true;
        healthbar.cameraOffset.setTo(5, 5);

        bone = this.add.sprite(this.camera.x + 760, this.camera.y + 5, 'bone');
        bone.fixedToCamera = true;
        bone.cameraOffset.setTo(760, 5);
        bonesText = this.add.text(this.camera.x + 755, this.camera.y + 3,
                    bones, {font: "32px Arial", align: "right"});
        bonesText.anchor.set(1, 0);
        bonesText.fixedToCamera = true;
        bonesText.cameraOffset.setTo(755, 3);
        // setup keys
        cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
    //check if the round should end
    if (this.time.now > endGame){
        this.quitGame();
    }

    //player movement
    if (cursors.left.isDown){
        player.angle -= 4;
    }
    else if (cursors.right.isDown){
        player.angle += 4;
    }
    if (cursors.up.isDown){
        currentSpeed = 300;
        if (this.time.now > nextHurt){
            player.animations.play('moving');
            head.animations.stop();
            head.frame = 0;
        }
        else {
           player.animations.play('hurtmoving');
           head.animations.play('hurthead');
        }
    }
    else {
        if (currentSpeed > 0) {
            currentSpeed -= 4;
        }
    }
    if (currentSpeed >= 0)
    {
        this.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
        if (currentSpeed === 0){
            if (this.time.now > nextHurt){
                player.animations.stop();
                player.frame = 1;
                head.animations.stop();
                head.frame = 0;
            }
            else {
                player.animations.play('hurtmoving');
                head.animations.play('hurthead');
            }
            
        }
    }

    if (this.input.activePointer.isDown){
        this.fire();
    }

    //Head movement
    head.x = player.x;
    head.y = player.y;
    var headAngle = this.physics.arcade.angleToPointer(head);
    var a = Math.abs(headAngle - player.rotation);
    a = a > Math.PI ? 2*Math.PI - a : a;
    if (a > Math.PI/2){
        var lowAngleBound = (player.rotation - (Math.PI/2));
        lowAngleBound =  lowAngleBound < - Math.PI ? lowAngleBound + 2*Math.PI :  lowAngleBound;
        var upAngleBound = (player.rotation + (Math.PI/2));
        upAngleBound = upAngleBound > Math.PI ? upAngleBound - 2*Math.PI : upAngleBound;
        a = Math.abs(headAngle - lowAngleBound);
        a = a > Math.PI ? 2*Math.PI - a : a;
        var b = Math.abs(headAngle - upAngleBound);
        b = b > Math.PI ? 2*Math.PI - b : b;
        headAngle = (a < b) ? lowAngleBound : upAngleBound;
    }
    head.rotation = headAngle;

    // Enemy Movment
    this.physics.arcade.collide(enemiesGroup, enemiesGroup);
    enemiesAlive = 0;
    var i;
    for (i = 0; i < enemies.length; i++){
        if (enemies[i].alive){
            enemiesAlive++;
            this.physics.arcade.overlap(barks, enemies[i].enemy, this.barkHitEnemy, null, this);
            enemies[i].update();
        }
    }

    // check if level complete
    if (enemiesAlive === 0 && endGame === Infinity){
        levelOverText = this.add.bitmapText(this.camera.x + 100, this.camera.y + 250,
                    'gooddog', 'Whew!\nYou scared them away!', 100);
        levelOverText.align = 'center';
        levelOverText.updateTransform();
        levelOverText.position.x = this.camera.x + 400 - levelOverText.textWidth / 2;
        levelOverText.position.y = this.camera.y + 300 - levelOverText.textHeight / 2;
        player.kill();
        healthbar.kill();
        head.kill();
        endGame = this.time.now + 2000;
        if (levelsComplete < this.levelData.lvlID){
            levelsComplete = this.levelData.lvlID;
        }
    }

    // when player overlaps an enemy or leash, player hurt
    this.physics.arcade.overlap(player, enemiesGroup, this.playerHit, null, this);
    this.physics.arcade.overlap(player, leashes, this.playerHit, null, this);

    // other updates
    bonesText.text = bones;
    grass.tilePosition.x = -this.camera.x;
    grass.tilePosition.y = -this.camera.y;

    },

    fire: function () {
        if (this.time.now > nextFire && barks.countDead() > 0 && endGame == Infinity){
            nextFire = this.time.now + fireRate;
            var bark = barks.getFirstExists(false);
            bark.reset(player.x, player.y);
            bark.rotation = head.rotation;
            this.physics.arcade.velocityFromRotation(bark.rotation, 500, bark.body.velocity);
        }
    },

    barkHitEnemy: function (enemy, bark){
        bark.kill();
        var destroyed = enemies[enemy.name].damage(barkDamage);
    },

    playerHit: function (player, enemy){
        if (this.time.now > nextHurt){
            nextHurt = this.time.now + 2000;
            playerHealth--;
            if (playerHealth === 0){
                // dieSound.play();
                gameOverText = this.add.bitmapText(this.camera.x + 100, this.camera.y + 250,
                    'gooddog', 'NOO! They Got You!', 100);
                gameOverText.updateTransform();
                gameOverText.position.x = this.camera.x + 400 - gameOverText.textWidth / 2;
                gameOverText.position.y = this.camera.y + 300 - gameOverText.textHeight / 2;
                player.kill();
                healthbar.kill();
                head.kill();
                endGame = this.time.now + 2000;
            } else {
                // hurtSound.play();
                healthbar.loadTexture(playerHealth + 'heart');
                if (playerHealth === 1) {
                    healthbar.animations.add('lastheart', [0, 1, 2], 5, true);
                    healthbar.animations.play('lastheart');
                }
            }
        }

    },

    quitGame: function () {
        'use strict';
        var i;
        for (i = 0; i < enemies.length; i += 1) {
            enemies[i].enemy.kill();
        }
        //  go back to the main menu.
        this.state.start('MainMenu');
    }
};
