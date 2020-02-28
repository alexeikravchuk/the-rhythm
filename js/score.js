$(document).ready(() => {
    const loadingAnimation = $('#loading');
    loadingAnimation.show();

    $(window).on('hashchange',() => loadingAnimation.hide());

    let scores = [];

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzigfbGe5K0N8eg4HMqE_W8ttwpwCN_LYESR4dwNsTQJTs5e2Y/exec";
    loadScoresInfo();


    function loadScoresInfo() {
        fetch(scriptUrl)
            .then(response => response.json())
            .then(data => {
                scores = data.result;
                localStorage.setItem("scoreNumber", scores.length)
                sortScores();
                buildTable();
            })
            .catch(errorHandler);
    }

    function sortScores() {
        scores.sort((x, y) => {
            return x[2] < y[2] ? 1 : -1;
        })
    }

    function buildTable() {
        loadingAnimation.hide();
        let tbody = $('.table_body');
        let place = 1;
        for(let score of scores) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerText = `${place++}`;
            tr.appendChild(td);
            for(let item of score) {
                let td = document.createElement('td');
                td.innerText = `${item}`;
                tr.appendChild(td);
            }
            tbody.append(tr);
        }
    }
});