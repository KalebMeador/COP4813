// JavaScript source code
function drawSpirograph() {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var R = Number(document.getElementById("R").value);
    var r = Number(document.getElementById("r").value);
    var O = Number(document.getElementById("O").value);

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();

    for (var t = 0; t < 20 * Math.PI; t += 0.05) {

        var x =
            centerX +
            (R + r) * Math.cos(t) -
            (r + O) *
            Math.cos(((R + r) / r) * t);

        var y =
            centerY +
            (R + r) * Math.sin(t) -
            (r + O) *
            Math.sin(((R + r) / r) * t);

        if (t == 0) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
}


function randomize() {

    var R = Math.floor(Math.random() * 51) + 50;
    var r = Math.floor(Math.random() * 31) + 10;
    var O = Math.floor(Math.random() * 51);

    document.getElementById("R").value = R;
    document.getElementById("r").value = r;
    document.getElementById("O").value = O;
}
