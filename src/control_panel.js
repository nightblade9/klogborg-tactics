Crafty.c("ControlPanel", {
    init: function() {
      this.requires("Actor").size(Game.view.width, config("footerHeight"));
    }
})