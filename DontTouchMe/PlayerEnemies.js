// subclass creator
// var subclass = function (Parent, Child) {
//   Child.prototype = Object.create(Parent.prototype);
//   Child.prototype.superclass = Parent;
//   Child.prototype.constructor = Child;
//   Child.prototype.superproto = Parent.prototype;
//   return Child;
// };



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
    this.enemy = this.game.add.sprite(this.locslot.x, this.locslot.y, spritename);
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
        this.deathSound.play();
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
    this.speed = 80;
    this.animspeed = 5;
    this.addEnemySprite('oldman','oldmanmove');
    this.value = 1;
    this.deathSound = game.oldManDeadSound;
}
oldMan.prototype = Object.create(Enemy.prototype);
oldMan.prototype.constructor = oldMan;

// Man
function Man(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 1;
    this.speed = 200;
    this.animspeed = 10;
    this.addEnemySprite('man','manmove');
    this.value = 3;
    this.deathSound = game.manDeadSound;
}
Man.prototype = Object.create(Enemy.prototype);
Man.prototype.constructor = Man;

// Child
function Child(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 1;
    this.speed = 250;
    this.animspeed = 15;
    this.addEnemySprite('child','childmove');
    this.value = 6;
    this.deathSound = game.manDeadSound;
}
Child.prototype = Object.create(Enemy.prototype);
Child.prototype.constructor = Child;

// BadDog
function badDog(index, game, player, locslot){
    Enemy.call(this, index, game, player, locslot);
    this.health = 1;
    this.speed = 300;
    this.animspeed = 15;
    this.addEnemySprite('baddog','baddogmoving');
    this.value = 10;
    this.deathSound = game.manDeadSound;
}
badDog.prototype = Object.create(Enemy.prototype);
badDog.prototype.constructor = badDog;

// Trainer

function Trainer(index, game, player, locslot, leashes){
    Enemy.call(this, index, game, player, locslot);
    this.health = 1;
    this.speed = 200;
    this.animspeed = 15;
    this.addEnemySprite('trainer','trainermoving');
    this.value = 10;
    this.deathSound = game.manDeadSound;
    this.nextFire = 0;
    this.leashes = leashes;
    this.fireRate = 1500;
}
Trainer.prototype = Object.create(Enemy.prototype);
Trainer.prototype.constructor = Trainer;
    // Trainer has new update function because tossed leashes
Trainer.prototype.update = function() {
    this.enemy.rotation = this.game.physics.arcade.angleBetween(this.enemy, this.player);
    this.game.physics.arcade.velocityFromRotation(this.enemy.rotation, this.speed, this.enemy.body.velocity);
    if (this.game.physics.arcade.distanceBetween(this.enemy,this.player) < 300){
        if (this.game.time.now > this.nextFire && this.leashes.countDead() > 0){
            this.nextFire = this.game.time.now + this.fireRate;
            var leash = this.leashes.getFirstDead();
            leash.reset(this.enemy.x, this.enemy.y);
            leash.rotation = this.game.physics.arcade.moveToObject(leash, this.player, 500);
        }
    }
};