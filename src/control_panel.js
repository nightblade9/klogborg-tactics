Crafty.c("MyButton", {
    init: function() {
        this.requires("Actor, Text2")
            .color("white").fontSize(14).size(100, 32)
            .css({"border": "2px solid black"});
        
        var self = this;
        this.click(() => {
            self.color("#aaaaaa");
            self.after(0.1, () => self.color("white"));
        });
    }
});

Crafty.c("ControlPanel", {
    init: function() {
      this.requires("Actor, Text2").size(Game.view.width, config("footerHeight")).css({ "border": "4px solid grey"});

      this.fireButton = Crafty.e("MyButton").text("Shoot (0 damage)").click(() => this.fire());
      this.fireButton.visible = false;

      var self = this;
      this.endTurnButton = Crafty.e("MyButton").click(() => {
          Game.switchTurns();
          self.updateDisplay();
      });
      this.updateDisplay();
    },

    updateDisplay: function() {
        this.endTurnButton.text("End " + Game.currentTurn + "'s turn");
        this.color(Game.currentTurn === "red" ? "#ffaaaa" : "#aaaaff");
    },

    move2: function(x, y) {
        this.move(x, y);
        this.fireButton.move(x + 256, y + 32)

        this.endTurnButton.move(this.fireButton.x + 128, this.fireButton.y);
    },

    canFire(damage) {
        this.fireButton.visible = true;
        this.fireButton.text("Shoot (" + damage + " damage)");
        this.fireButton.damage = damage;

        this.showFirePath();
    },

    showFirePath: function(cells) {
        var from = Game.selected;
        var to = Game.target;
        var cells = getCellsBetween(from.tileX, from.tileY, to.tileX, to.tileY);
        cells.forEach(c => Game.gridTiles[c.x + ", " + c.y].alpha = 0.5);
    },

    fire() {
        if (Game.selected != null && Game.target != null && this.fireButton.damage >= 0)
        {
            Game.target.hp -= this.fireButton.damage;
            Crafty.single("ControlPanel").text("Shot for " + this.fireButton.damage + " damage");

            Game.target.updateDisplay();
            if (Game.target.hp <= 0) {
                Game.target.destroy();
                Game.target = null;
                Crafty.single("ControlPanel").cannotFire();
            } else {
                Game.target.color("orange");
                Game.target.after(0.2, () => Game.target.color(Game.target.team));
            }
            
            Game.selected.ap -= 1;
            Game.selected.updateDisplay();

            if (Game.selected.ap === 0) {
                this.cannotFire();
                this.damage = -1;
            }
        }
    },

    cannotFire() {
        this.fireButton.visible = false;
    }
})