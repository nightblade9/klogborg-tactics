Crafty.c("Map", {
    initialize: function(width, height) {
        this.width = width;
        this.height = height;
        this.data = Array(width * height);

        var coverLeft = config("numLowCover");
        while (coverLeft > 0) {
            var x = randomBetween(0, config("mapWidth"));
            var y = randomBetween(0, config("mapHeight"));
            if (grid.isEmpty(x, y)) {
                grid.set(x, y, "lowCover");
                coverLeft -= 1;
            }
        }

        coverLeft = config("numHighCover");
        while (coverLeft > 0) {
            var x = randomBetween(0, config("mapWidth"));
            var y = randomBetween(0, config("mapHeight"));
            if (grid.isEmpty(x, y)) {
                grid.set(x, y, "highCover");
                coverLeft -= 1;
            }
        }
        
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

    isEmpty(x, y) {
        var contents = this.get(x, y);
        return typeof(contents) === "undefined" || contents === null;
    },

    _index(x, y) {
        return ((y * this.width) + x);
    }
})