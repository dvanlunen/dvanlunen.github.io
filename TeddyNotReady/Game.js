
TeddyNotReady.Level1 = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

// enemy super class
function Enemy(index, game, player, locslot){
    this.index = index;
    this.game = game;
    this.player = player;
    this.alive = true;
    this.health = 0;
    this.speed = 0;
    this.animspeed = 15;
    this.locslot = locslot;
    // this.deathSound = this.game.oldManDeadSound;
}
// locslot is an integer between 0 and 323=18^2-1
// that determines spawn locations

Enemy.prototype.addEnemySprite = function(spritename, animationname){
    var x = (((this.locslot % 18) * 100) + 1100) % 2000;
    var y = ((100 * Math.floor(this.locslot / 18)) + 1100) % 2000;
    this.enemy = this.game.add.sprite(x, y, spritename);
    enemiesGroup.add(this.enemy);
    this.enemy.anchor.set(0.5);
    this.enemy.name = this.index.toString();
    this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(2, 2);
    this.enemy.animations.add(animationname, [0, 1, 2, 1], this.animspeed, true);
    this.enemy.animations.play(animationname);
    this.value = 0;
};

Enemy.prototype.damage = function(damage){
    this.health -= damage;
    if (this.health <=0){
        this.alive = false;
        this.enemy.kill();
        bones = bones + this.value;
        // this.deathSound.play();
        return true;
    }
    return false;
};

Enemy.prototype.update = function() {
    this.enemy.rotation = this.game.physics.arcade.angleBetween(this.enemy, this.player);
    this.game.physics.arcade.velocityFromRotation(this.enemy.rotation, this.speed, this.enemy.body.velocity);
};

// Enemy Children classes

// Old Man
function oldMan(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 1;
    this.speed = 70;
    this.animspeed = 5;
    this.addEnemySprite('oldman','oldmanmove');
    this.value = 1;
    // this.deathSound = oldManDeadSound;
}
oldMan.prototype = Object.create(Enemy.prototype);
oldMan.prototype.constructor = oldMan;

// Man
function Man(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 2;
    this.speed = 100;
    this.animspeed = 10;
    this.addEnemySprite('man','manmove');
    this.value = 3;
    // this.deathSound = manDeadSound;
}
Man.prototype = Object.create(Enemy.prototype);
Man.prototype.constructor = Man;

// Old Man
function oldMan(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 1;
    this.speed = 70;
    this.animspeed = 5;
    this.addEnemySprite('oldman','oldmanmove');
    this.value = 1;
    // this.deathSound = oldManDeadSound;
}
oldMan.prototype = Object.create(Enemy.prototype);
oldMan.prototype.constructor = oldMan;

// Man
function Man(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 2;
    this.speed = 100;
    this.animspeed = 10;
    this.addEnemySprite('man','manmove');
    this.value = 3;
    // this.deathSound = manDeadSound;
}
Man.prototype = Object.create(Enemy.prototype);
Man.prototype.constructor = Man;

// bones
var bones = 0;
var bonesText;


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
var enemyBullets;
// var oldManDeadSound;
// var manDeadSound;

// had to create a variable to story a time condition to stop displaying game over and go back to main menu
var endGame;





