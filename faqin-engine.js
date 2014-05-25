var clone, deepExtend, faqin,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

faqin = {};

deepExtend = function() {
  var extenders, key, object, other, val, _i, _len;
  object = arguments[0], extenders = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  if (object == null) {
    return {};
  }
  for (_i = 0, _len = extenders.length; _i < _len; _i++) {
    other = extenders[_i];
    for (key in other) {
      if (!__hasProp.call(other, key)) continue;
      val = other[key];
      if ((object[key] == null) || typeof val !== 'object') {
        object[key] = val;
      } else {
        object[key] = deepExtend(object[key], val);
      }
    }
  }
  return object;
};

clone = function(obj) {
  var flags, key, newInstance;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    flags = '';
    if (obj.global != null) {
      flags += 'g';
    }
    if (obj.ignoreCase != null) {
      flags += 'i';
    }
    if (obj.multiline != null) {
      flags += 'm';
    }
    if (obj.sticky != null) {
      flags += 'y';
    }
    return new RegExp(obj.source, flags);
  }
  newInstance = new obj.constructor();
  for (key in obj) {
    newInstance[key] = clone(obj[key]);
  }
  return newInstance;
};

faqin.EventDispatcher = (function() {
  function EventDispatcher() {
    this.dispatchEvent = __bind(this.dispatchEvent, this);
    this.removeEventListener = __bind(this.removeEventListener, this);
    this.addEventListener = __bind(this.addEventListener, this);
    this.getListeners = __bind(this.getListeners, this);
    this.registrations = {};
  }

  EventDispatcher.prototype.getListeners = function(type, useCapture) {
    var captype;
    captype = (typeof useCapture === "function" ? useCapture({
      '1': '0'
    }) : void 0) + type;
    if (!(captype in this.registrations)) {
      this.registrations[captype] = [];
    }
    return this.registrations[captype];
  };

  EventDispatcher.prototype.addEventListener = function(type, listener, useCapture) {
    var listeners;
    listeners = this.getListeners(type, useCapture);
    if (__indexOf.call(listeners, listener) < 0) {
      listeners.push(listener);
    }
    return this;
  };

  EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture) {
    var ix, listeners;
    listeners = this.getListeners(type, useCapture);
    ix = listeners.indexOf(listener);
    if (ix !== -1) {
      listeners.splice(ix, 1);
    }
    return this;
  };

  EventDispatcher.prototype.dispatchEvent = function(event) {
    var listener, listeners, _i, _len;
    listeners = this.getListeners(event.type, false).slice();
    for (_i = 0, _len = listeners.length; _i < _len; _i++) {
      listener = listeners[_i];
      listener.call(this, event);
    }
    return !event.defaultPrevented;
  };

  return EventDispatcher;

})();

faqin.Vector = (function() {
  function Vector(x, y) {
    this.distance = __bind(this.distance, this);
    this.multiply = __bind(this.multiply, this);
    this.invert = __bind(this.invert, this);
    this.sub = __bind(this.sub, this);
    this.add = __bind(this.add, this);
    this.dot = __bind(this.dot, this);
    this.x = x || 0;
    this.y = y || 0;
  }

  Vector.prototype.dot = function(vector) {
    return (this.x * vector.x) + (this.y * vector.y);
  };

  Vector.prototype.add = function(vector, self) {
    if (self) {
      this.x += vector.x;
      this.y += vector.y;
      return this;
    } else {
      return new faqin.Vector(this.x + vector.y, this.y + vector.y);
    }
  };

  Vector.prototype.sub = function(vector, self) {
    if (self) {
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    } else {
      return new faqin.Vector(this.x - vector.y, this.y - vector.y);
    }
  };

  Vector.prototype.invert = function(self) {
    if (self) {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    } else {
      return new faqin.Vector(-this.x, -this.y);
    }
  };

  Vector.prototype.multiply = function(scalar, self) {
    if (self) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    } else {
      return new faqin.Vector(this.x * scalar, this.y * scalar);
    }
  };

  Vector.prototype.distance = function(vector) {
    return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
  };

  return Vector;

})();

faqin.Bitmap = (function() {
  function Bitmap() {}

  return Bitmap;

})();

