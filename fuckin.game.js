fuckin.Game = function(canvas) {
    this.engine = new fuckin.Engine({
        canvas: canvas,
        viewport: new fuckin.Viewport({
            x: 0,
            y: 0,
            width: 180,
            height: 300,
            type: 'xFixed',
            xFixed: 70
        })
    });

    this.createPipes();
    this.createFloor();
    this.createBird();

    this.addEventListeners();

    this.engine.start();
};

fuckin.Game.prototype.createPipes = function() {
};

fuckin.Game.prototype.createFloor = function() {
    this.engine.addRect({
        x: -30,
        y: 250,
        width: 300,
        height: 50,
        velocity: new fuckin.Vector(1, 0),
        fill: 'rgba(20, 200, 20, 255)'
    });
};

fuckin.Game.prototype.createBird = function() {
    var that = this;

    this.bird = this.engine.addRect({
        x: 70,
        y: 80,
        width: 20,
        height: 20,
        velocity: new fuckin.Vector(1, 0),
        dynamic: true,
        gravity: 18,
        fill: 'rgba(255, 255, 0, 255)'
    });

    this.engine.viewport.anchor = this.bird;

    this.bird.jump = function() {
        that.bird.velocity.y = -7;
    };

    this.bird.addEventListener('collide', function(e) {
        that.engine.pause();
        alert('Morreu!');
    });
};

fuckin.Game.prototype.addEventListeners = function() {
    window.addEventListener('click', this.bird.jump);
    window.addEventListener('keydown', this.bird.jump);
};
