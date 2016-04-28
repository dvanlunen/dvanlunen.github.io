
BasicGame.Game = function (game) {

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







// Enemy parent class
function Enemy(index, game, player, bullets){
    this.game = game;
    this.player = player;
    this.bullet = bullets;
    this.alive = true;
    var x = game.rnd.integerInRange(1100, 2900) % 2000;
    var y = game.rnd.integerInRange(1100, 2900) % 2000;
    this.health = 0;
    this.image = null;
}

Enemy.prototype.damage = function(damage){
    this.health -= damage;
    if (this.health <=0){
        this.alive = false;
        this.image.kill();
        return true;
    }
    return false;
};

Enemy.prototype.update = function() {
    this.image.rotation = this.game.physics.arcade.angleBetween(this.image, this.player);
    this.game.physics.arcade.velocityFromRotation(this.image.rotation, this.speed, this.image.body.velocity);
};

function oldMan(){
    Enemy.call(this);
}














Enemy = function(index, game, player, bullets, health, image, speed, firerate){
    // random spawn locations at least 100 away from player start
    var x = game.rnd.integerInRange(1100, 2900) % 2000;
    var y = game.rnd.integerInRange(1100, 2900) % 2000;

    this.game = game;
    this.health = health;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = firerate;
    this.nextFire = 0;
    this.alive = true;
    this.speed = speed;
    this.image = game.add.sprite(x, y, image);
    this.image.animations.add('oldmanmoves', [0, 1, 2], 15, true);
    this.image.animations.play('oldmanmoves');
    enemiesGroup.add(this.image);



    this.image.anchor.set(0.5);
    this.image.name = index.toString();
    this.game.physics.enable(this.image, Phaser.Physics.ARCADE);
    this.image.body.immovable = false;
    this.image.body.collideWorldBounds = true;
    this.image.body.bounce.setTo(1, 1);
    this.image.rotation = this.game.physics.arcade.angleBetween(this.image, this.player);
    this.game.physics.arcade.velocityFromRotation(this.image.rotation, this.speed, this.image.body.velocity);
};

Enemy.prototype.damage = function(damage){
    this.health -= damage;
    if (this.health <=0){
        this.alive = false;
        this.image.kill();
        return true;
    }
    return false;
};

Enemy.prototype.update = function() {
    this.image.rotation = this.game.physics.arcade.angleBetween(this.image, this.player);
    this.game.physics.arcade.velocityFromRotation(this.image.rotation, this.speed, this.image.body.velocity);
};




var player;
var currentSpeed = 0;
var barks;
var nextFire = 0;
var fireRate = 400;
var barkDamage = 1;
var bones = 0;

var enemies;
var enemyBullets;
var enemiesTotal = 0;
var enemiesAlive = 0;
var enemiesGroup;

BasicGame.Game.prototype = {

    create: function () {
        this.game.world.setBounds(0, 0, 2000, 2000);
        grass = this.game.add.tileSprite(0, 0, 800, 800,'Background');
        grass.fixedToCamera = true;

        // setup player
        player = this.game.add.sprite(1000, 1000, 'player');
        player.anchor.setTo(0.5, 0.5);
        player.animations.add('moving', [0, 1, 2], 15, true);
        this.game.physics.enable(player,Phaser.Physics.ARCADE);
        player.body.drag.set(0.2);
        player.body.maxVelocity.setTo(400,400);
        player.body.collideWorldBounds = true;
        barks = this.game.add.group();
        barks.enableBody = true;
        barks.physicsBodyType = Phaser.Physics.ARCADE;
        barks.createMultiple(30, 'bark', 0, false);
        barks.setAll('anchor.x', 0.5);
        barks.setAll('anchor.y', 0.5);
        barks.setAll('outOfBoundsKill', true);
        barks.setAll('checkWorldBounds', true);

        enemies = [];
        enemiesTotal = 20;
        enemiesAlive = 20;
        enemiesGroup = this.game.add.physicsGroup();

        for (var i = 0; i < enemiesTotal; i++) {
            enemies.push(new Enemy(i, this.game, player, enemyBullets, 1, 'oldman', 50, 100));

        }

        player.bringToTop();

        this.game.camera.follow(player);
        this.game.camera.focusOnXY(0, 0);

        cursors = this.game.input.keyboard.createCursorKeys();

        

    },

    update: function () {

    this.game.physics.arcade.collide(enemiesGroup, enemiesGroup);
        // player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        player.angle -= 4;
    }
    else if (cursors.right.isDown)
    {
        player.angle += 4;
    }

    if (cursors.up.isDown)
    {
        //  The speed we'll travel at
        currentSpeed = 300;
        player.animations.play('moving');
    }
    else
    {
        if (currentSpeed > 0)
        {
            currentSpeed -= 4;
        }
    }

    if (currentSpeed >= 0)
    {
        this.game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
        if (currentSpeed === 0){
            player.animations.stop();
            player.frame = 1;
        }
    }


    if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)){
        this.fire();
    }

    //enemies move toward player
    enemiesAlive = 0;
    for (var i = 0; i < enemies.length; i++){
        if (enemies[i].alive){
            enemiesAlive++;
            this.physics.arcade.overlap(barks, enemies[i].image, this.barkHitEnemy, null, this);
            enemies[i].update();
        }
    }



    grass.tilePosition.x = -this.game.camera.x;
    grass.tilePosition.y = -this.game.camera.y;
    },

    fire: function () {
        if (this.game.time.now > nextFire && barks.countDead() > 0){
            nextFire = this.game.time.now + fireRate;
            var bark = barks.getFirstExists(false);
            bark.reset(player.x, player.y);
            bark.rotation = player.rotation;
            this.game.physics.arcade.velocityFromRotation(bark.rotation, 600, bark.body.velocity);
        }
    },

    barkHitEnemy: function (enemy, bark){
        bark.kill();
        var destroyed = enemies[enemy.name].damage(barkDamage);
        // if (destroyed){
         //   var
        //}
    },


    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        // this.game.state.start('MainMenu');

    }

};
