class Model {
    score = 0;
    constructor() {
        this.view = {};
    }

    init(view) {
        this.view = view;
        this.buttons = {
            left: {
                isPressed: false,
                imgUp: this.setBtnImage("left", false),
                imgDown: this.setBtnImage("left", true),
                img: () => this.buttons.left.isPressed ? this.buttons.left.imgDown : this.buttons.left.imgUp,
                posX: 900 / 8 - 100,
                posY: 1200 - 210
            },
            right: {
                isPressed: false,
                imgUp: this.setBtnImage("right", false),
                imgDown: this.setBtnImage("right", true),
                img: () => this.buttons.right.isPressed ? this.buttons.right.imgDown : this.buttons.right.imgUp,
                posX: 900 / 8 * 7 - 100,
                posY: 1200 - 210
            },
            up: {
                isPressed: false,
                imgUp: this.setBtnImage("up", false),
                imgDown: this.setBtnImage("up", true),
                img: () => this.buttons.up.isPressed ? this.buttons.up.imgDown : this.buttons.up.imgUp,
                posX: 900 / 8 * 3 - 100,
                posY: 1200 - 210
            },
            down: {
                isPressed: false,
                imgUp: this.setBtnImage("down", false),
                imgDown: this.setBtnImage("down", true),
                img: () => this.buttons.down.isPressed ? this.buttons.down.imgDown : this.buttons.down.imgUp,
                posX: 900 / 8 * 5 - 110,
                posY: 1200 - 210
            },
        };
        this.update();
    }

    update(){
        requestAnimationFrame(() => {
            this.view.updateView();
            this.update();
        });
    }

    setBtnImage(name, isPressed) {
        const btnImg = new Image(100, 50);
        btnImg.src = `./img/arrow-${name}-${isPressed ? 'pressed' : 'default'}.png`;
        return btnImg;
    }
}