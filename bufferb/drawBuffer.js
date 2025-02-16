const canvas = document.getElementById("blackboard");
const ctx = canvas.getContext("2d");
const customColorPicker = document.getElementById("customColor");
const strokeWidthInput = document.getElementById("strokeWidth");


let strokeWidth = 2;
let drawing = false;
let chalkColor = "white";
let lastX = 0, lastY = 0;
let history = [];


function setHighResolutionCanvas(width, height, scaleFactor) {
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(scaleFactor, scaleFactor);
}

setHighResolutionCanvas(1920, 1080, 2);

function saveState() {
    history.push(canvas.toDataURL());
}

canvas.addEventListener("mousedown", (e) => {
    saveState();
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseleave", () => drawing = false);
canvas.addEventListener("mousemove", draw);
customColorPicker.addEventListener("input", (e) => chalkColor = e.target.value);
strokeWidthInput.addEventListener("input", (e) => strokeWidth = e.target.value);

function draw(e) {
    if (!drawing) return;
    ctx.strokeStyle = chalkColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function clearBoard() {
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveBoard() {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "blackboard_sketch.png";
    link.click();
}

function undo() {
    if (history.length > 0) {
        let previousState = history.pop();
        let img = new Image();
        img.src = previousState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        undo();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
        undo();
    }
});