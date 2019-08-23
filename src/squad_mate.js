Crafty.c("SquadMate", {
    init: function() {
        var tileSize = config("tileSize");
        this.requires("Actor").size(tileSize, tileSize).color("black");
    },

    initialize: function(team, grid, tileX, tileY) {
        var self = this;
        this.team = team;
        this.grid = grid;
        this.moveOnGrid(tileX, tileY)
        this.color(team);

        this.click(() => { 
            if (Game.selected != self) {
                Game.selected = self;
                Game.onSelected(self.tileX, self.tileY);
                self.css({"border": "3px solid black"})
            } else {
                Game.selected = null;
                self.css({"border": "none"})
                Game.onUnselected();
            }
        });
        return this;
    },

    moveOnGrid: function(x, y) {
        var tileSize = config("tileSize");
        this.move(x * tileSize, y * tileSize);
        this.grid.unset(this.tileX, this.tileY);
        this.grid.set(x, y, self);
        this.tileX = x;
        this.tileY = y;
        return this;
    }
})