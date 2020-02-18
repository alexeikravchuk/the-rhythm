class Game {
    constructor() {
        this.model = new Model();
        this.view = new View();
        this.controller = new Controller();
    }

    init(canvas) {
        this.canvas = canvas;
        this.model.init(this.view);
        this.view.init(this.model, canvas);
        this.controller.init(this.model, canvas);
        return this;
    }
}

const canvas = $('.myCanvas')[0];

canvas.width = 900;
canvas.height = 1200;

const game = new Game().init(canvas);