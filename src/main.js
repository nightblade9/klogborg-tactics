Game = {
    view: {
      width: 960,
      height: 512,
    },

    gridTiles: {},

    onSelected(tileX, tileY) {
      this.onUnselected();
      // Brute force
      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Game.gridTiles[x + ", " + y];
          if (Math.sqrt(Math.pow(x - tileX, 2) + Math.pow(y - tileY, 2)) <= config("movePerTurn"))
          {
            gridTile.color("#00aa00");
          }
        }
      }
    },

    onUnselected() {
      // Brute force
      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Game.gridTiles[x + ", " + y];
          gridTile.color("#cccccc");
        }
      }
    },

    start: function() {
      Crafty.init(Game.view.width, Game.view.height);
      this.grid = Crafty.e("Map")
      grid.initialize(15, 8);

      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Crafty.e("GridTile").initialize(x, y).move(x * 64, y * 64);
          Game.gridTiles[x + ", " + y] = gridTile;
        }
      }

      var red = Crafty.e("SquadMate");
      red.initialize("red", grid, 2, 4);
    }
  }

window.addEventListener('load', Game.start);