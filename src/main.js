Game = {
    view: {
      width: 960,
      height: 512,
    },

    gridSize: {
      width: 15,
      height: 8
    },

    start: function() {
      Crafty.init(Game.view.width, Game.view.height);
      for (const y of Array(Game.gridSize.height).keys()) {
        for (const x of Array(Game.gridSize.width).keys()) {
          Crafty.e("GridTile").move(x * 64, y * 64);
        }
      }
    }
  }

window.addEventListener('load', Game.start);