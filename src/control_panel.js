Crafty.c("ControlPanel", {
    init: function() {
      this.requires("Actor").size(Game.view.width, config("footerHeight"));
      this.fireButton = Crafty.e("Actor, Text2").fontSize(14).size(100, 32).text("Shoot (0 damage)").css({"border": "2px solid black"});
    },

    move2: function(x, y) {
        this.move(x, y);
        this.fireButton.move(x + 16, y + 16)
    }
})