class View {
    constructor() {
        this.model = '';
        this.ctx = '';
    }

    init(model, canvas) {
        this.model = model;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    updateView() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.drawButtons();
    }

    drawButtons() {
        for(let key in this.model.buttons) {
            const btnImg = this.model.buttons[key].img();
            const btnX = this.model.buttons[key].posX;
            const btnY = this.model.buttons[key].posY;
            this.ctx.drawImage(btnImg, btnX, btnY, 200, 200);
        }
    }
}