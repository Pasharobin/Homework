"use strict";

var field = document.getElementById("field");
var ball = document.getElementById("ball");
var bat = document.getElementById("bat");
var restart = document.getElementById("restartbtn");
var RequestAnimationFrame =
// находим, какой requestAnimationFrame доступен
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
// ни один не доступен - будем работать просто по таймеру
function(callback)
    { window.setTimeout(callback, 1000 / 60); }
;

var game = {
    ballSpeed: 7, // скорость шара
    batSpeed: 8, // скорость биты
    lifesCount: 0, // счетчик жизней
    scoreCount: 0, // счетчик очков
    flag: true, // флаг потери жизни
    blocksLenght: 0, // начальное количество блоков
    map: [
        " b b b b b",
        "b b b b b ",
        " b b b b b",
        "b b b b b ",
        " b l x s b"],

    blocksBuilder: function () {
        var h = 3; // расстояние между строками блоков в процентах
        var w = 10; // расстояние между рядами блоков в процентах
        for (var i = 0; i < this.map.length; i++) {
            for (var n = 0; n < 10; n++) {
                if (this.map[i][n] != " ") {
                    var block = document.createElement("div");
                    block.className = "blocks";
                    block.style.top = 2*h + i*h + "%";
                    block.style.left = n*w + "%";
                    switch (this.map[i][n]) {
                        case ("b"):
                            block.className = "blocks";
                            break;
                        case ("x"):
                            block.className = "blocks bonus";
                            block.id = "x2";
                            block.innerHTML = "x2";
                            break;
                        case ("l"):
                            block.className = "blocks bonus";
                            block.id = "long";
                            block.innerHTML = "---";
                            break;
                        case ("s"):
                            block.className = "blocks bonus";
                            block.id = "short";
                            block.innerHTML = "-";
                            break;
                    }
                    field.appendChild(block);
                }
            }
        }
        var blocks = document.getElementsByClassName("blocks");
        game.blocksLenght = blocks.length;
    },

    blocksDestroyer: function () {
        var blocks = document.getElementsByClassName("blocks");
        for (var i = 0; i < blocks.length; i++) {
            var blockH = new Position(blocks[i]);        
            if (ballH.top() < blockH.bottom() && ballH.top() > blockH.top()) {
                if (ballH.x() > blockH.left() && ballH.x() < blockH.right()) {
                    ball.style.top = blockH.bottom() + "px";
                    blocks[i].style.display = "none";
                    this.scoreCounter();
                    bonus.check(blocks[i]);
                    speedY = -speedY;
                }
            }
            if (ballH.bottom() > blockH.top() && ballH.bottom() < blockH.bottom())  {
                if (ballH.x() > blockH.left() && ballH.x() < blockH.right()) {
                    ball.style.top = blockH.top() - ball.offsetHeight + "px";
                    blocks[i].style.display = "none";
                    this.scoreCounter();
                    bonus.check(blocks[i]);
                    speedY = -speedY;
                }
            }
            if (ballH.y() < blockH.bottom() && ballH.y() > blockH.top()) {
                if (ballH.left() > blockH.left() && ballH.left() < blockH.right()) {
                    ball.style.left = blockH.right() + "px";
                    blocks[i].style.display = "none";
                    this.scoreCounter();
                    bonus.check(blocks[i]);
                    speedX = -speedX;
                }
            }
            if (ballH.y() < blockH.bottom() && ballH.y() > blockH.top()) {
                if (ballH.right() > blockH.left() && ballH.right() < blockH.right()) {
                    ball.style.left = blockH.left() - ball.offsetWidth + "px";
                    blocks[i].style.display = "none";
                    this.scoreCounter();
                    bonus.check(blocks[i]);
                    speedX = -speedX;
                }
            }
        }
    },

    scoreCounter: function () {
        game.scoreCount++;
        var score = document.getElementById("score");
        score.innerHTML = "Score: " + game.scoreCount;
        if (game.scoreCount == game.blocksLenght) {
            this.reset();
            this.over();
        }
    },

    reset: function () {
        ball.style.top = field.offsetHeight/2 - ball.offsetHeight/2 + "px";
        ball.style.left = field.offsetWidth/2 - ball.offsetWidth/2 + "px";
        bat.style.left = field.offsetWidth/2 - bat.offsetWidth/2 + "px";
        speedX = 0;
        speedY = 0;
        this.flag = true;
    },

    lose: function () {
        this.reset();
        var lifes = document.getElementById("lifes");
        var hearts = lifes.childNodes;
        var noHeart = document.createElement("i");
        noHeart.className = "far fa-heart";
        noHeart.style.color = "black";
        lifes.replaceChild(noHeart, hearts[this.lifesCount]);
        if (game.lifesCount > 1) {
            this.over();
        }
        if (bonus.x2Flag) {
            bonus.x2Count = bonus.timer;
        }
        game.lifesCount++;
    },

    restart: function () {
        game.scoreCount = 0;
        game.lifesCount = 0;
        var score = document.getElementById("score");
        score.innerHTML = "Score: " + game.scoreCount;
        var lifes = document.getElementById("lifes");
        lifes.innerHTML = "<i class='fas fa-heart'></i><i class='fas fa-heart'></i><i class='fas fa-heart'></i>";
        var gameOver = document.getElementById("game-over");
        gameOver.style.top = -30 + "%";
        gameOver.style.opacity = "0";
        var blocks = document.getElementsByClassName("blocks");
        var length = blocks.length;
        for (var i = 0; i < length; i++) {
            field.removeChild(blocks[0]);
        }
        game.blocksBuilder();
        window.addEventListener("keydown", batMove, false);
    },

    over: function () {
        var gameOver = document.getElementById("game-over");
        var yourScore = document.getElementById("your-score");
        yourScore.innerHTML = "Your " + score.innerHTML;
        gameOver.style.top = field.offsetHeight/2 - gameOver.offsetHeight/2 + "px";
        gameOver.style.opacity = "1";
        window.removeEventListener("keydown", batMove, false);
    }
};

