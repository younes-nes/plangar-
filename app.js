// -------------------- TOGGLE MENUS --------------------
const addVideoBtn = document.getElementById("addVideoBtn");
const profileBtn = document.getElementById("profileBtn");
const addVideoMenu = document.getElementById("add-video-menu");
const profileMenu = document.getElementById("profile-menu");

addVideoBtn.onclick = () => {
    addVideoMenu.classList.toggle("hidden");
    profileMenu.classList.add("hidden");
};
profileBtn.onclick = () => {
    profileMenu.classList.toggle("hidden");
    addVideoMenu.classList.add("hidden");
};

// -------------------- DARK MODE --------------------
const darkModeBtn = document.getElementById("darkModeBtn");
darkModeBtn.onclick = () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "on" : "off");
};
window.addEventListener("load", () => {
    if(localStorage.getItem("darkMode") === "on") document.body.classList.add("dark-mode");
});

// -------------------- PROFILE --------------------
const avatarInput = document.getElementById("avatarUpload");
const avatarImg = document.getElementById("avatar");
const usernameInput = document.getElementById("username");

avatarInput.onchange = () => {
    let file = avatarInput.files[0];
    if(file) avatarImg.src = URL.createObjectURL(file);
};

document.getElementById("saveAvatarBtn").onclick = () => {
    localStorage.setItem("avatar", avatarImg.src);
    alert("Avatar enregistré !");
};

document.getElementById("saveUsernameBtn").onclick = () => {
    let name = usernameInput.value;
    localStorage.setItem("username", name);
    alert("Nom enregistré !");
};

window.addEventListener("load", () => {
    if(localStorage.getItem("avatar")) avatarImg.src = localStorage.getItem("avatar");
    if(localStorage.getItem("username")) usernameInput.value = localStorage.getItem("username");
});

// -------------------- MINI-JEU ATTRAPER 2 BALLES --------------------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const player = {x: canvas.width/2-25, y: canvas.height-40, width:50, height:20, speed:7, dx:0};
let balls = [];
const ballTypes = [
    {color:"orange", points:1, r:15},
    {color:"red", points:2, r:20},
    {color:"green", points:3, r:12},
    {color:"blue", points:5, r:25}
];

// Créer les 2 balles initiales
function initBalls(){
    balls = [];
    for(let i=0;i<2;i++) createBall();
}

function createBall(){
    const type = ballTypes[Math.floor(Math.random()*ballTypes.length)];
    let ball = {
        x: Math.random()*(canvas.width-type.r*2)+type.r,
        y: -type.r,
        r: type.r,
        color: type.color,
        points: type.points,
        dy: 2 + Math.random()*2
    };
    balls.push(ball);
}

function drawPlayer(){
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function movePlayer(){
    player.x += player.dx;
    if(player.x<0) player.x=0;
    if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;
}

function updateBalls(){
    balls.forEach((b,i)=>{
        b.y += b.dy;

        // collision avec joueur
        if(b.y+b.r>player.y && b.x>player.x && b.x<player.x+player.width){
            score += b.points;
            document.getElementById("gameScore").textContent = score;
            balls.splice(i,1);
            createBall(); // remplace la balle
        }

        // sortie du canvas
        if(b.y-b.r>canvas.height){
            balls.splice(i,1);
            createBall();
        }
    });
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawPlayer();
    balls.forEach(drawBall);
}

function gameLoop(){
    movePlayer();
    updateBalls();
    draw();
    requestAnimationFrame(gameLoop);
}

// contrôles clavier
document.addEventListener("keydown", e => {
    if(e.key==="ArrowLeft") player.dx=-player.speed;
    if(e.key==="ArrowRight") player.dx=player.speed;
});
document.addEventListener("keyup", e => {
    if(e.key==="ArrowLeft" || e.key==="ArrowRight") player.dx=0;
});

// Initialisation
initBalls();
gameLoop();
