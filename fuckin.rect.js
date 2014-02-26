fuckin.Rect = function(options) {
    fuckin.Solid.call(this, options);
    this.width = options.width;
    this.height = options.height;
};

fuckin.Rect.prototype = Object.create(fuckin.Solid.prototype);
fuckin.Rect.prototype.constructor = fuckin.Rect;

fuckin.Rect.prototype.calculateMass = function() {
    return this.width * this.height / 100;
};
