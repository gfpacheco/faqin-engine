fuckin.Game = function(canvas) {
    this.engine = new fuckin.Engine({
        canvas: canvas,
        debug: true
    });

    this.engine.addRect({
        x: 10,
        y: 50,
        width: 20,
        height: 20,
        velocity: {
            x: 1,
            y: -2
        },
        dynamic: true,
        gravity: true
    });

    this.engine.start();
};
