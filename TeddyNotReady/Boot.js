var TeddyNotReady = {};

TeddyNotReady.Boot = function (game) {

};

TeddyNotReady.Boot.prototype = {

    init: function () {
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.setMinMax(400, 400, 1000, 1000);
        this.scale.forceLandscape = true;
        this.scale.pageAlignHorizontally = true;

        if (this.game.device.desktop)
        {
            this.scale.pageAlignHorizontally = true;

        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        }

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('Background', 'images/grass.png');
        this.load.image('preloaderBar', 'images/loadbar.png');

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }

};
