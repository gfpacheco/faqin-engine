fuckin.Solid = function(options) {
    this.gravity = options.gravity;
    this.velocity = options.velocity || new fuckin.Vector();
    this.restitution = options.restitution || 1;
    this.inverseMass = (options.mass)? 1 / options.mass : (options.mass === 0)? 0 : 1;
    this.x = options.x || 0;
    this.y = options.y || 0;
};

fuckin.Solid.prototype.moving = function() {
    return Boolean(this.velocity.x || this.velocity.y);
};

fuckin.Solid.prototype.debug = function(canvasContext) {
    var moving = this.moving();
    canvasContext.fillStyle = moving? 'rgba(255, 0, 0, .2)' : 'rgba(0, 255, 0, .2)';
    canvasContext.strokeStyle = moving? 'rgba(255, 0, 0, .5)' : 'rgba(0, 255, 0, .5)';
    canvasContext.lineWidth = 1;
};
