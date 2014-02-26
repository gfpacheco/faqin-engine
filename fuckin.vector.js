fuckin.Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

fuckin.Vector.prototype.dot = function(vector) {
    return (this.x * vector.x) + (this.y * vector.y);
};

fuckin.Vector.prototype.add = function(vector, self) {
    if (self) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    } else {
        return new fuckin.Vector(this.x + vector.y, this.y + vector.y);
    }
};

fuckin.Vector.prototype.sub = function(vector, self) {
    if (self) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    } else {
        return new fuckin.Vector(this.x - vector.y, this.y - vector.y);
    }
};

fuckin.Vector.prototype.invert = function(self) {
    if (self) {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    } else {
        return new fuckin.Vector(-this.x, -this.y);
    }
};

fuckin.Vector.prototype.multiply = function(scalar, self) {
    if (self) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    } else {
        return new fuckin.Vector(this.x * scalar, this.y * scalar);
    }
};

fuckin.Vector.prototype.distance = function(vector) {
    return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
};
