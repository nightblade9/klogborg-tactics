Game = {
    view: {
      width: 0,
      height: 0
    },

    gridTiles: {},
    reds: [],
    blues: [],

    start: function() {
      Game.view.width = config("mapWidth") * config("tileSize");
      Game.view.height = config("mapHeight") * config("tileSize");

      Crafty.init(Game.view.width, Game.view.height);
      this.grid = Crafty.e("Map")
      grid.initialize(config("mapWidth"), config("mapHeight"));
      var tileSize = config("tileSize");

      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Crafty.e("GridTile").initialize(x, y).move(x * tileSize, y * tileSize);
          Game.gridTiles[x + ", " + y] = gridTile;
        }
      }

      var reds = Game.randomlyCreateSquad(config("squadSize"), "red", 0, parseInt(config("mapWidth") / 3));
      for (var red in reds) {
        Game.reds.push(red);
      }

      var blues = Game.randomlyCreateSquad(config("squadSize"), "blue", parseInt(config("mapWidth") * 2 / 3), config("mapWidth"));
      for (var blues in blues) {
        Game.blues.push(blues);
      }
    },


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

      for (var red in Game.reds) {
        red.css({ "border": "none"})
      };

      for (var blue in Game.blues) {
        blue.css({ "border": "none"})
      };
    },

    randomlyCreateSquad: function(size, team, minX, maxX) {
      var toReturn = [];
      var toCreate = size;

      while (toCreate > 0) {
        var x = randomBetween(minX, maxX);
        var y = randomBetween(0, config("mapHeight"));
        var contents = grid.get(x, y);
        if (typeof(contents) === "undefined" || contents === null) {
          var member = Crafty.e("SquadMate");
          member.initialize(team, grid, x, y);
          toCreate -= 1;
          toReturn.push(member);
        }
      }

      return toReturn;
    }
  }

window.addEventListener('load', Game.start);