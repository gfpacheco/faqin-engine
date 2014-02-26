fuckin.Game = function(canvas) {
    var that = this;

    this.engine = new fuckin.Engine({
        canvas: canvas
    });

    this.bird = this.engine.addRect({
        x: 10,
        y: 50,
        width: 20,
        height: 20,
        velocity: new fuckin.Vector(0, 0),
        dynamic: true,
        gravity: true,
        fill: 'rgba(255, 255, 0, 255)'
    });

    this.bird.jump = function() {
        that.bird.velocity.y = -5;
    };

    this.bird.addEventListener('collide', function(e) {
        console.log('collided with ' + e.solid);
    });

    window.addEventListener('click', this.bird.jump);
    window.addEventListener('keydown', this.bird.jump);

    this.engine.start();
};
