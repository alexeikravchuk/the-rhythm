class Game {
    constructor() {
        this.model = new Model();
        this.view = new View();
        this.controller = new Controller();
        this.score = 0;
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

const canvas = $('.myCanvas')[0];

canvas.width = 900;
canvas.height = 1200;

localStorage.setItem('canvas.width', canvas.width);
localStorage.setItem('canvas.height', canvas.height);

const game = new Game().init(canvas);

$(document).ready(startGame());

function startGame() {
    const modal = $('#modal');
    const startBtn = $('.start-btn');
    const audio = $("#audio")[0];

    $('a.header_link').click(e => {
        game.pause();
        $('#modal').fadeIn();
    });

    modal.click(e => {
        if (e.target === startBtn[0]) {
            e.preventDefault();
            run();
        }
    });

    $(window).keydown(e => (e.keyCode === 13) && run());

    const run = e => {
        loadAudioData();
        audio.oncanplaythrough = () => {
            modal.fadeOut();
            playAudio();
            game.start();
        };

        const playAudio = () => {
            setTimeout(() => audio.play(), 5000);
        }
    };

    const loadAudioData = () => {
        let track = $('#track-choice')[0].value;
        let level = $('.level-choice input:checked').val();
        //write the level to the localStorage
        localStorage.setItem('level', level);

        //getting nodes from the "json" file and writing to the localStorage
        $.ajax(`audio/${track}.json`, {
            type:'GET',
            dataType:'text',
            success: data => localStorage.setItem('nodes', data),
            error: err => console.log("error: " + err)
        });

        audio.src = `audio/${track}.mp3`;

        //
        $('a.header_link').click(e => {
            audio.pause();
            game.pause();
        });

        //check the status of the game every 1 sec
        let checkGame = setInterval(() => {
            if(audio.ended) {
                game.pause();
                game.score = game.model.score;
                showSaveScoreWindow();
                console.log('game stopped');
                clearInterval(checkGame);
            }
        }, 1000);
    };
}

function showSaveScoreWindow() {
    $('#modal').fadeIn();
    $('#start-form').hide();
    $('#score-result').text(`${localStorage.score}`);
    $('#save-score-form').show();
}

$('#confirm-name-btn').click((e) => {
    e.preventDefault();
    $('#ask-nickname-form').hide();
    saveScoreData($('#nickname').val());
    $('#nickname').val('');
    $('#start-form').show();
    game.controller.addListeners(); // set the key handlers again
});

$('#no-btn').click((e) => {
    e.preventDefault();
    $('#start-form').show();
    $('#save-score-form').hide();
});


$('#yes-btn').click((e) => {
    $(document).keydown((e) => $(window).unbind('keydown')); //delete handlers to enter a name
    e.preventDefault();
    $('#save-score-form').hide();
    $('#ask-nickname-form').fadeIn();
});

//writing the result to google spreadsheets
function saveScoreData(name) {
    const scoreScript = "https://script.google.com/macros/s/AKfycbzigfbGe5K0N8eg4HMqE_W8ttwpwCN_LYESR4dwNsTQJTs5e2Y/exec";
    let track = $('#track-choice')[0].value;
    let level = $('.level-choice input:checked').val();
    let scoreNumber = localStorage.scoreNumber;
    localStorage.scoreNumber = ++scoreNumber;
    let data = `${scoreNumber},${name},${localStorage.score},${track},${level}`;
    fetch(scoreScript, {
        method : 'post',
        mode: 'no-cors',
        credentials: 'include',
        sameSite: 'lax',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: data
    })
        .then(() => console.log("the result was successfully saved in spreadsheets"))
        .catch(errorHandler);
}

