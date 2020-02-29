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
    prepare() {
        this.model.prepare();
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
setCanvasSize();

function setCanvasSize() {
    let availHeight = window.screen.availHeight;
    let availWidth = window.screen.availWidth;
    if(availWidth >= availHeight) {
        canvas.width = 900;
        canvas.height = 1000;
    } else {
        canvas.width = 900;
        canvas.height = 1400;
    }
    localStorage.setItem('canvas.width', canvas.width);
    localStorage.setItem('canvas.height', canvas.height);
}

$( window ).resize(function() {
    game.pause();
    $('#modal').fadeIn();
    setCanvasSize();
    game.init(canvas);
    startGame();
    game.model.update();
    console.log('resize')
});

const game = new Game().init(canvas);

updateScoreNumber();

$(document).ready(startGame);

function startGame() {
    const modal = $('#modal');
    const startBtn = $('.start-btn')[0];
    const audio = $("#audio")[0];
    const modalContent = $('#modal-content');
    const loadingAnimation = $('#loading');
    let audioTimer;

    $('a.header_link, .header_logo').click(resetGame);

    modal.click(e => {
        if (e.target === startBtn) {
            e.preventDefault();
            game.model.update();
            run();
            modalContent.fadeOut();
            loadingAnimation.fadeIn();
        }
    });

    $(window).keydown(e => (e.keyCode === 13) && run());

    function run () {
        loadAudioData();
        audio.oncanplaythrough = () => {
            if(!game.starded) {
                clearTimeout(audioTimer);
                modal.show();
            }
            loadingAnimation.hide();
            modal.hide();
            countdown();
            game.prepare();
            playAudio();
            modalContent.fadeIn();
        };

        const playAudio = () => {
            audioTimer = setTimeout(() => {
                audio.play();
                game.start();
            }, 4000);
        }
    }

    function resetGame() {
        audio.pause();
        game.pause();
        clearTimeout(audioTimer);
        modal.show();
        loadingAnimation.hide();
        resetCountdown();
        game.model.update();
        modalContent.fadeIn();
    }

    const loadAudioData = () => {
        let track = $('#track-choice')[0].value;
        let level = $('.level-choice input:checked').val();
        //write the level to the localStorage
        localStorage.setItem('level', level);

        //getting nodes from the "json" file and writing to the localStorage
        $.ajax(`audio/${track}-${level}.json`, {
            type:'GET',
            dataType:'text',
            success: data => localStorage.setItem('nodes', data),
            error: err => console.log("error: " + err)
        });

        audio.src = `audio/${track}.mp3`;

        //
        $('a.header_link').click(e => {
            resetGame();
        });



        //check the status of the game every 0.2 sec
        let checkGame = setInterval(() => {
            if (audio.ended) {
                game.pause();
                //localStorage.setItem('nodeHistory', JSON.stringify(game.controller.getNodeWrite()));
                loadingAnimation.hide();
                showSaveScoreWindow();
                console.log('game stopped');
                clearInterval(checkGame);
            } else if (!game.starded) {
                audio.pause();
            } else if(window.location.hash !== '#game') {
                resetGame();
            } else if(!window.navigator.onLine) {
                $('#start-form').hide();
                modalContent.append(
                    `<div style="color: darkred">
                        Connection is lost. Reload the page.
                    </div>`);
                resetGame();
            }
            checkPageVisibility();
        }, 50);
    };
}

//displaying a window with an offer to save the result
function showSaveScoreWindow() {
    $('#modal').fadeIn();
    $('#start-form').hide();
    $('#score-result').text(`${localStorage.score}`);
    $('#save-score-form').show();
}

//if the player refused to save
$('#no-btn').click((e) => {
    e.preventDefault();
    $('#save-score-form').hide();
    $('#start-form').show();

});

//if the player agreed to save the result
$('#yes-btn').click((e) => {
    e.preventDefault();
    e.stopPropagation();
    $('#save-score-form').hide();
    $('#ask-nickname-form').fadeIn();
});

$('#nickname').focusin(() => $(window).unbind('keydown')); //delete handlers to enter a name
$('#nickname').focusout(() => game.controller.addListeners()); // set the key handlers again

//actions if the player agreed to record the result
$('#confirm-name-btn').click((e) => {
    e.preventDefault();
    e.stopPropagation();

    let nickname = $('#nickname').val().trim();
    //nickname lite validation

    if($('#nickname:invalid')[0] || nickname.length < 3) {
        $('#nickname').val('');
        $('#nickname')[0].setAttribute('placeholder', 'min 3 letters or digits');
        return;
    }

    $('#ask-nickname-form').hide();
    saveScoreData(nickname);
    $('#nickname').val('');
    $('#start-form').show();
});


//writing the result to google spreadsheets
function saveScoreData(name) {
    const scoreScript = "https://script.google.com/macros/s/AKfycbzigfbGe5K0N8eg4HMqE_W8ttwpwCN_LYESR4dwNsTQJTs5e2Y/exec";
    let track = $("#track-choice option:selected").text();
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

let resetCountdown;
function countdown() {
    let number = 4;
    $('.countdown').show();
    timer = setInterval(() => {
        $('.countdown__area').text(--number);
        if(number === 0) {
            resetCountdown();
        }
    }, 1000);

    resetCountdown = function () {
        clearInterval(timer);
        $('.countdown').hide();
        $('.countdown__area').text("");
    }
}

function checkPageVisibility() {
    if(document.hidden || document.mozHidden) {
        game.pause();
        $('#modal').fadeIn();
    }
}

function updateScoreNumber() {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbzigfbGe5K0N8eg4HMqE_W8ttwpwCN_LYESR4dwNsTQJTs5e2Y/exec";
    fetch(scriptUrl)
        .then(response => response.json())
        .then(data => localStorage.setItem("scoreNumber", data.result.length));
}
