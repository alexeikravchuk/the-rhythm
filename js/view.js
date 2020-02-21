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
        this.drawRhythmLines();
        if(!this.model.isStopped) {
            this.drawRhythmNodes();
            this.drawScore();
        }
        this.drawButtons();
    }

    drawRhythmLines() {
        for(let key in this.model.rhythmLines) {
            const startX = this.model.rhythmLines[key].startX;
            const startY = this.model.rhythmLines[key].startY;
            const endX = this.model.rhythmLines[key].endX;
            const endY = this.model.rhythmLines[key].endY;
            const startColor = this.model.rhythmLines[key].color;

            let grad = this.ctx.createLinearGradient(startX,startY, endX,endY);
            grad.addColorStop(0, `rgba(${startColor},0.5)`);
            grad.addColorStop(0.7,`rgba(${startColor},0.05)`);
            grad.addColorStop(1,`rgba(${startColor},0.01)`);
            this.ctx.fillStyle = grad;

            this.ctx.beginPath();
            this.ctx.moveTo(startX - 1, startY);
            this.ctx.lineTo(endX - 100, endY);
            this.ctx.lineTo(endX + 100, endY);
            this.ctx.lineTo(startX + 1, startY);
            this.ctx.fill();
        }
    }

    drawRhythmNodes() {
        for(let line in this.model.nodeQueue) {
            for (let node of this.model.nodeQueue[line]) {
                let radius = node.posY * 0.07;

                let grad = this.ctx.createRadialGradient(node.posX, node.posY, radius / 2, node.posX, node.posY, radius);
                grad.addColorStop(0, `hsla(${node.color},0.8)`);
                grad.addColorStop(1,`hsla(${node.color},0.01)`);
                this.ctx.fillStyle = grad;

                this.ctx.beginPath();
                this.ctx.arc(node.posX, node.posY, radius, 0,Math.PI*2, false);
                this.ctx.fill();
            }
        }
    }

    drawButtons() {
        for(let key in this.model.buttons) {
            const btnImg = this.model.buttons[key].img();
            const btnX = this.model.buttons[key].posX;
            const btnY = this.model.buttons[key].posY;
            this.ctx.drawImage(btnImg, btnX, btnY, 200, 200);
        }
    }

    drawScore() {
        this.ctx.fillStyle='blue';
        this.ctx.font='bold 38px Arial';
        this.ctx.fillText(`score: ${this.model.score}`,10,30);
    }
}