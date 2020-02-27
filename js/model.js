class Model {
    constructor() {
        this.view = {};
    }

    init(view) {
        this.isStopped = true;
        this.view = view;
        this.buttons = this.setButtons();
        this.rhythmLines = this.setRhythmLines();
        this.nodes = {left:[],up:[],down:[],right:[]};
        this.update();
    }

    update(){
        requestAnimationFrame(() => {
            this.view.updateView();
        });
    }

    animation() {
        requestAnimationFrame(() => {
            this.view.updateView();
            if(!this.isStopped) this.animation();
        });
    }

    prepare() {
        this.score = 0;
        this.level = localStorage.level;
        this.isStopped = false;
        this.nodes = JSON.parse(localStorage.nodes);
        this.nodeQueue = {
            left:   new Array(5),
            up:     new Array(5),
            down:   new Array(5),
            right:  new Array(5)
        };
        this.updateNodeQueue();
    }
    start() {
        console.log('start game');
        this.startTime = new Date();
        this.moveRhythmNodes();
        this.animation();
    }
    pause() {
        this.isStopped = true;
        localStorage.score = this.score;
    }

    getScore() {
        return this.score;
    }

    setButtons() {
        let canvasWidth = localStorage["canvas.width"];
        let canvasHeight = localStorage["canvas.height"];
        class Button {
            constructor(name, posX, posY) {
                this.name = name;
                this.posX = posX;
                this.posY = posY;
                this.isPressed = false;
                this.isHit = false;
                this.imgUp = this.setBtnImage(name, false);
                this.imgDownMissed = this.setBtnImage(name, true, false);
                this.imgDownHit = this.setBtnImage(name, true, true);
                this.img = () => this.isPressed ? (this.isHit ? this.imgDownHit : this.imgDownMissed) : this.imgUp;
            }
            setBtnImage(name, isPressed, isHit) {
                const btnImg = new Image(100, 50);
                btnImg.src = `./img/arrow-${name}-${isPressed ? (isHit ? 'pressed-hit' : 'pressed') : 'default'}.png`;
                return btnImg;
            }
        }
        return {
            left:   new Button("left", canvasWidth / 8     - 100, canvasHeight - 210),
            up:     new Button("up", canvasWidth / 8 * 3 - 100, canvasHeight - 210),
            down:   new Button("down", canvasWidth / 8 * 5 - 110, canvasHeight - 210),
            right:  new Button("right", canvasWidth / 8 * 7 - 100, canvasHeight - 210)
        }
    };

    //creating a queue of nodes of 5 pcs per line and updating
    updateNodeQueue() {
        let canvasHeight = localStorage['canvas.height'];

        let updateNodeTimer = setInterval(() => {
            for(let line in this.nodes) {
                for(let i = 0; i < this.nodeQueue[line].length; i++) {
                    let rhythmNode = this.nodeQueue[line][i];
                    let nodeTime;

                    // if the position is empty or the node leaves the canvas,
                    // remove the node from the beginning of the stack and add the next node
                    if(!rhythmNode || rhythmNode.posY > canvasHeight) {
                        this.nodeQueue[line].shift();
                        nodeTime = this.nodes[line].shift();
                        rhythmNode = this.createRhythmNode(line, nodeTime, 1);
                        this.nodeQueue[line].push(rhythmNode);
                        if(!rhythmNode) i--;
                    }

                    //clear timer if node list is empty or if game stopped
                    if(!this.nodes || this.isStopped) clearInterval(updateNodeTimer);
                }
            }
            //console.log(this.nodeQueue);
        }, 200);
    }

    setRhythmLines() {
        let canvasWidth = localStorage['canvas.width'];
        let canvasHeight = localStorage['canvas.height'];
        const startColor = '150,150,150';
        class RhythmLine {
            constructor(sX, sY, eX, eY, color) {
                this.startX = sX;
                this.startY = sY;
                this.endX = eX;
                this.endY = eY;
                this.color = color;
            }
        }
        return {
            left:   new RhythmLine(canvasWidth * 5 / 16,    0, canvasWidth / 8,     canvasHeight, startColor),
            up:     new RhythmLine(canvasWidth * 7 / 16,    0, canvasWidth / 8 * 3, canvasHeight, startColor),
            down:   new RhythmLine(canvasWidth * 9 / 16,    0, canvasWidth / 8 * 5, canvasHeight, startColor),
            right:  new RhythmLine(canvasWidth * 11 / 16,   0, canvasWidth / 8 * 7, canvasHeight, startColor),
        }
    }

    createRhythmNode(line, time, speed) {
        let canvasWidth = localStorage['canvas.width'];
        let canvasHeight = localStorage['canvas.height'];
        class RhythmNode {
            constructor(line, startTime, speed) {
                this.line = line;
                this.color = '80,100%,50%';
                this.startTime = startTime;
                this.speed = speed;
                this.posX = this.setPosX(this.line);
                this.posY = 0;
                this.isChecked = false;
            }
            setPosX = (line) => {
                switch (line) {
                    case 'left':
                        return canvasWidth * 5 / 16;
                    case 'up':
                        return canvasWidth * 7 / 16;
                    case 'down':
                        return  canvasWidth * 9 / 16;
                    case 'right':
                        return canvasWidth * 11 / 16;
                }
            }
        }
        return new RhythmNode(line, time, speed);
    }

    moveRhythmNodes() {
        let canvasWidth = localStorage['canvas.width'];
        let canvasHeight = localStorage['canvas.height'];
        let moveNodesTimer = setInterval(() => {
            let currentTime = new Date();
            let timeOffset = currentTime - this.startTime;
            for(let line in this.nodeQueue) {
                for (let node of this.nodeQueue[line]) {
                    if(node.startTime <= timeOffset) {
                        changePosition(node);
                        node.color = `${++node.color.split(',')[0]},${node.color.split(',')[1]},${node.color.split(',')[2]}`;
                    }
                }
            }
            if(this.isStopped) {
                clearInterval(moveNodesTimer);
            }
        }, 1000/60);

        //this function describes the change in the coordinates of nodes.
        const changePosition = node => {
            node.posY +=  node.speed + (node.speed * 0.5 * this.level);
            node.speed *= 1.01;
            switch (node.line) {
                case 'left':
                    node.posX = canvasWidth * (5 / 16) - canvasWidth * node.posY * (3 / (16 * canvasHeight));
                    break;
                case 'up':
                    node.posX = canvasWidth * (7 / 16) - canvasWidth * node.posY / (16 * canvasHeight);
                    break;
                case 'down':
                    node.posX = canvasWidth * (9 / 16) + canvasWidth * node.posY / (16 * canvasHeight);
                    break;
                case 'right':
                    node.posX = canvasWidth * (11 / 16) + canvasWidth * node.posY * (3 / (16 * canvasHeight));
            }
        }
    }

    checkHit(line) {
        let canvasHeight = localStorage['canvas.height'];
        let isHit = false;

        for (let node of this.nodeQueue[line]) {
            if(node.posY > canvasHeight - 200 && node.posY < canvasHeight - 70) {
                node.color = '120,100%,50%';
                if(!node.isChecked) {
                    isHit = true;
                    //console.log("hit");
                }
                node.isChecked = true;
            } else if (node.posY > canvasHeight - 70 && !node.isChecked) {
                node.color = '0,100%,40%';
                this.score -= 5;
                //console.log("missed");
            }
        }
        this.score += isHit ? Math.floor(50 * (1 + 0.1 * this.level)) : -10;
        this.buttons[line].isHit = isHit;
        this.highlightline(line, isHit);
    }

    highlightline(line, isHit) {
        this.rhythmLines[line].color = isHit ? '150,255,150' : '255,150,150';
        setTimeout(() => this.rhythmLines[line].color = '150,150,150', 300);
    }
}