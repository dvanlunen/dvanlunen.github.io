
var levelsComplete = 0;

TeddyNotReady.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

TeddyNotReady.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic', 1, true);
		this.music.play();
		this.background = this.add.sprite(0, 0, 'Background');

		var i = 1;
		var x;
		var y;
		var levelButtons = [];
		while (i < 17){
			x = 100 + ((i-1) % 4)*100;
			y = 100 + 100 * Math.floor((i-1)/4);
			this.add.image(x, y, 'locklvl');
			if (i < levelsComplete + 2){
				levelButtons.push(this.add.button(x, y, 'iconbutton', this.startGame, this, 0, 1, 2));
				levelButtons[i-1].name = i;
			}

			i++;
		}
		i = 1;
		while (i < 5){
			this.add.image(520, 16 + 100*i, 'lockwide');
			i++;
		}



	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {
		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Level' + pointer.name);

	}

};
