// Elements
const canvasEl = document.getElementById("canvas");
const rootEl = document.documentElement;

// Styles (extracting CSS variables)
const rootStyles = getComputedStyle(rootEl);

const backgroundColor = rootStyles.getPropertyValue("--background-color");
const resultColor = rootStyles.getPropertyValue("--result-color");

// Canvas setup

// Config
const radius = 3;
const fadeSpeed = 0.01;

const ctx = canvasEl.getContext("2d");

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawMousePosition(mouseX = 0, mouseY = 0) {
    ctx.fillStyle = backgroundColor;
    ctx.globalAlpha = fadeSpeed;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    ctx.fillStyle = resultColor;
    ctx.globalAlpha = 1;
    drawCircle(mouseX, mouseY, radius);
}

function resetCanvas() {
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
}

document.addEventListener("mousemove", (event) => {
    drawMousePosition(event.clientX, event.clientY);
});

document.addEventListener("touchmove", (event) => {
    for (const touch of event.touches) {
        drawMousePosition(touch.clientX, touch.clientY);
    }
})

document.addEventListener("resize", resetCanvas);
window.addEventListener("resize", resetCanvas);
window.addEventListener("orientationchange", resetCanvas);

resetCanvas();
