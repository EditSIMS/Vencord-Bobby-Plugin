/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

// custom imports
import bobImg from "./bob.png";

// vars
let bob: HTMLImageElement | null = null;

export default definePlugin({
    name: "bobby",
    description: "My first addon. It's a smiley cube that bounces around",
    authors: [{ name: "qa_pl_zm", id: 836960069722832958n }],

    // script
    start() {
        bob = document.createElement("img");
        bob.src = bobImg;
        bob.style.position = "fixed";
        bob.style.width = "150px";
        bob.style.height = "150px";
        bob.style.left = "calc(50% - 75px)"; // center horizontally
        bob.style.top = "calc(50% - 75px)"; // center vertically
        bob.style.zIndex = "9999";
        document.body.appendChild(bob);
    },

    stop() {
        if (bob) {
            bob.remove();
            bob = null;
        }
    }
});
