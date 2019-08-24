Game = {
    view: {
      width: 0,
      height: 0
    },

    gridTiles: {},
    reds: [],
    blues: [],

    currentTurn: "red",
    
    selected: null,
    target: null,

    start: function() {
      Game.view.width = config("mapWidth") * config("tileSize");
      Game.view.height = config("mapHeight") * config("tileSize") + config("footerHeight");

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
      reds.forEach(red => Game.reds.push(red));

      var blues = Game.randomlyCreateSquad(config("squadSize"), "blue", parseInt(config("mapWidth") * 2 / 3), config("mapWidth"));
      blues.forEach(blue => Game.blues.push(blue));

      Crafty.e("ControlPanel").move2(0, Game.view.height - config("footerHeight"));
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

      var collection = Game.currentTurn === "red" ? Game.reds : Game.blues;
      collection.forEach(blue => blue.css({ "border": "none"}));
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
    },

    selectedTarget: function(target) {
      var collection = Game.currentTurn === "red" ? Game.blues : Game.reds;
      collection.forEach(i => i.css({ "border": "none" }));
      target.css({ "border": "4px solid black" });
    }
  }

window.addEventListener('load', Game.start);