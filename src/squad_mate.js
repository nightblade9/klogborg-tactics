Crafty.c("SquadMate", {
    init: function() {
        var tileSize = config("tileSize");
        this.requires("Actor, Text2").fontSize(14).textColor("white").size(tileSize, tileSize).color("black");
    },

    initialize: function(team, grid, tileX, tileY) {
        var self = this;
        this.team = team;
        this.grid = grid;
        this.moveOnGrid(tileX, tileY)
        this.color(team);
        this.maxAp = config("ap");
        this.ap = this.maxAp;
        this.maxHp = config("hp");
        this.hp = this.maxHp;

        this.click(() => { 
            if (Game.currentTurn === self.team) {
                if (Game.selected != self) {
                    Game.selected = self;
                    Game.onSelected(self.tileX, self.tileY);
                    self.css({"border": "3px solid black"});

                    Game.showFireButtonIfApplicable();
                } else {
                    Game.selected = null;
                    self.css({"border": "none"})
                    Game.onUnselected();
                }
            } else {
                Game.target = self;
                Game.selectedTarget(self);
            }
        });

        this.updateDisplay();
        return this;
    },

    moveDistance: function() {
        var toReturn = config("movePerTurn");
        if (this.hp <= this.maxHp / 2) {
          toReturn *= 2;
        }
        return toReturn;
    },

    updateDisplay: function() {
        this.text("HP: " +this.hp + "/" + this.maxHp + "\nAP: " + this.ap);
    },

    moveOnGrid: function(x, y, deductAp = false) {
        var tileSize = config("tileSize");
        this.move(x * tileSize, y * tileSize);
        this.grid.unset(this.tileX, this.tileY);
        this.grid.set(x, y, self);
        this.tileX = x;
        this.tileY = y;

        if (deductAp) {
            this.ap -= 1;
            this.updateDisplay();
        }

        return this;
    }
})