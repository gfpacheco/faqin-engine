fuckin.Engine = function(options) {
    this.fps = options.fps || 30;
    this.defaultGravity = options.defaultGravity || 10 / this.fps;
    this.canvas = options.canvas;
    this.canvasContext = this.canvas.getContext('2d');
    this.debug = options.debug;

    this.solids = [];

    this.normalizeSolidOptions = function(options) {
        options.gravity = (options.gravity === true)? this.defaultGravity : options.gravity;
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
                solid1.velocity.y += solid1.gravity;
            }

            solid1.x += solid1.velocity.x;
            solid1.y += solid1.velocity.y;
        }

        for (i = this.solids.length - 1; i >= 0; i--) {
            solid1 = this.solids[i];
            for (j = i - 1; j >= 0; j--) {
                solid2 = this.solids[j];

                if (!solid1.moving() && !solid2.moving) {
                    continue;
                }

                if (solid1 instanceof fuckin.Rect) {
                    if (solid2 instanceof fuckin.Rect) {
                        collision = this.handleCollision(solid1, solid2);
                    }
                }
            }
        }
    };

    this.handleCollision = function(solid1, solid2) {
        if (solid1 instanceof fuckin.Rect) {
            if (solid2 instanceof fuckin.Rect) {
                if (true) {
                    this.resolveCollision(solid1, solid2, new fuckin.Vector(1, 1));
                }
            }
        }
    };

    this.resolveCollision = function(solid1, solid2, normal) {
        var velocityAlongNormal = solid2.velocity.sub(solid1.velocity).dot(normal);

        if (velocityAlongNormal > 0) {
            return;
        }

        var e = Math.min(solid1.restitution, solid2.restitution),
            j = (-(1 + e) * velocityAlongNormal) / (solid1.inverseMass + solid2.inverseMass);

        normal.multiply(j, true);

        solid1.velocity.add(normal.multiply(solid1.inverseMass).invert(true), true);
        solid2.velocity.add(normal.multiply(solid2.inverseMass), true);
    };

    this.render = function() {
        this.canvasContext.save();
        this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.restore();

        for (var i = this.solids.length - 1; i >= 0; i--) {
            var solid = this.solids[i];

            if (this.debug) {
                solid.debug(this.canvasContext);
            }
        }
    };
};

fuckin.Engine.prototype.addRect = function(options) {
    this.solids.push(new fuckin.Rect(this.normalizeSolidOptions(options)));
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
