Crafty.c("GridTile", {
    init: function() {
      var tileSize = config("tileSize");
        this.requires("Actor").size(tileSize, tileSize).color("#cccccc").css({"border": "1px solid #aaa"});
    },

    initialize: function(x, y) {
        this.tileX = x;
        this.tileY = y;

        this.click(() => {
            if (Game.selected != null) {
              var distance = Math.sqrt(Math.pow(this.tileX - Game.selected.tileX, 2) + Math.pow(this.tileY - Game.selected.tileY, 2));
              if (distance > 0 && distance <= config("movePerTurn"))
              {
                Game.selected.moveOnGrid(x, y); // from loop
                Game.onSelected(x, y);
              }
            }
          });
        return this;
    }
})