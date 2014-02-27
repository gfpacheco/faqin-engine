fuckin.Engine = function(options) {
    this.fps = options.fps || 30;
    this.defaultGravity = options.defaultGravity || 10;
    this.canvas = options.canvas;
    this.canvasContext = this.canvas.getContext('2d');
    this.viewport = options.viewport || new fuckin.Viewport({
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height
    });
    this.debug = options.debug;

    this.solids = [];

    this.normalizeSolidOptions = function(options) {
        options.gravity = (options.gravity === true)? this.defaultGravity : options.gravity;
        options.gravity /= this.fps;
        return options;
    };

    this.simulate = function() {
        var solid1,
            solid2,
            collision,
            i,
            j;

        for (i = this.solids.length - 1; i >= 0; i--) {
            solid1 = this.solids[i];

            if (solid1.gravity) {
                console.log(solid1.gravity);
                solid1.velocity.y += solid1.gravity;
            }

            solid1.x += solid1.velocity.x;
            solid1.y += solid1.velocity.y;
        }

        for (i = this.solids.length - 1; i >= 0; i--) {
            solid1 = this.solids[i];
            for (j = i - 1; j >= 0; j--) {
                solid2 = this.solids[j];

                if (!solid1.moving() && !solid2.moving()) {
                    continue;
                }

                if (solid1 instanceof fuckin.Rect) {
                    if (solid2 instanceof fuckin.Rect) {
                        collision = this.handleCollision(solid1, solid2);
                    }
                }
            }
        }

        this.viewport.update();
    };

    this.handleCollision = function(solid1, solid2) {
        if (solid1 instanceof fuckin.Rect) {
            if (solid2 instanceof fuckin.Rect) {
                if (this.checkRectVsRect(solid1, solid2)) {
                    solid1.dispatchEvent(new Event('collide', {
                        solid: solid2
                    }));
                    solid2.dispatchEvent(new Event('collide', {
                        solid: solid1
                    }));
                }
            }
        }
    };

    this.checkRectVsRect = function(rect1, rect2) {
        return !(rect1.x + (rect1.width * 0.5) < rect2.x ||
            rect1.x > rect2.x + (rect2.width * 0.5) ||
            rect1.y + (rect1.height * 0.5) < rect2.y ||
            rect1.y > rect2.y + (rect2.height * 0.5));
    };

    this.resolveCollision = function(solid1, solid2, normal) {
        var velocityAlongNormal = solid2.velocity.sub(solid1.velocity).dot(normal);

        if (velocityAlongNormal > 0) {
            return;
        }

        var e = Math.min(solid1.restitution, solid2.restitution),
            j = (-(1 + e) * velocityAlongNormal) / (solid1.inverseMass + solid2.inverseMass);

        normal.multiply(j, true);

        solid1.addImpulse(normal.multiply(solid1.inverseMass).invert(true));
        solid2.addImpulse(normal.multiply(solid2.inverseMass));
    };

    this.render = function() {
        this.canvasContext.save();
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.restore();

        var scale = new fuckin.Vector(this.canvas.width / this.viewport.width, this.canvas.height / this.viewport.height),
            solid,
            i;

        for (i = this.solids.length - 1; i >= 0; i--) {
            solid = this.solids[i];

            if (solid.fill instanceof fuckin.Bitmap) {
                // TODO
            } else {
                this.canvasContext.fillStyle = solid.fill;

                if (solid instanceof fuckin.Rect) {
                    this.canvasContext.fillRect(
                        (solid.x - this.viewport.x) * scale.x + 0.5,
                        (solid.y - this.viewport.y) * scale.y + 0.5,
                        solid.width * scale.x,
                        solid.height * scale.y);
                }
            }
        }

        if (this.debug) {
            for (var i = this.solids.length - 1; i >= 0; i--) {
                this.drawDebug(this.solids[i]);
            }
        }
    };

    this.drawDebug = function(solid) {
        var moving = solid.moving();
        this.canvasContext.fillStyle = moving? 'rgba(255, 0, 0, .2)' : 'rgba(0, 255, 0, .2)';
        this.canvasContext.strokeStyle = moving? 'rgba(255, 0, 0, .5)' : 'rgba(0, 255, 0, .5)';
        this.canvasContext.lineWidth = 1;

        if (solid instanceof fuckin.Rect) {
            this.canvasContext.fillRect(solid.x + .5, solid.y + .5, solid.width, solid.height);
            this.canvasContext.strokeRect(solid.x + .5, solid.y + .5, solid.width, solid.height);
        }
    };
};

fuckin.Engine.prototype.addRect = function(options) {
    var rect = new fuckin.Rect(this.normalizeSolidOptions(options));
    this.solids.push(rect);
    return rect;
};

fuckin.Engine.prototype.start = function() {
    var that = this;
    this.updateInterval = setInterval(function() {
        that.update();
    }, 1000 / this.fps);
};

fuckin.Engine.prototype.pause = function() {
    clearInterval(this.updateInterval);
};

fuckin.Engine.prototype.update = function() {
    this.simulate();
    this.render();
};
