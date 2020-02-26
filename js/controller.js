class Controller {
    constructor() {
        this.model = {};
    }

    init(model, canvas) {
       this.model = model;
       this.canvas = canvas;
       this.addListeners();
    }

    addListeners() {
        let eventAction = (e) => {
            if(this.model.isStopped) return;
            let keyAction = e.keyCode || e.target.id;
            //console.log(e.type + ": " + keyAction);
            switch (e.type) {
                case "keydown":
                case "mousedown":
                case "touchstart":
                    switch (keyAction) {
                        case 37:
                        case "left-btn":
                            this.model.buttons.left.isPressed = true;
                            this.model.checkHit("left");
                            break;
                        case 39:
                        case "right-btn":
                            this.model.buttons.right.isPressed = true;
                            this.model.checkHit("right");
                            break;
                        case 38:
                        case "up-btn":
                            this.model.buttons.up.isPressed = true;
                            this.model.checkHit("up");
                            break;
                        case 40:
                        case "down-btn":
                            this.model.buttons.down.isPressed = true;
                            this.model.checkHit("down");
                    }
                    break;
                case "keyup":
                case "mouseup":
                case "touchend":
                    switch (keyAction) {
                        case 37:
                        case "left-btn":
                            this.model.buttons.left.isPressed = false;
                            break;
                        case 39:
                        case "right-btn":
                            this.model.buttons.right.isPressed = false;
                            break;
                        case 38:
                        case "up-btn":
                            this.model.buttons.up.isPressed = false;
                            break;
                        case 40:
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
            $(window).mousedown((e) => eventAction(e));
            $(window).mouseup((e) => eventAction(e));
        }
    }
}