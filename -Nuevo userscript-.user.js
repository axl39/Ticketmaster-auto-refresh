// ==UserScript==
// @name         Ticketmaster Auto Refresher + Detector + Sonido
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match        *://*.ticketmaster.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("TM Script cargado correctamente");

    function playTicketSound() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 900;
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.4);
    }

    function buscarBoletos() {
        const botones = [...document.querySelectorAll("button, a")];
        const encontrados = botones.filter(b =>
            /boleto|ticket|resale|verified/i.test(b.innerText)
        );

        if (encontrados.length > 0) {
            console.log("🎟 BOLETOS DETECTADOS");
            playTicketSound();
            encontrados[0].click();
            return true;
        }
        return false;
    }

    function loop() {
        if (buscarBoletos()) return;
        console.log("⏳ Sin boletos, refrescando...");
        setTimeout(() => location.reload(), 3000);
    }

    setTimeout(loop, 2500);
})();