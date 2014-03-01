fuckin.Solid = function(options) {
    fuckin.EventDispatcher.call(this);
    options = options || {};

    this.gravity = options.gravity;
    this.velocity = options.velocity || new fuckin.Vector();
    this.restitution = options.restitution || 1;
    this.inverseMass = (options.mass)? 1 / options.mass : this.calculateMass();
    this.fill = options.fill;
    this.x = options.x || 0;
    this.y = options.y || 0;
};

fuckin.Solid.prototype = Object.create(fuckin.EventDispatcher.prototype);
fuckin.Solid.prototype.constructor = fuckin.Solid;

fuckin.Solid.prototype.calculateMass = function() {
    return 1;
};

fuckin.Solid.prototype.addImpulse = function(impulse) {
    this.velocity.add(impulse, true);
    return this;
};

fuckin.Solid.prototype.moving = function() {
    return Boolean(this.velocity.x || this.velocity.y);
};