var bonus = {
    x2Flag: false,
    longFlag: false,
    shortFlag: false,
    x2Count: 0,
    longCount: 0,
    shortCount: 0,
    timer: 420,

    check: function (elem) {
        if (elem.id == "x2") {
            this.x2Flag = true;
        }
        if (elem.id == "long") {
            if (this.shortFlag) {
                this.shortCount = this.timer;
            }
            this.longFlag = true;
        }
        if (elem.id == "short") {
            if (this.longFlag) {
                this.longCount = this.timer;
            }
            this.shortFlag = true;
        }
    },

    x2: function () {
        if (this.x2Flag) {
            // console.log(bonus.x2Count);
            if (bonus.x2Count == 0) {
                speedX = speedX*1.6;
                speedY = speedY*1.6;
            }
            bonus.x2Count++;
            if (bonus.x2Count < this.timer) {
                ball.style.boxShadow = -speedX + "px " + -speedY + "px 12px 3px orange";
            } else {
                ball.style.boxShadow = "none";
                speedX = speedX/1.6;
                speedY = speedY/1.6;
                this.x2Flag = false;
                bonus.x2Count = 0;
            }
        }
    },

    long: function () {
        if (this.longFlag) {
            if (bonus.longCount == 0) {
                bat.style.width = bat.offsetWidth*2 + "px";
            }
            bonus.longCount++; 
            if (bonus.longCount > this.timer) {
                bat.style.width = Math.round(bat.offsetWidth/2) + "px";
                this.longFlag = false;
                bonus.longCount = 0;
            }
        }
    },

    short: function () {
        if (this.shortFlag) {
            if (bonus.shortCount == 0) {
                bat.style.width = Math.round(bat.offsetWidth/2) + "px";
            }
            bonus.shortCount++; 
            if (bonus.shortCount > this.timer) {
                bat.style.width = bat.offsetWidth*2 + "px";
                this.shortFlag = false;
                bonus.shortCount = 0;
            }
        }
    },
}

function Position(elem) {
    this.name = elem;
    this.x = function() {return elem.offsetLeft + elem.offsetWidth/2};
    this.y = function() {return elem.offsetTop + elem.offsetHeight/2};
    this.left = function() {return elem.offsetLeft};
    this.right = function() {return elem.offsetLeft + elem.offsetWidth};
    this.top = function() {return elem.offsetTop};
    this.bottom = function() {return elem.offsetTop +elem.offsetHeight};
};

var ballH = new Position(ball);
var batH = new Position(bat);

var batSpeed; 
var speedX; 
var speedY;

function tick() {
    ball.style.left = Math.round(ballH.left() + speedX) + "px";
    ball.style.top = Math.round(ballH.top() + speedY) + "px";
    // console.log(speedX + " " + speedY);
    bat.style.left = batH.left() + batSpeed + "px";
    if (batH.left() < 0) {
        bat.style.left = "0px";
    }
    if (batH.right() > field.offsetWidth) {
        bat.style.left =field.offsetWidth - bat.offsetWidth + "px";
    }
    game.blocksDestroyer();
    bonus.x2();
    bonus.long();
    bonus.short();
    if (ballH.bottom() > batH.top() && ballH.y() < batH.top()) {
        if (ballH.x() >  batH.left() && ballH.x() < batH.right()) {
        ball.style.top = bat.offsetTop - ball.offsetHeight + "px";
        speedY = -speedY;
        }
    }

    if (ballH.bottom() > field.offsetHeight) {
        ball.style.top = field.offsetHeight - ball.offsetHeight + "px";
        game.lose();
        // speedY = -speedY; 
    }
    if (ballH.top() < 0) {
        ball.style.top = "0px";
        speedY = -speedY; 
    }
    if (ballH.right() > field.offsetWidth) {
        ball.style.left = field.offsetWidth - ball.offsetWidth + "px";
        speedX = -speedX;
    }
    if (ballH.left() < 0) {
        ball.style.left = "0px";
        speedX = -speedX;
    }

    RequestAnimationFrame(tick);
}

function batMove(EO) {
    EO = EO || window.event;

    if (game.flag) {
        if (EO.keyCode == 37 || EO.keyCode == 39) {
            speedX = game.ballSpeed;
            speedY = game.ballSpeed;
            game.flag = false;
        }
    }
    if (EO.keyCode == 37) {
        batSpeed = -game.batSpeed;
    } else
    if (EO.keyCode == 39) {
        batSpeed = game.batSpeed;
    }
}

function batStop(EO) {
    EO = EO || window.event;

    if (EO.keyCode == 37 || EO.keyCode == 39) {
        batSpeed = 0;
    }
}

window.addEventListener("keydown", batMove, false);
window.addEventListener("keyup", batStop, false);
restart.addEventListener("click", game.restart, false);
game.blocksBuilder();
game.reset();
RequestAnimationFrame(tick);