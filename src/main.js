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
      this.grid = Crafty.e("Map"); // generates cover, too.
      grid.initialize(config("mapWidth"), config("mapHeight"));
      var tileSize = config("tileSize");

      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Crafty.e("GridTile").initialize(x, y).move(x * tileSize, y * tileSize);
          Game.gridTiles[x + ", " + y] = gridTile;
          Game.applyColor(gridTile, x, y);
        }
      }

      var reds = Game.randomlyCreateSquad(grid, config("squadSize"), "red", 0, parseInt(config("mapWidth") / 3));
      reds.forEach(red => Game.reds.push(red));

      var blues = Game.randomlyCreateSquad(grid, config("squadSize"), "blue", parseInt(config("mapWidth") * 2 / 3), config("mapWidth"));
      blues.forEach(blue => Game.blues.push(blue));

      Crafty.e("ControlPanel").move2(0, Game.view.height - config("footerHeight"));
    },


    onSelected(tileX, tileY) {
      this.onUnselected();
      // Brute force
      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Game.gridTiles[x + ", " + y];
          gridTile.alpha = 1;
          if (grid.isEmpty(x, y) && Math.sqrt(Math.pow(x - tileX, 2) + Math.pow(y - tileY, 2)) <= Game.selected.moveDistance())
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
          gridTile.alpha = 1;
          Game.applyColor(gridTile, x, y);
        }
      }

      var collection = Game.currentTurn === "red" ? Game.reds : Game.blues;
      collection.forEach(blue => blue.css({ "border": "none"}));
    },

    isWalkable(x, y) {
      return grid.isEmpty(x, y);
    },

    applyColor(gridTile, x, y) {
      if (grid.get(x, y) === "lowCover") {
        gridTile.color("#440088");
      } else if (grid.get(x, y) === "highCover") {
        gridTile.color("#8800ff");
      } else {
        gridTile.color("#cccccc");
      }
    },

    randomlyCreateSquad: function(grid, size, team, minX, maxX) {
      var toReturn = [];
      var toCreate = size;

      while (toCreate > 0) {
        var x = randomBetween(minX, maxX);
        var y = randomBetween(0, config("mapHeight"));
        if (grid.isEmpty(x, y)) {
          var member = Crafty.e("SquadMate");
          member.initialize(team, grid, x, y);
          toCreate -= 1;
          toReturn.push(member);
        }
      }

      return toReturn;
    },

    selectedTarget: function(target) {
      // Reset shown path between selected and target
      for (const y of Array(grid.height).keys()) {
        for (const x of Array(grid.width).keys()) {
          var gridTile = Game.gridTiles[x + ", " + y];
          gridTile.alpha = 1;
        }
      }

      var collection = Game.currentTurn === "red" ? Game.blues : Game.reds;
      collection.forEach(i => i.css({ "border": "none" }));
      target.css({ "border": "4px solid black" });
      Game.showFireButtonIfApplicable();
    },

    showFireButtonIfApplicable: function() {
      if (Game.selected !== null && Game.target !== null) {
        var damage = Game.calculateAndExplainDamage(Game.selected, Game.target);
        Crafty.single("ControlPanel").canFire(damage);
      }
    },

    switchTurns: function() {
      this.currentTurn = this.currentTurn === "red" ? "blue" : "red";
    },

    calculateAndExplainDamage: function(attacker, defender) {
      const BASE_DAMAGE = config("baseDamage");
      var damage = BASE_DAMAGE;
      var explanation = BASE_DAMAGE + " base damage";

      // Subtract damage due to low-cover tiles (eg. -1) and high-cover tiles (eg. -3)
      var lowCovers = 0;
      var highCovers = 0;

      var cells = getCellsBetween(attacker.tileX, attacker.tileY, defender.tileX, defender.tileY);
      cells.forEach(cell => {
        var contents = grid.get(cell.x, cell.y);
        if (contents === "lowCover") {
          lowCovers++;
        } else if (contents == "highCover") {
          highCovers++;
        }
      });

      if (lowCovers > 0) {
        var lowCoverTotal = lowCovers * config("lowCoverDamageMod");
        explanation += ", -" + lowCoverTotal + " (" + lowCovers + "x low cover)";
        damage -= lowCoverTotal;
      }

      if (highCovers > 0) {
        var highCoverTotal = highCovers * config("highCoverDamageMod");
        explanation += ", -" + highCoverTotal + " (" + highCovers + "x high cover)";
        damage -= highCoverTotal;
      }
      
      // if range > 4, subtract (range - 4) damage. eg. 5 => -1, 6 => -2, etc.
      var range = Math.sqrt(Math.pow(attacker.tileX - defender.tileX, 2) + Math.pow(attacker.tileY - defender.tileY, 2));
      if (range > config("fullDamageTileRange")) {
        var rangePenalty = parseInt(range - config("fullDamageTileRange"));
        damage -= rangePenalty;
        explanation += ", -" + rangePenalty + " range penalty";
      }

      damage = Math.max(damage, 0);
      Crafty.single("ControlPanel").text(damage + " damage (" + explanation + ")");
      return damage;
    }
  }

window.addEventListener('load', Game.start);