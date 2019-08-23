Crafty.c("Map", {
    initialize: function(width, height) {
        this.width = width;
        this.height = height;
        this.data = Array(width * height);
    },

    set(x, y, contents) {
        this.data[this._index(x, y)] = contents;
    },

    unset(x, y) {
        this.set(x, y, null);
    },

    get(x, y) {
        return this.data[this._index(x, y)];
    },

    _index(x, y) {
        return ((y * this.width) + x);
    }
})