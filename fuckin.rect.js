fuckin.Rect = function(options) {
    fuckin.Solid.call(this, options);
    this.width = options.width;
    this.height = options.height;
};

fuckin.Rect.prototype = Object.create(fuckin.Solid.prototype);
fuckin.Rect.prototype.constructor = fuckin.Rect;

fuckin.Rect.prototype.debug = function(canvasContext) {
    fuckin.Solid.prototype.debug.call(this, canvasContext);
    canvasContext.fillRect(this.x + .5, this.y + .5, this.width, this.height);
    canvasContext.strokeRect(this.x + .5, this.y + .5, this.width, this.height);
};
