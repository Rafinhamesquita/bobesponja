const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis de personagens e física
let jogador = {
    x: 0,
    y: 0,
    largura: 120,
    altura: 120,
    velocidadeX: 0,
    velocidadeY: 0,
    gravidade: 0.3,
    forcaDoPulo: 12,
    pulando: false
};

let alvo = {
    x: 200,
    y: 200,
    largura: 70,
    altura: 70,
    velocidadeX: 0,
    velocidadeY: 0,
    pulando: false
};

// Variáveis do fundo
let imagemFundo = new Image();
imagemFundo.src = 'fundo.png';

// Carregar imagens do jogador e alvo
const imagemJogador = new Image();
imagemJogador.src = 'gato.png';

const imagemAlvo = new Image();
imagemAlvo.src = 'rato.png';

// Redimensionar canvas
function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();

// Limitar movimento
function limitarMovimento(obj) {
    if (obj.x < 0) obj.x = 0;
    if (obj.x + obj.largura > canvas.width) obj.x = canvas.width - obj.largura;
    if (obj.y < 0) obj.y = 0;
    if (obj.y + obj.altura > canvas.height) obj.y = canvas.height - obj.altura;
}

// Função de pulo
function pular() {
    if (!jogador.pulando) {
        jogador.velocidadeY = -jogador.forcaDoPulo;
        jogador.pulando = true;
    }
}

// Atualiza pulo do jogador
function atualizarPuloJogador() {
    if (jogador.pulando) {
        jogador.velocidadeY += jogador.gravidade;
        jogador.y += jogador.velocidadeY;
        if (jogador.y + jogador.altura >= canvas.height) {
            jogador.y = canvas.height - jogador.altura;
            jogador.pulando = false;
            jogador.velocidadeY = 0;
        }
    }
}

// Atualiza física do alvo chutado
function atualizarFisicaAlvo() {
    if (alvo.pulando) {
        alvo.velocidadeY += jogador.gravidade;
        alvo.x += alvo.velocidadeX;
        alvo.y += alvo.velocidadeY;

        if (alvo.y + alvo.altura >= canvas.height) {
            alvo.y = canvas.height - alvo.altura;
            alvo.pulando = false;
            alvo.velocidadeX = 0;
            alvo.velocidadeY = 0;
        } else {
            alvo.velocidadeX *= 0.95;
        }
    }
}

// Função para chutar o alvo
function chutar() {
    let distX = alvo.x + alvo.largura / 2 - (jogador.x + jogador.largura / 2);
    let distY = alvo.y + alvo.altura / 2 - (jogador.y + jogador.altura / 2);
    let distancia = Math.sqrt(distX ** 2 + distY ** 2);

    if (distancia < 150) {
        alvo.velocidadeX = distX > 0 ? 20 : -20;
        alvo.velocidadeY = -20;
        alvo.pulando = true;
    }
}

// Desenhar elementos
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(imagemJogador, jogador.x, jogador.y, jogador.largura, jogador.altura);
    ctx.drawImage(imagemAlvo, alvo.x, alvo.y, alvo.largura, alvo.altura);
}

// Loop principal
function jogo() {
    if (teclas['ArrowLeft']) jogador.x -= 3;
    if (teclas['ArrowRight']) jogador.x += 3;
    if (teclas['ArrowUp']) jogador.y -= 3;
    if (teclas['ArrowDown']) jogador.y += 3;

    if (teclas[' '] && !jogador.pulando) pular();
    if (teclas['f']) chutar();

    atualizarPuloJogador();
    atualizarFisicaAlvo();

    limitarMovimento(jogador);
    limitarMovimento(alvo);

    desenhar();

    requestAnimationFrame(jogo);
}

// Controle de teclas
let teclas = {};
window.addEventListener('keydown', (e) => teclas[e.key] = true);
window.addEventListener('keyup', (e) => teclas[e.key] = false);

// Carregar imagens antes de iniciar
let imagensCarregadas = 0;
const totalImagens = 3;

function verificarImagensCarregadas() {
    imagensCarregadas++;
    if (imagensCarregadas === totalImagens) {
        jogo();
    }
}

imagemJogador.onload = verificarImagensCarregadas;
imagemAlvo.onload = verificarImagensCarregadas;
imagemFundo.onload = verificarImagensCarregadas;