faqin.Solid = (function(_super) {
  __extends(Solid, _super);

  Solid.defaultOptions = {
    gravity: false,
    velocity: new faqin.Vector,
    restitution: 1,
    x: 0,
    y: 0,
    visible: false
  };

  function Solid(options) {
    this.moving = __bind(this.moving, this);
    this.addImpulse = __bind(this.addImpulse, this);
    this.calculateMass = __bind(this.calculateMass, this);
    deepExtend(this, clone(this.constructor.defaultOptions), options);
    Solid.__super__.constructor.apply(this, arguments);
    if (this.mass == null) {
      this.mass = this.calculateMass();
    }
    this.inverseMass = 1 / this.mass;
  }

  Solid.prototype.calculateMass = function() {
    return 1;
  };

  Solid.prototype.addImpulse = function(impulse) {
    this.velocity.add(impulse, true);
    return this;
  };

  Solid.prototype.moving = function() {
    return Boolean(this.velocity.x || this.velocity.y);
  };

  return Solid;

})(faqin.EventDispatcher);

faqin.Rect = (function(_super) {
  __extends(Rect, _super);

  deepExtend(Rect.defaultOptions, Rect.defaultOptions, {
    width: 0,
    height: 0
  });

  function Rect(options) {
    Rect.__super__.constructor.call(this, options);
  }

  return Rect;

})(faqin.Solid);

faqin.Viewport = (function(_super) {
  __extends(Viewport, _super);

  function Viewport(options) {
    this.update = __bind(this.update, this);
    deepExtend(this, options);
    Viewport.__super__.constructor.apply(this, arguments);
  }

  Viewport.prototype.update = function() {
    if (!this.anchor) {
      return;
    }
    if (this.type === 'margin') {
      if (this.anchor.x < this.x + this.margin.x) {
        this.x = this.anchor.x - this.margin.x + (this.width * 0.5);
      } else if (this.anchor.x > this.x + this.width - this.margin.x) {
        this.x = this.anchor.x + this.margin.x - (this.width * 0.5);
      }
      if (this.anchor.y < this.y + this.margin.y) {
        return this.y = this.anchor.y - this.margin.y + (this.height * 0.5);
      } else if (this.anchor.y > this.y + this.height - this.margin.y) {
        return this.y = this.anchor.y + this.margin.y - (this.height * 0.5);
      }
    } else if (this.type === 'xFixed') {
      return this.x = this.anchor.x - this.xFixed + (this.width * 0.5);
    } else if (this.type === 'yFixed') {
      return this.y = this.anchor.y - this.yFixed + (this.height * 0.5);
    }
  };

  return Viewport;

})(faqin.Rect);

