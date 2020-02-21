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
    start() {
        this.model.start();
        this.starded = true;
    }

    pause() {
        this.model.pause();
        this.starded = false;
    }
}

const startGame = () => {
    const canvas = $('.myCanvas')[0];

    canvas.width = 900;
    canvas.height = 1200;

    localStorage.setItem('canvas.width', canvas.width);
    localStorage.setItem('canvas.height', canvas.height);

    const game = new Game().init(canvas);

    $(document).ready(function() {

        $('a.header_link').click(e => {
            game.pause();
            $('#modal').fadeIn();
        });

        const modal = $('#modal');
        const startBtn = $('.start-btn');
        const audio = $("audio")[0];


        modal.click(e => {
            if (e.target === startBtn[0]) run(e);
        });
        $(window).keydown(e => (e.keyCode === 13) && run(e));

        const run = e => {
            e.preventDefault();
            setTimeout(() => playAudio(), 3000);
            modal.fadeOut();
            let track = $('#track-choice')[0].value;
            let level = $('.level-choice input:checked').val();
            localStorage.setItem('level', level);
            //console.log(level);

            //getting nodes from the "json" file and writing to the localStorage
            $.ajax(`audio/${track}.json`, {
                type:'GET',
                dataType:'text',
                success: data => localStorage.setItem('nodes', data),
                error: err => console.log("error: " + err)
            });
            game.start();
        };

        const playAudio = () => {
            let track = $('#track-choice')[0].value;
            audio.src = `https://alexeikravchuk.github.io/the-rhythm/audio/${track}.mp3`;
            audio.play();
            $('a.header_link').click(e => {
                audio.pause();
            });
            let checkGame = setInterval(()=>{
                if(audio.paused) {
                    game.pause();
                    console.log('game stopped');
                    clearInterval(checkGame);
                }
            }, 1000);
        };
    });
};

startGame();