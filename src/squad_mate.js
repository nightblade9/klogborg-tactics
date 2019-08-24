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
        this.maxAp = 2;
        this.ap = 2;
        this.maxHp = 12;
        this.hp = 12;

        this.click(() => { 
            if (Game.currentTurn === self.team) {
                if (Game.selected != self) {
                    Game.selected = self;
                    Game.onSelected(self.tileX, self.tileY);
                    self.css({"border": "3px solid black"});

                    if (Game.selected !== null && Game.target !== null) {
                        var damage = Game.calculateDamage(Game.selected, Game.target);
                        Crafty.single("ControlPanel").canFire(damage);
                    }
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