faqin.Engine = (function() {
  Engine.defaultOptions = {
    fps: 30,
    solids: []
  };

  function Engine(options) {
    this.update = __bind(this.update, this);
    this.pause = __bind(this.pause, this);
    this.start = __bind(this.start, this);
    this.drawText = __bind(this.drawText, this);
    this.drawRect = __bind(this.drawRect, this);
    this.prepareContext = __bind(this.prepareContext, this);
    this.drawDebug = __bind(this.drawDebug, this);
    this.render = __bind(this.render, this);
    this.checkRectVsRect = __bind(this.checkRectVsRect, this);
    this.testCollision = __bind(this.testCollision, this);
    this.simulate = __bind(this.simulate, this);
    deepExtend(this, clone(this.constructor.defaultOptions), options);
    if (this.viewport == null) {
      this.viewport = new faqin.Viewport({
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height
      });
    }
    this.canvasContext = this.canvas.getContext('2d');
  }

  Engine.prototype.simulate = function() {
    var currentFrame, deltaTime, i, j, solid, solid2, _i, _j, _k, _len, _ref, _ref1, _ref2, _ref3;
    currentFrame = Date.now();
    deltaTime = (currentFrame - this.lastFrame) / 1000;
    this.fps = 1 / deltaTime;
    this.lastFrame = currentFrame;
    _ref = this.solids;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      solid = _ref[_i];
      if (solid.gravity) {
        solid.velocity.y += solid.gravity * deltaTime;
      }
      solid.x += solid.velocity.x * deltaTime;
      solid.y += solid.velocity.y * deltaTime;
    }
    for (i = _j = 0, _ref1 = this.solids.length - 2; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
      solid = this.solids[i];
      for (j = _k = _ref2 = i + 1, _ref3 = this.solids.length - 1; _ref2 <= _ref3 ? _k <= _ref3 : _k >= _ref3; j = _ref2 <= _ref3 ? ++_k : --_k) {
        solid2 = this.solids[j];
        if (solid.moving() || solid2.moving()) {
          this.testCollision(solid, solid2);
        }
      }
    }
    return this.viewport.update();
  };

  Engine.prototype.testCollision = function(solid1, solid2) {
    var event;
    if (solid1 instanceof faqin.Rect) {
      if (solid2 instanceof faqin.Rect) {
        if (this.checkRectVsRect(solid1, solid2)) {
          event = new Event('collide');
          event.solid = solid2;
          solid1.dispatchEvent(event);
          event = new Event('collide');
          event.solid = solid1;
          return solid2.dispatchEvent(event);
        }
      }
    }
  };

  Engine.prototype.checkRectVsRect = function(rect1, rect2) {
    return !(rect1.x + (rect1.width * 0.5) < rect2.x - (rect2.width * 0.5) || rect1.x - (rect1.width * 0.5) > rect2.x + (rect2.width * 0.5) || rect1.y + (rect1.height * 0.5) < rect2.y - (rect2.height * 0.5) || rect1.y - (rect1.height * 0.5) > rect2.y + (rect2.height * 0.5));
  };

  Engine.prototype.render = function() {
    var scale, solid, wasVisible, zeroZero, _i, _j, _len, _len1, _ref, _ref1;
    this.canvasContext.save();
    this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.restore();
    scale = new faqin.Vector(this.canvas.width / this.viewport.width, this.canvas.height / this.viewport.height);
    zeroZero = {
      x: this.viewport.x - (this.viewport.width * 0.5),
      y: this.viewport.y - (this.viewport.height * 0.5)
    };
    _ref = this.solids;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      solid = _ref[_i];
      if (solid.fill instanceof faqin.Bitmap) {

      } else {
        if (solid instanceof faqin.Rect) {
          wasVisible = solid.visible;
          solid.visible = this.checkRectVsRect(this.viewport, solid);
          if (solid.visible) {
            this.drawRect((solid.x - (solid.width * 0.5) - zeroZero.x) * scale.x + 0.5, (solid.y - (solid.height * 0.5) - zeroZero.y) * scale.y + 0.5, solid.width * scale.x, solid.height * scale.y, solid.fill);
            if (!wasVisible) {
              solid.dispatchEvent(new Event('show'));
            }
            solid.dispatchEvent(new Event('render'));
          } else {
            if (wasVisible) {
              solid.dispatchEvent(new Event('hide'));
            }
          }
        }
      }
    }
    if (this.debug) {
      _ref1 = this.solids;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        solid = _ref1[_j];
        if (solid.visible) {
          this.drawDebug(solid, scale, zeroZero);
        }
      }
      return this.drawText(Math.floor(this.fps) + ' FPS', this.canvas.width / 2, 10, '10px Arial', '#000');
    }
  };

  Engine.prototype.drawDebug = function(solid, scale, zeroZero) {
    var moving;
    moving = solid.moving();
    if (solid instanceof faqin.Rect) {
      return this.drawRect((solid.x - (solid.width * 0.5) - zeroZero.x) * scale.x + 0.5, (solid.y - (solid.height * 0.5) - zeroZero.y) * scale.y + 0.5, solid.width * scale.x, solid.height * scale.y, moving ? 'rgba(0, 255, 0, .3)' : 'rgba(255, 0, 0, .3)', moving ? 'rgba(0, 255, 0, .7)' : 'rgba(255, 0, 0, .7)');
    }
  };

  Engine.prototype.prepareContext = function(fill, stroke, strokeWidth) {
    if (fill) {
      this.canvasContext.fillStyle = fill;
    }
    if (stroke) {
      this.canvasContext.strokeStyle = stroke;
      return this.canvasContext.lineWidth = strokeWidth || 1;
    }
  };

  Engine.prototype.drawRect = function(x, y, width, height, fill, stroke, strokeWidth) {
    this.prepareContext(fill, stroke, strokeWidth);
    if (fill) {
      this.canvasContext.fillRect(x, y, width, height);
    }
    if (stroke) {
      return this.canvasContext.strokeRect(x, y, width, height);
    }
  };

  Engine.prototype.drawText = function(text, x, y, font, fill, stroke, strokeWidth) {
    this.prepareContext(fill, stroke, strokeWidth);
    if (font) {
      this.canvasContext.font = font;
    }
    x -= this.canvasContext.measureText(text).width / 2;
    if (fill) {
      this.canvasContext.fillText(text, x, y);
    }
    if (stroke) {
      return this.canvasContext.strokeText(text, x, y);
    }
  };

  Engine.prototype.start = function() {
    this.lastFrame = Date.now();
    return this.updateInterval = setInterval((function(_this) {
      return function() {
        return _this.update();
      };
    })(this), 1000 / this.fps);
  };

  Engine.prototype.pause = function() {
    return clearInterval(this.updateInterval);
  };

  Engine.prototype.update = function() {
    this.simulate();
    return this.render();
  };

  return Engine;

})();
