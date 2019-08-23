Crafty.c("ControlPanel", {
    init: function() {
      this.requires("Actor").size(Game.view.width, config("footerHeight"));
      this.fireButton = Crafty.e("Actor, Text2").fontSize(14).size(100, 32).text("Shoot (0 damage)").css({"border": "2px solid black"});
      this.fireButton.visible = false;
    },

    move2: function(x, y) {
        this.move(x, y);
        this.fireButton.move(x + 16, y + 16)
    },

    canFire(damage) {
        this.fireButton.visible = true;
        this.fireButton.text("Shoot (" + damage + " damage)");
    },

    cannotFire() {
        this.fireButton.visible = false;
    }
})