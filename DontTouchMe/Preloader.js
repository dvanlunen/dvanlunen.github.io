
DontTouchMe.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

DontTouchMe.Preloader.prototype = {

	preload: function () {
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'Background');
		this.preloadBar = this.add.sprite(200, 268, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		// Load all assets

			//audio
		this.load.audio('titleMusic', ['audio/MenuMusic.ogg']);
		// this.load.audio('playerdead', ['audio/dogdead.ogg']);
		// this.load.audio('playerhurt', ['audio/doghit.ogg']);
		this.load.audio('oldmandead', ['audio/oldmandead.ogg']);
		this.load.audio('mandead', ['audio/mandead.ogg']);

			//images
		this.load.spritesheet('player', 'images/dogsheet.png', 64, 64, 4);
		this.load.spritesheet('head', 'images/doghead.png', 32, 32, 2);
		this.load.image('bark', 'images/bark.png');
		this.load.spritesheet('oldman', 'images/oldman.png', 64, 64);
		this.load.spritesheet('man','images/man.png', 64, 64);
		this.load.spritesheet('child','images/child.png', 32, 32);
		this.load.spritesheet('baddog','images/baddog.png', 64, 64);
		this.load.spritesheet('trainer','images/trainer.png', 64, 64);
		this.load.image('leash', 'images/leash.png');



		this.load.image('6heart','images/6heart.png');
		this.load.image('5heart','images/5heart.png');
		this.load.image('4heart','images/4heart.png');
		this.load.image('3heart','images/3heart.png');
		this.load.image('2heart','images/2heart.png');
		this.load.spritesheet('1heart','images/1heart.png',32,32);
		this.load.image('bone','images/bone.png');
		this.load.spritesheet('iconbutton1','images/iconbutton1.png', 80, 80);
		this.load.spritesheet('iconbutton2','images/iconbutton2.png', 80, 80);
		this.load.spritesheet('iconbutton3','images/iconbutton3.png', 80, 80);
		this.load.spritesheet('iconbutton4','images/iconbutton4.png', 80, 80);
		this.load.spritesheet('iconbutton5','images/iconbutton5.png', 80, 80);



		this.load.image('locklvl','images/lockedlevel.png');
		this.load.spritesheet('widebutton','images/WideButton.png', 260, 40);
		this.load.image('lockwide','images/WideButtonLocked.png');

			//font
		this.load.bitmapFont('gooddog', 'font/gooddog.png', 'font/gooddog.fnt');
	},

	create: function () {
		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;
	},

	update: function () {
		if (this.cache.isSoundDecoded('titleMusic')  &&  this.ready === false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}
	}
};
