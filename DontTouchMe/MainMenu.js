
var levelsComplete = 0;
var levelsData = [
	{lvlID: 1, 
     wrldbounds: {width:2000, height:2000},
     playerStart: {x: 1000, y: 1000},
     numOldMen: 10,
     numMen: 0,
     numChildren: 0,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 2, 
     wrldbounds: {width:2000, height:2000},
     playerStart: {x: 1000, y: 1000},
     numOldMen: 5,
     numMen: 15,
     numChildren: 0,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 3, 
     wrldbounds: {width:2000, height:2000},
     playerStart: {x: 1000, y: 1000},
     numOldMen: 5,
     numMen: 5,
     numChildren: 10,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 4, 
     wrldbounds: {width:2000, height:2000},
     playerStart: {x: 1000, y: 1000},
     numOldMen: 5,
     numMen: 5,
     numChildren: 5,
     numBadDogs: 0,
   	 numTrainers: 5},
   	{lvlID: 5, 
     wrldbounds: {width:2000, height:2000},
     playerStart: {x: 1000, y: 1000},
     numOldMen: 0,
     numMen: 0,
     numChildren: 0,
     numBadDogs: 4,
   	 numTrainers: 0},
   	{lvlID: 6, 
     wrldbounds: {width:800, height:2000},
     playerStart: {x: 400, y: 1000},
     numOldMen: 20,
     numMen: 5,
     numChildren: 5,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 7, 
     wrldbounds: {width:800, height:2000},
     playerStart: {x: 400, y: 1000},
     numOldMen: 5,
     numMen: 15,
     numChildren: 5,
     numBadDogs: 0,
   	 numTrainers: 2},
   	{lvlID: 8, 
     wrldbounds: {width:800, height:2000},
     playerStart: {x: 400, y: 1000},
     numOldMen: 5,
     numMen: 5,
     numChildren: 10,
     numBadDogs: 0,
   	 numTrainers: 2},
   	{lvlID: 9, 
     wrldbounds: {width:800, height:2000},
     playerStart: {x: 400, y: 1000},
     numOldMen: 5,
     numMen: 5,
     numChildren: 5,
     numBadDogs: 2,
   	 numTrainers: 10},
   	{lvlID: 10, 
     wrldbounds: {width:800, height:2000},
     playerStart: {x: 400, y: 1000},
     numOldMen: 0,
     numMen: 0,
     numChildren: 0,
     numBadDogs: 6,
   	 numTrainers: 0},
   	{lvlID: 11, 
     wrldbounds: {width:2000, height:600},
     playerStart: {x: 1000, y: 300},
     numOldMen: 35,
     numMen: 0,
     numChildren: 0,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 12, 
     wrldbounds: {width:2000, height:600},
     playerStart: {x: 1000, y: 300},
     numOldMen: 5,
     numMen: 20,
     numChildren: 5,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 13, 
     wrldbounds: {width:2000, height:600},
     playerStart: {x: 1000, y: 300},
     numOldMen: 0,
     numMen: 0,
     numChildren: 30,
     numBadDogs: 0,
   	 numTrainers: 0},
   	{lvlID: 14, 
     wrldbounds: {width:2000, height:600},
     playerStart: {x: 1000, y: 300},
     numOldMen: 0,
     numMen: 2,
     numChildren: 10,
     numBadDogs: 0,
   	 numTrainers: 10},
   	{lvlID: 15, 
     wrldbounds: {width:2000, height:600},
     playerStart: {x: 1000, y: 300},
     numOldMen: 0,
     numMen: 0,
     numChildren: 0,
     numBadDogs: 8,
   	 numTrainers: 2},
   	{lvlID: 16, 
     wrldbounds: {width:2000, height:2000},
     playerStart: {x: 1000, y: 1000},
     numOldMen: 324,
     numMen: 0,
     numChildren: 0,
     numBadDogs: 0,
   	 numTrainers: 0},

                 ];

DontTouchMe.MainMenu = function (game) {

    this.music = null;
    this.playButton = null;

};

DontTouchMe.MainMenu.prototype = {

    create: function () {

        //    We've already preloaded our assets, so let's kick right into the Main Menu itself.
        //    Here all we're doing is playing some music and adding a picture and button

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
                levelButtons.push(this.add.button(x, y, 'iconbutton' + (((i-1) % 5) + 1).toString(), this.startGame, this, 0, 1, 2));
                levelButtons[i-1].name = i-1;
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

    },

    startGame: function (pointer) {
        //    Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
        this.music.stop();

        //    And start the actual game
        this.state.start('Game', true, false, levelsData[pointer.name]);

    }

};
