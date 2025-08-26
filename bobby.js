/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

const bobWidth = 48;
const bobHeight = 32;

const bobMinScale = 1.0;
const bobMaxScale = 2.0;

const bobEatChance = 0.4;
const bobBirthThreshold = 3;
const bobRaycastFrames = 30;
const bobSpeedMultiplier = 5.0;

const bobStartAmount = 5;

let bobs = [];

class Bobby {
    element = null;

    x = 0.0;
    y = 0.0;
    velX = 0.0;
    velY = 0.0;
    scale = 0.0;
    speed = 0.0;
    animID = 0;
    scaledWidth = 0.0;
    scaledHeight = 0.0;

    // eating and reproduction
    nutrition = 0;
    hasBirthed = false;
    frameCount = 0;

    physicsLoop = () => {
        this.x += this.velX * this.speed;
        this.y += this.velY * this.speed;

        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        const left = 0;
        const right = winWidth - this.scaledWidth;
        const top = 0;
        const bottom = winHeight - this.scaledHeight;

        if (this.x <= left || this.x >= right) {
            this.velX = -this.velX;
        }

        if (this.y <= top || this.y >= bottom) {
            this.velY = -this.velY;
        }

        this.setPos();

        if (this.frameCount > bobRaycastFrames && !this.hasBirthed) {
            this.eatElement();
            this.frameCount = 0;
        }

        this.frameCount += 1;

        this.animID = requestAnimationFrame(this.physicsLoop);
    };

    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.initVals();

        // make element
        this.element = document.createElement("img");
        this.element.src = `https://github.com/EditSIMS/Vencord-Bobby-Plugin/blob/main/bobby/bob${Math.floor(Math.random() * 7) + 1}.png?raw=true`;
        this.element.style.position = "fixed";
        this.element.style.width = `${this.scaledWidth}px`;
        this.element.style.height = `${this.scaledHeight}px`;
        this.element.style.zIndex = "9999";
        this.element.style.imageRendering = "pixelated";
        this.element.style.pointerEvents = "none";
        document.body.appendChild(this.element);

        this.setPos();

        requestAnimationFrame(this.physicsLoop);
    }

    initVals() {
        // this.x = Math.floor(Math.random() * ((window.innerWidth - this.scaledWidth) * 10)) / 10;
        // this.y = Math.floor(Math.random() * ((window.innerHeight - this.scaledWidth) * 10)) / 10;

        this.velX = Math.random() < 0.5 ? -1 : 1;
        this.velY = Math.random() < 0.5 ? -1 : 1;

        this.scaledWidth = this.scale * bobWidth;
        this.scaledHeight = this.scale * bobHeight;

        this.speed = (bobSpeedMultiplier * 2) - (this.scale - 1) * bobSpeedMultiplier;
    }

    eatElement() {
        var centerX = this.x + this.scaledWidth / 2;
        var centerY = this.y + this.scaledHeight / 2;
        var elem = document.elementFromPoint(centerX, centerY);

        if (elem && elem instanceof HTMLElement) {
            var edible = false; // set to true for them to destroy discord

            if (elem.tagName === "IMG") {
                edible = true;
            }
            else if (elem.tagName === "A" && elem.dataset.role === "img") {
                edible = true;
            }
            else if (elem.tagName === "VIDEO") {
                edible = true;
            }

            elem.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    edible = true;
                }
            });

            if (edible && Math.random() < bobEatChance) {
                if (this.nutrition >= bobBirthThreshold) {
                    var scale = Math.random() * (bobMaxScale - bobMinScale) + 1.0;

                    bobs.push(new Bobby(centerX, centerY, scale));
                    this.hasBirthed = true;
                }

                this.nutrition += 1;
                elem.remove();
            }
        }
    }

    setPos() {
        this.x = clamp(this.x, 0, window.innerWidth - this.scaledWidth);
        this.y = clamp(this.y, 0, window.innerHeight - this.scaledHeight);

        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    deInit() {
        cancelAnimationFrame(this.animID);
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

let running = true;

function startBobbies() {
    for (let i = 0; i < bobStartAmount; i++) {
        let scale = Math.random() * (bobMaxScale - bobMinScale) + 1.0;
        let randX = Math.floor(Math.random() * ((window.innerWidth - bobWidth * scale) * 10)) / 10;
        let randY = Math.floor(Math.random() * ((window.innerHeight - bobHeight * scale) * 10)) / 10;

        bobs.push(new Bobby(randX, randY, scale));
    }
    console.log("Bobbies running... Press ESC to stop");
}

function stopBobbies() {
    bobs.forEach(b => b.deInit());
    bobs = [];
    running = false;
    console.log("Bobbies stopped.");
}

// listen for ESC to stop
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && running) {
        stopBobbies();
    }
});

startBobbies();
