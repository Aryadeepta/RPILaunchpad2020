

var bg =
{
    draw: function () {
        ctx.fillStyle = ((background) ? "black" : "white");
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
}


var running = false,
    started = false;

function panic() {
    delta = 0;
}

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) {
        started = true;
        frameID = requestAnimationFrame(function (timestamp) {
            drawAll();
            running = true;
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
            frameID = requestAnimationFrame(mainLoop);
        });
    }
}

function mainLoop(timestamp) {
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        frameID = requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;

    var numUpdateSteps = 0;
    while (delta >= timestep) {
        drawAll()
        updateAll(timestep);
        }
        delta -= timestep;
        frames++;
        if (++numUpdateSteps >= 240) {
            panic();
        }

    drawAll()

    frameID = requestAnimationFrame(mainLoop);
}
start()