TeddyNotReady.Level1.prototype = {

    create: function () {
        endGame = Infinity;
        this.world.setBounds(0, 0, 2000, 2000);
        grass = this.add.tileSprite(0, 0, 800, 800,'Background');
        grass.fixedToCamera = true;

        // setup player
        player = this.add.sprite(1000, 1000, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.animations.add('moving', [0, 1, 2, 1], 15, true);
        player.animations.add('hurtmoving', [0, 3, 1, 3, 2, 3, 1] , 15, true);
        player.animations.add('hurtstill', [1, 3, 1] , true);
        this.physics.enable(player,Phaser.Physics.ARCADE);
        player.body.drag.set(0.2);
        player.body.maxVelocity.setTo(400,400);
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
        barks.createMultiple(30, 'bark', 0, false);
        barks.setAll('anchor.x', 0.5);
        barks.setAll('anchor.y', 0.5);
        barks.setAll('outOfBoundsKill', true);
        barks.setAll('checkWorldBounds', true);

        //setup enemies
        // oldManDeadSound = this.add.audio('oldmandead');
        // manDeadSound = this.add.audio('mandead');

        enemies = [];
        enemiesTotal = 20;
        enemiesAlive = 20;
        enemiesGroup = this.add.group();
        enemiesGroup.enableBody = true;
        enemiesGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // create an array of slots that determine enemy spawn location
        var startingloc = 0;
        var locbucket = [];
        while (startingloc <= 323){
            locbucket.push(startingloc++);
        }

        // spawn enemies
        var randomloc = 0;
        for (var i = 0; i < 10; i++) {
            randomloc = Math.floor(Math.random()*locbucket.length);
            startingloc = locbucket.splice(randomloc, 1)[0];
            enemies.push(new oldMan(i, this.game, player,startingloc));

        }
        for (i = 10; i < enemiesTotal; i++) {
            randomloc = Math.floor(Math.random()*locbucket.length);
            startingloc = locbucket.splice(randomloc, 1)[0];
            enemies.push(new Man(i, this.game, player,startingloc));

        }


        // visuals
        player.bringToTop();
        head.bringToTop();
        this.camera.follow(player);
        this.camera.focusOnXY(0, 0);
        healthbar = this.add.sprite(this.camera.x, this.camera.y, playerHealth + 'heart');
        bone = this.add.sprite(this.camera.x + 760, this.camera.y + 5, 'bone');
        bonesText = this.add.text(this.camera.x + 755, this.camera.y + 3,
                    bones, {font: "32px Arial", align: "right"});
        bonesText.anchor.set(1, 0);

        // setup keys
        cursors = this.input.keyboard.createCursorKeys();
        

    },

    update: function () {
    if (this.time.now > endGame){
        this.quitGame();
    }
    healthbar.x = this.camera.x + 5;
    healthbar.y = this.camera.y + 5;
    bonesText.x = this.camera.x + 755;
    bonesText.y = this.camera.y + 3;
    bonesText.text = bones;
    bone.x = this.camera.x + 760;
    bone.y = this.camera.y + 5;
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

    this.physics.arcade.collide(enemiesGroup, enemiesGroup);
    if (cursors.left.isDown){
        player.angle -= 4;
    }
    else if (cursors.right.isDown){
        player.angle += 4;
    }

    if (cursors.up.isDown){
        //  The speed we'll travel at
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

    //enemies move toward player
    enemiesAlive = 0;
    for (var i = 0; i < enemies.length; i++){
        if (enemies[i].alive){
            enemiesAlive++;
            this.physics.arcade.overlap(barks, enemies[i].enemy, this.barkHitEnemy, null, this);
            enemies[i].update();
        }
    }

  
    this.physics.arcade.overlap(player, enemiesGroup, this.playerHit, null, this);
    
   
    grass.tilePosition.x = -this.camera.x;
    grass.tilePosition.y = -this.camera.y;

    },

    fire: function () {
        if (this.time.now > nextFire && barks.countDead() > 0){
            nextFire = this.time.now + fireRate;
            var bark = barks.getFirstExists(false);
            bark.reset(player.x, player.y);
            bark.rotation = head.rotation;
            // this.physics.arcade.moveToPointer(bark, 400, this.input.activePointer);
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
                    'gooddog', 'NOO, You Got Petted!', 100);
                gameOverText.updateTransform();
                gameOverText.position.x = this.camera.x + 400 - gameOverText.textWidth / 2;
                gameOverText.position.y = this.camera.y + 300 - gameOverText.textHeight / 2;
                player.kill();
                healthbar.kill();
                head.kill();
                endGame = this.time.now + 3000;
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

    quitGame: function (pointer) {
        
        for (var i = 0; i < enemies.length; i++){
            enemies[i].enemy.kill();
        }
        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
