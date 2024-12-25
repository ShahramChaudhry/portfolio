
document.addEventListener('DOMContentLoaded', function () {

  
    document.addEventListener('mousemove', function (e) {
        mx = e.clientX - canv.offsetLeft;
        my = e.clientY - canv.offsetTop;

        customCursor.style.left = (mx - customCursor.width / 2) + 'px';
        customCursor.style.top = (my - customCursor.height / 2) + 'px';
    });

    document.body.style.cursor = 'none';

    var pixels = [];
    var canv = document.getElementById('canv');
    var ctx = canv.getContext('2d');
    var wordCanv = document.getElementById('wordCanv');
    var wordCtx = wordCanv.getContext('2d');
    var mx = -1;
    var my = -1;
    var words = "";
    var txt = [];
    var cw = document.body.clientWidth;
    var ch = 1090;
    var resolution = 1;
    var n = 0;
    var timerRunning = false;
    var resHalfFloor = 0;
    var resHalfCeil = 0;
    var backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.volume = 0.1;
    canv.width = cw;
    canv.height = ch;
    wordCanv.width = cw;
    wordCanv.height = ch;

    function canv_mousemove(evt) {
        mx = evt.clientX - canv.offsetLeft;
        my = evt.clientY - canv.offsetTop;
    }

    function Pixel(homeX, homeY) {
        this.homeX = homeX;
        this.homeY = homeY;
        this.x = Math.random() * cw;
        this.y = Math.random() * ch;
        this.xVelocity = Math.random() * 10 - 5;
        this.yVelocity = Math.random() * 10 - 5;
        this.type = 'questionMark';
    }

    Pixel.prototype.move = function () {
        var homeDX = this.homeX - this.x;
        var homeDY = this.homeY - this.y;
        var homeDistance = Math.sqrt(Math.pow(homeDX, 2) + Math.pow(homeDY, 2));
        var homeForce = homeDistance * 0.01;
        var homeAngle = Math.atan2(homeDY, homeDX);

        var cursorForce = 0;
        var cursorAngle = 0;

        if (mx >= 0) {
            var cursorDX = this.x - mx;
            var cursorDY = this.y - my;
            var cursorDistanceSquared = Math.pow(cursorDX, 2) + Math.pow(cursorDY, 2);
            cursorForce = Math.min(1000 / cursorDistanceSquared, 1000);
            cursorAngle = Math.atan2(cursorDY, cursorDX);
        } else {
            cursorForce = 0;
            cursorAngle = 0;
        }

        this.xVelocity += homeForce * Math.cos(homeAngle) + cursorForce * Math.cos(cursorAngle);
        this.yVelocity += homeForce * Math.sin(homeAngle) + cursorForce * Math.sin(cursorAngle);

        this.xVelocity *= 0.92;
        this.yVelocity *= 0.92;

        this.x += this.xVelocity;
        this.y += this.yVelocity;
    };

    function $(id) {
        return document.getElementById(id);
    }

    function timer() {
        if (!timerRunning) {
            timerRunning = true;
            setTimeout(timer, 33);
            for (var i = 0; i < pixels.length; i++) {
                pixels[i].move();
            }

            drawPixels();

            n++;
            if (n % 10 == 0 && cw != document.body.clientWidth) body_resize();
            timerRunning = false;
        } else {
            setTimeout(timer, 10);
        }
    }


    function drawPixels() {
        var baseQuestionMarkSize = 2;
        var baseDotRadius = 0.2;
        var baseQuestionMarkLineWidth = 0.2;

        ctx.clearRect(0, 0, cw, ch); 

        for (var i = 0; i < pixels.length; i++) {
            if (pixels[i].type === 'questionMark') {
                ctx.beginPath();

       
                var distanceToMouse = Math.sqrt(Math.pow(pixels[i].x - mx, 2) + Math.pow(pixels[i].y - my, 2));
                var sizeMultiplier = Math.max(1, 100 / distanceToMouse); 

                var questionMarkSize = baseQuestionMarkSize * sizeMultiplier;
                var dotRadius = baseDotRadius * sizeMultiplier;
                var questionMarkLineWidth = baseQuestionMarkLineWidth * sizeMultiplier;

   
                ctx.moveTo(pixels[i].x, pixels[i].y);
                ctx.quadraticCurveTo(
                    pixels[i].x + questionMarkSize * 1.2,
                    pixels[i].y + questionMarkSize * 1.2,
                    pixels[i].x,
                    pixels[i].y + questionMarkSize * 2
                );


                ctx.lineTo(pixels[i].x, pixels[i].y + questionMarkSize * 4);

                ctx.arc(pixels[i].x, pixels[i].y + questionMarkSize * 4, dotRadius, 0, Math.PI * 2);

                ctx.lineWidth = questionMarkLineWidth;
                ctx.strokeStyle = '#fff'; 
                ctx.stroke();
                ctx.closePath();
            } else {
             
            }
        }
    }


    function canv_mousemove(evt) {
        mx = evt.clientX - canv.offsetLeft;
        my = evt.clientY - canv.offsetTop;
    }

    canv.addEventListener('click', function (evt) {
        handleQuestionMarkClick(evt);
    });

    function handleQuestionMarkClick(evt) {
  
        for (var i = 0; i < pixels.length; i++) {
            if (pixels[i].type === 'questionMark') {
                var distanceToMouse = Math.sqrt(Math.pow(pixels[i].x - mx, 2) + Math.pow(pixels[i].y - my, 2));
                if (distanceToMouse < maxQuestionMarkSize) {
                  
                    console.log('Question mark clicked!');

                }
            }
        }
    }

    function readWords() {

        words = 'Shahram Chaudhry';
        txt = words.split('\n');
    }

    function init() {
        readWords();
        phraseDisplayStartTime = Date.now();

        var fontSize = 60;
        var wordWidth = 0;
        do {
            wordWidth = 0;
            fontSize -= 5;
            wordCtx.font = fontSize + "px Arial";
            for (var i = 0; i < txt.length; i++) {
                var w = wordCtx.measureText(txt[i]).width;
                if (w > wordWidth) wordWidth = w;
            }
        } while (wordWidth > cw - 50 || fontSize * txt.length > ch - 50);

        wordCtx.clearRect(0, 0, cw, ch);
        wordCtx.textAlign = "center";
        wordCtx.textBaseline = "bottom";
        for (var i = 0; i < txt.length; i++) {
            wordCtx.fillText(txt[i], cw / 2, 290 - fontSize * (txt.length / 2 - (i + 0.5)));
        }

        var index = 0;

        var imageData = wordCtx.getImageData(0, 0, cw, ch);
        for (var x = 0; x < imageData.width; x += resolution) {
            for (var y = 0; y < imageData.height; y += resolution) {
                i = (y * imageData.width + x) * 4;

                if (imageData.data[i + 3] > 128) {
                    if (index >= pixels.length) {
                        pixels[index] = new Pixel(x, y);
                    } else {
                        pixels[index].homeX = x;
                        pixels[index].homeY = y;
                    }
                    pixels[index].type = 'questionMark'; 
                    index++;
                }
            }
        }

        pixels.splice(index, pixels.length - index);
    }

    function body_resize() {
        cw = document.body.clientWidth;
        canv.width = cw;
        wordCanv.width = cw;
        init();
    }

    var displayDuration = 5000; 
    var currentPhraseIndex = 0;
    var phraseDisplayStartTime;

    resHalfFloor = Math.floor(resolution / 2);
    resHalfCeil = Math.ceil(resolution / 2);
    body_resize();
    timer();


var displayDuration = 5000; 
    var currentPhraseIndex = 0;
    var phraseDisplayStartTime;

    resHalfFloor = Math.floor(resolution / 2);
    resHalfCeil = Math.ceil(resolution / 2);
    body_resize();
    timer();
});