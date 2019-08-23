Game = {
    view: {
      width: 960,
      height: 512,
    },

    start: function() {
      Crafty.init(Game.view.width, Game.view.height);
      this.grid = Crafty.e("Map")
      grid.initialize(15, 8);

      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          Crafty.e("GridTile").initialize(x, y).move(x * 64, y * 64);
        }
      }

      var red = Crafty.e("SquadMate");
      red.initialize("red", grid, 2, 4);
    }
  }

window.addEventListener('load', Game.start);