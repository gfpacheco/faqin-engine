fuckin.Viewport = function(options) {
    fuckin.Rect.call(this, options);
    this.anchor = options.anchor;
    this.type = options.type;
    this.margin = options.margin;
    this.xFixed = options.xFixed;
};

fuckin.Viewport.prototype = Object.create(fuckin.Rect.prototype);
fuckin.Viewport.prototype.constructor = fuckin.Viewport;

fuckin.Viewport.prototype.update = function() {
    if (!this.anchor) {
        return;
    }

    if (this.type === 'margin') {
        if (this.anchor.x < this.x + this.margin.x) {
            this.x = this.anchor.x - this.margin.x;
        } else if (this.anchor.x > this.x + this.width - this.margin.x) {
            this.x = this.anchor.x + this.margin.x - this.width;
        }

        if (this.anchor.y < this.y + this.margin.y) {
            this.y = this.anchor.y - this.margin.y;
        } else if (this.anchor.y > this.y + this.height - this.margin.y) {
            this.y = this.anchor.y + this.margin.y - this.height;
        }
    } else if (this.type === 'xFixed') {
        this.x = this.anchor.x - this.xFixed;
    } else if (this.type === 'yFixed') {
        this.y = this.anchor.y - this.yFixed;
    }
};
