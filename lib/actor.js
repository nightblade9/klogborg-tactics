// Lots and lots and lots of helpful, default helpers for an actor class.
// It can be moved, sized, clicked, etc.
Crafty.c('Actor', {
  init: function() {
    // Collision: every actor can be collision-detected
    this.requires('Common, Color, Collision')
      .size(32, 32)
      .color("#888888");

    // Used for constant velocity
    this.v = { x: 0, y: 0 };

    this.bind('EnterFrame', function() {
      this.attr({ x: this.x + this.v.x, y: this.y + this.v.y });
    })
  },

  // Execute a callback when collides with an entity with the tag in it. This
  // doesn't resolve the collision so that we're no longer overlapping the target.
  // If you want to displace out of the object, use collideWith.
  collide: function(tagOrTags, callback) {
    if (tagOrTags.constructor.name == 'Array') {
        for (var i = 0; i < tagOrTags.length; i++) {
            this.onHit(tagOrTags[i], function(data) {
              if (callback != null) {
                callback(data);
              }
            });
        }
        return this;
    } else {
        this.onHit(tagOrTags, function(data) {
          if (callback != null) {
            callback(data);
          }
        });
        return this;
    }
  },

  // Collide against a solid object, and resolve the collision so that we're no
  // longer overlapping with the target. (We stop moving; target can keep moving.)
  // For non-resolving, use collide.
  // The callback receives an object (the thing that's hit) before resolving the collision.
  // Setting resolveFirst to true resolves the collision, then executes the callbacks.
  collideWith: function(tag, callback, resolveFirst) {
    resolveFirst = typeof resolveFirst !== 'undefined' ? resolveFirst : true;

    this.requires("Collision").onHit(tag, function(evt) {
      var hitData = evt;

      if (resolveFirst && callback != null) {
        // Invoke callback once per object hit
        for (var i = 0; i < hitData.length; i++) {
          var data = hitData[i];
          callback(data);
        }
      }

      // Execute all the callbacks now if post-resolve.
      for (var i = 0; i < hitData.length; i++) {
        var data = hitData[i];
        // displace backward so we're no longer overlapping
        var dx = -data.normal.x * data.overlap;
        var dy = -data.normal.y * data.overlap;

        this.x += dx;
        this.y += dy;

        if (callback != null && !resolveFirst) {
          callback(data);
        }
      }
    });

    return this;
  },

  // Responds to user input; speed = pixels per second
  controllable: function(speed) {
    this.requires('Fourway').fourway(speed);
    return this;
  },

  draggable: function() {
    this.requires('Mouse, Draggable');
    return this;
  },
  
  height: function() {
      return this.h;
  },

  img: function(filename, repeat) {
    this.requires('Image');
    this.image(filename, repeat);
    return this;
  },

  keyPress: function(key, callback) {
    this.requires('Keyboard').bind('KeyDown', function() {
      if (this.isDown(key)) {
        callback();
      }
    });
    return this;
  },

  // Resize
  size: function(width, height) {
    this.attr({ w: width, h: height });
    return this;
  },

  tween: function(hash, seconds) {
    this.requires('Tween').tween(hash, seconds * 1000);
    return this;
  },

  // Start moving
  velocity: function(x, y) {
    this.v = { x: x || 0, y: y || 0 };
    return this;
  },
  
  width: function() {
      return this.w;
  }
});

Crafty.c('Text2', {
  init: function() {
    this.requires('Common, Canvas, Text');
    this.fontSize(20);
  },

  text: function(contents) {
    this.text(contents);
    return this;
  },

  fontSize: function(size) {
    this.textFont({ size: size + 'px' });
    return this;
  }
});

Crafty.c('Common', {
  init: function() {
    // Collision: every actor can be collision-detected
    this.requires('Graphics, 2D, Moveable, Alpha, Delay');

    // Used for cancelling "after" and "repeatedly" events
    this.timerEvents = [];
  },

  // Do something once, after a certain amount of time.
  // See: repeatedly
  after: function(seconds, callback) {
    this.delay(callback, seconds * 1000, 0);
    this.timerEvents.push(callback);
    return this;
  },

  // Cancels anything set by "after" or "repeatedly"
  cancelTimerEvents: function() {
    for (var i = 0; i < this.timerEvents.length; i++) {
      this.cancelDelay(this.timerEvents[i]);
    }
  },

  // Execute a callback when clicked on. Technically, when you press the mouse
  // down (anywhere), hover it over this entity, and then release. #derp
  // See: mouseDown
  click: function(callback) {
    this.requires('Mouse').bind('Click', function() {
      callback();
    });
    return this;
  },

  die: function() {
    this.destroy();
    return this;
  },

  mouseDown: function(callback) {
    this.requires('Mouse').bind('MouseDown', function(e) {
      callback(e);
    });
    return this;
  },

  mouseUp: function(callback) {
    this.requires('Mouse').bind('MouseUp', function(e) {
      callback(e);
    });
    return this;
  },

  mouseOut: function(callback) {
    this.requires('Mouse').bind('MouseOut', function(e) {
      callback(e);
    });
    return this;
  },

  mouseOver: function(callback) {
    this.requires('Mouse').bind('MouseOver', function(e) {
      callback(e);
    });
    return this;
  },

  // Keep doing something. Forever.
  repeatedly: function(callback, secondsInterval) {
    this.delay(callback, secondsInterval * 1000, -1);
    this.timerEvents.push(callback);
    return this;
  }
});

// Overrides for built-in functions like 'move', etc.
Crafty.c('Moveable', {
  // Tween to location in T fractional seconds (defaults to 1.0s)
  move: function(x, y, t, callback) {
    if (t == null || t == 0) {
      this.attr({ x: x, y: y });
      if (callback != null) {
        callback();
      }
    } else {
      this.requires('Tween');
      this.tween({ x: x, y: y }, t * 1000);
      this.bind('TweenEnd', callback);
    }
    return this;
  }
});

Crafty.c("Graphics", {
  init: function() {
    if (Crafty.support.webgl) {
      this.requires("WebGL");
      this.graphics = "WebGL";
    } else if (Crafty.support.canvas) {
      this.requires("Canvas");
      this.graphics = "Canvas";
    } else {
      this.requires("DOM");
      this.graphics = "DOM";
    }
  }
});
