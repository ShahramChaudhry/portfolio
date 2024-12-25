

document.addEventListener("DOMContentLoaded", function() {
    const torchLight = document.getElementById("torchLight");
    const torchImage = document.getElementById("torchImage");
    const textElements = document.querySelectorAll('.panel p');
    const audio = new Audio('https://github.com/ShahramChaudhry/Portfolio/maing.mp3');
    audio.volume = 0.1;
    audio.play();

    document.querySelectorAll('.panel').forEach(function(panel) {
        const panelImage = panel.querySelector('.panel-image');

        panelImage.addEventListener("mouseover", function() {
            panelImage.src = panelImage.dataset.hover;
        });

        panelImage.addEventListener("mouseout", function() {
            panelImage.src = "detective.png";
        });
    });

    textElements.forEach(function(textElement) {
    });

    document.addEventListener("mousemove", function(event) {
        var x = event.clientX - torchImage.clientWidth / 2;
        var y = event.clientY - torchImage.clientHeight / 2;

        torchLight.style.transform = "translate(" + x + "px, " + y + "px)";

        textElements.forEach(function(textElement) {
            var rect = textElement.getBoundingClientRect();
            var isInTorchRadius =
                rect.left < event.clientX && rect.right > event.clientX &&
                rect.top < event.clientY && rect.bottom > event.clientY;

            if (isInTorchRadius) {
                textElement.style.color = "grey";
            } else {
                textElement.style.color = "black";
            }
        });
    });

    document.addEventListener("mouseout", function() {
        textElements.forEach(function(textElement) {
            textElement.style.color = "black";
        });
    });
});
