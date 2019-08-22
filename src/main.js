Game = {
    view: {
      width: 960,
      height: 512,
    },

    start: function() {
      Crafty.init(Game.view.width, Game.view.height);
      this.grid = Crafty.e("Map");
      grid.initialize(15, 8);
      grid.set(3, 7, "hi");
      console.log(grid.get(3, 7));

      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          Crafty.e("GridTile").move(x * 64, y * 64);
        }
      }
    }
  }

window.addEventListener('load', Game.start);