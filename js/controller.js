class Controller {
    constructor() {
        this.model = {};
    }

    init(model, canvas) {
       this.model = model;
       this.canvas = canvas;
       this.addListeners();
       this.nodesWrite = {
           left: [],
           up: [],
           down: [],
           right: []
       }
    }

    getNodeWrite() {
        return this.nodesWrite;
    }

    addListeners() {
        let eventAction = (e) => {
            e.stopPropagation();
            if(this.model.isStopped) return;
            let keyAction = e.keyCode || e.target.id;
            //console.log(e.type + ": " + keyAction);
            switch (e.type) {
                case "keydown":
                case "mousedown":
                case "touchstart":
                    switch (keyAction) {
                        case 37:
                        case 65:
                        case "left-btn":
                            this.model.buttons.left.isPressed = true;
                            this.model.checkHit("left");
                            this.nodesWrite.left.push(new Date() - this.model.startTime - 2680);
                            break;
                        case 39:
                        case 70:
                        case "right-btn":
                            this.model.buttons.right.isPressed = true;
                            this.model.checkHit("right");
                            this.nodesWrite.right.push(new Date() - this.model.startTime - 2680);
                            break;
                        case 38:
                        case 83:
                        case "up-btn":
                            this.model.buttons.up.isPressed = true;
                            this.model.checkHit("up");
                            this.nodesWrite.up.push(new Date() - this.model.startTime - 2680);
                            break;
                        case 40:
                        case 68:
                        case "down-btn":
                            this.model.buttons.down.isPressed = true;
                            this.model.checkHit("down");
                            this.nodesWrite.down.push(new Date() - this.model.startTime - 2680);
                    }
                    break;
                case "keyup":
                case "mouseup":
                case "touchend":
                    switch (keyAction) {
                        case 37:
                        case 65:
                        case "left-btn":
                            this.model.buttons.left.isPressed = false;
                            break;
                        case 39:
                        case 70:
                        case "right-btn":
                            this.model.buttons.right.isPressed = false;
                            break;
                        case 38:
                        case 83:
                        case "up-btn":
                            this.model.buttons.up.isPressed = false;
                            break;
                        case 40:
                        case 68:
                        case "down-btn":
                            this.model.buttons.down.isPressed = false;
                    }
            }
        };

        $(window).keydown((e) => eventAction(e));
        $(window).keyup((e) => eventAction(e));

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.ontouchstart = (e) => eventAction(e);
            document.ontouchend = (e) => eventAction(e);
        } else {
            document.ontouchstart = (e) => eventAction(e);
            document.ontouchend = (e) => eventAction(e);
            $(window).mousedown((e) => eventAction(e));
            $(window).mouseup((e) => eventAction(e));
        }
    }
}