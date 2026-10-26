$(function () {
    var canvas = $("#ballCanvas")[0];
    var ctx = canvas.getContext("2d");

    var x = 80, y = 80;
    var dx = -2, dy = 1.5;
    var radius = 20;
    var moving = true;

    function drawBall() {
        if (moving) {
            //Reverse direction of the ball
            if (x + dx < radius || x + dx > canvas.width - radius) {
                dx = -dx;
            }

            if (y + dy < radius || y + dy > canvas.height - radius) {
                dy = -dy;
            }

            x += dx;
            y += dy;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f7f4ef";
        ctx.fill();
    }

    $("#ballCanvas").on("click", function (event) {
        var bounds = canvas.getBoundingClientRect();
        var mouseX = (event.clientX - bounds.left) * canvas.width / bounds.width;
        var mouseY = (event.clientY - bounds.top) * canvas.height / bounds.height;

        if (Math.hypot(mouseX - x, mouseY - y) <= radius) {
            moving = !moving;
            drawBall();
        }
    });

    drawBall();
    window.setInterval(drawBall, 20);
});