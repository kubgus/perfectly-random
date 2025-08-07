// Elements
const resultEl = document.getElementById("result");

const upperEl = document.querySelector(".upper");
const lowerEl = document.querySelector(".lower");

const byteLengthEl = document.getElementById("byte-length");
const mouseEntropyLength = document.getElementById("mouse-entropy");

// Config
const fadeTitleAfter = 200; // entropy entries
const minResultLength = 1;
const maxResultLength = 256;

// Variable defaults
let resultLength = 32;
let mouseEntropy = []

function getRandomArray(length) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array;
}

function toBase64(uint8Array) {
    const binaryString = String.fromCharCode(...uint8Array);
    return btoa(binaryString);
}

function toBase64Url(uint8Array) {
    return toBase64(uint8Array)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function fadeContentBasedOnEntropy() {
    if (mouseEntropy.length > fadeTitleAfter) {
        upperEl.classList.add("hidden");
    } else if (mouseEntropy.length > 0) {
        lowerEl.classList.remove("hidden");
    }
}

function updateTooltips() {
    byteLengthEl.textContent = `byte_length = ${resultLength};`;
    mouseEntropyLength.textContent = `mouse_entropy = ${mouseEntropy.length};`;
}

function updateResult(mouseX = 0, mouseY = 0) {
    const array = getRandomArray(resultLength);

    mouseEntropy.push([mouseX, mouseY, Date.now()]);
    mouseEntropy.forEach(([x, y, date]) => {
        for (let i = 0; i < array.length; i++) {
            array[i] ^= (x ^ y ^ date) & 0xFF;
        }
    });

    resultEl.textContent = toBase64Url(array);

    updateTooltips();
    fadeContentBasedOnEntropy();
}

function editResultLength(delta = 0) {
    resultLength = clamp(resultLength + delta, minResultLength, maxResultLength);
    if (resultLength !== minResultLength && resultLength !== maxResultLength) {
        updateResult();
    }
}

document.addEventListener("mousemove", (event) => {
    updateResult(event.clientX, event.clientY);
});

document.addEventListener("touchmove", (event) => {
    for (const touch of event.touches) {
        updateResult(touch.clientX, touch.clientY);
    }
});

document.addEventListener("wheel", (event) => {
    const delta = event.deltaY > 0 ? -1 : 1;
    editResultLength(delta)
});

document.addEventListener("click", () => {
    const value = resultEl.textContent;
    if (value) {
        navigator.clipboard.writeText(value).then(() => {
            alert("Copied to clipboard: " + value);
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    }
});
