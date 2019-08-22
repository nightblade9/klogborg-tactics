Game = {
    // This defines our grid's size and the size of each of its tiles
    view: {
      width: 960,
      height: 540,
    },

    start: function() {
      Crafty.init(Game.view.width, Game.view.height);
    }
  }

window.addEventListener('load', Game.start);