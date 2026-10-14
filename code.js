/* tip stuff */

const tip = document.querySelector(".tip");
const judgement = document.querySelector("#judgement");
const startButton = document.querySelector("#start");

const possibleTips = [
    "did you know rhythm games were invented in the 1980s?",
    "please dont dismiss me!!!",
    "if i were a player i wouldnt dismiss tips tbh",
    "you dismiss tips? monster!",
    "what a great day to be a tip, i sure do hope i dont get dismissed",
    "im so excited to get back home to my tip wife and kids",
    "just dismiss me i have no funny oneliner",
    "people read these right?"
];

/* music */

const music = new Audio("assets/song.wav");

music.preload = "auto";
music.volume = 0.5;

const bpm = 120;
const beatLength = 60 / bpm;
const spawnInterval = beatLength * 2;
const timingWindow = 0.15;
const leadTime = spawnInterval;

let nextSpawnTime = leadTime;
let currentTipBeat = 0;
let tipClicked = true;
let gameRunning = false;

/* spawn a tip */

function spawnTip() {
    const padding = 100;

    const maxX = Math.max(
        0,
        window.innerWidth - tip.offsetWidth - padding * 2
    );

    const maxY = Math.max(
        0,
        window.innerHeight - tip.offsetHeight - padding * 2
    );

    const x = padding + Math.random() * maxX;
    const y = padding + Math.random() * maxY;

    tip.style.left = x + "px";
    tip.style.top = y + "px";

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * possibleTips.length);
    } while (
        possibleTips.length > 1 &&
        possibleTips[randomIndex] === tip.textContent
    );

    tip.textContent = possibleTips[randomIndex];

    tipClicked = false;
    tip.style.display = "block";
}

/* show judgement */

function showJudgement(text, color) {
    judgement.textContent = text;
    judgement.style.color = color;
}

/* check click timing */

function checkBeat() {
    return Math.abs(music.currentTime - currentTipBeat) <= timingWindow;
}

/* click tip */

tip.addEventListener("click", () => {
    if (!gameRunning || tipClicked || tip.style.display === "none") {
        return;
    }

    tipClicked = true;

    if (checkBeat()) {
        showJudgement("PERFECT!", "#66ff99");
    } else {
        showJudgement("MISS!", "#ff4444");
    }

    tip.style.display = "none";
});

/* game loop */

function gameLoop() {
    if (!gameRunning) return;

    const songTime = music.currentTime;

    // miss if u didnt hit it in time
    if (!tipClicked && songTime > currentTipBeat + timingWindow) {
        tipClicked = true;
        tip.style.display = "none";
        showJudgement("MISS!", "#ff4444");
    }

    // Spawn tips every two beats.
    if (songTime >= nextSpawnTime && tipClicked) {
        currentTipBeat = nextSpawnTime + leadTime;
        spawnTip();
        nextSpawnTime += spawnInterval;
    }

    if (!music.paused && !music.ended) {
        requestAnimationFrame(gameLoop);
    } else {
        gameRunning = false;
        tip.style.display = "none";
        showJudgement("SONG FINISHED!", "#ffffff");
        startButton.style.display = "block";
    }
}

/* start game */

startButton.addEventListener("click", async () => {
    music.pause();
    music.currentTime = 0;

    nextSpawnTime = leadTime;
    currentTipBeat = 0;
    tipClicked = true;
    gameRunning = true;
    startButton.style.display = "none";

    tip.style.display = "none";
    judgement.textContent = "";

    try {
        await music.play();
        gameLoop();
    } catch (error) {
        gameRunning = false;
        showJudgement("COULD NOT PLAY MUSIC", "#ff4444");
        console.error("Music playback failed:", error);
    }
});