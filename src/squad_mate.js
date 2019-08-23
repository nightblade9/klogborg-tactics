Crafty.c("SquadMate", {
    init: function() {
        this.requires("Actor").size(64, 64).color("black");
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
                self.css({"border": "3px solid black"})
            } else {
                Game.selected = null;
                self.css({"border": "none"})
            }
        });
        return this;
    },

    moveOnGrid: function(x, y) {
        this.move(x * 64, y * 64);
        this.grid.unset(this.tileX, this.tileY);
        this.grid.set(x, y, self);
        this.tileX = x;
        this.tileY = y;
        return this;
    }
})