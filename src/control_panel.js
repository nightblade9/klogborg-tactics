Crafty.c("ControlPanel", {
    init: function() {
      this.requires("Actor").size(Game.view.width, config("footerHeight"));
      this.fireButton = Crafty.e("Actor, Text2")
        .color("white").fontSize(14).size(100, 32)
        .text("Shoot (0 damage)").css({"border": "2px solid black"})
        .click(() => this.fire());

      this.fireButton.visible = false;
    },

    move2: function(x, y) {
        this.move(x, y);
        this.fireButton.move(x + 16, y + 16)
    },

    canFire(damage) {
        this.fireButton.visible = true;
        this.fireButton.text("Shoot (" + damage + " damage)");
        this.fireButton.damage = damage;
    },

    fire() {
        if (Game.selected != null && Game.target != null && this.fireButton.damage >= 0)
        {
            Game.target.hp -= this.fireButton.damage;
            Game.target.updateDisplay();
            if (Game.target.hp <= 0) {
                Game.target.visible = false;
                Game.target = null;
                Crafty.single("ControlPanel").cannotFire();
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