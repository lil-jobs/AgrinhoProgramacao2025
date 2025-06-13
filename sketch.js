let tratorX, tratorY;
let estrada = [];
let estradaLargura = 180; // Aumentei a largura da estrada
let velocidadeTrator = 5; // Velocidade do trator (constante)
let km = 0;
let cidadeY; // Posição Y da cidade

// --- VARIÁVEIS DE JOGO E ESTADO ---
let gameState = "MENU"; // Começa no menu

// Variáveis para o jogador (personagem) fora do trator
let playerX, playerY;
let playerSpeed = 3; // Velocidade do personagem a pé

// Arrays para armazenar árvores e pedras
let trees = [];
let rocks = [];
let numTrees = 300; // Mais árvores
let numRocks = 50; // Menos pedras

// Variáveis para armazenar os elementos da cidade
let cityBuildings = []; // Para prédios maiores com janelas
let cityDecorations = []; // Para casas, carros, parques, etc.

// Variáveis para controlar a mensagem de "Entrar no Trator"
let showEnterTratorMessage = true;
let enterTratorMessageTimer = 0;
const ENTER_TRATOR_MESSAGE_DURATION = 2000; // 2 segundos em milissegundos

// Variável para indicar se o trator está perto da cidade
let nearCity = false;

// Cor do trator
let tratorColor;
let tratorDarkerColor;

// --- FIM VARIÁVEIS ---

function setup() {
  createCanvas(600, 800);
  resetGame(); // Inicializa o jogo no setup
}

function draw() {
  background(100, 155, 100); // Fundo padrão para "grama"

  // A função draw agora controla qual "tela" mostrar
  switch (gameState) {
    case "MENU":
      drawMenu();
      break;
    case "HOW_TO_PLAY":
      drawHowToPlay();
      break;
    case "PLAYING":
      gameLoop(); // Toda a lógica do trator acontece aqui
      break;
    case "GAME_OVER":
      drawGameOver();
      break;
    case "WON":
      drawGameWon();
      break;
    case "PLAYER_WALKING":
      playerWalkingLoop(); // Lógica para o personagem a pé
      break;
  }
}

// --- FUNÇÕES DE TELAS ---

function drawMenu() {
  background(50, 150, 200); // Cor de fundo do menu (azul claro)
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("TRATOR AVENTURA", width / 2, height / 2 - 100);

  textSize(30);
  // Botão Play
  let playButtonX = width / 2;
  let playButtonY = height / 2;
  let buttonWidth = 200;
  let buttonHeight = 60;

  fill(0, 200, 0); // Cor do botão Jogar (verde)
  rect(
    playButtonX - buttonWidth / 2,
    playButtonY - buttonHeight / 2,
    buttonWidth,
    buttonHeight,
    10
  );
  fill(255);
  text("JOGAR", playButtonX, playButtonY);

  // Botão Como Jogar
  let howToPlayButtonX = width / 2;
  let howToPlayButtonY = height / 2 + 80;

  fill(0, 100, 200); // Cor do botão Como Jogar (azul)
  rect(
    howToPlayButtonX - buttonWidth / 2,
    howToPlayButtonY - buttonHeight / 2,
    buttonWidth,
    buttonHeight,
    10
  );
  fill(255);
  text("COMO JOGAR", howToPlayButtonX, howToPlayButtonY);
}

function drawHowToPlay() {
  background(100, 100, 150); // Cor de fundo (roxo claro)
  fill(255);
  textSize(40);
  textAlign(CENTER, TOP);
  text("COMO JOGAR", width / 2, 50);

  textSize(24);
  textAlign(LEFT, TOP);
  text("Controles (A Pé):", 50, 150);
  text("    W / Seta Cima: Mover para cima", 50, 190);
  text("    S / Seta Baixo: Mover para baixo", 50, 220);
  text("    A / Seta Esquerda: Mover para esquerda", 50, 250);
  text("    D / Seta Direita: Mover para direita", 50, 280);
  text("    E: Entrar no trator", 50, 310);

  text("Controles (Trator):", 50, 370);
  text("    W / Seta Cima: Acelerar para cima", 50, 410);
  text("    S / Seta Baixo: Frear para baixo", 50, 440);
  text("    A / Seta Esquerda: Virar para esquerda", 50, 470);
  text("    D / Seta Direita: Virar para direita", 50, 500);
  text("    R: Descarregar na cidade (Ganhar!)", 50, 530);

  text("Objetivo:", 50, 590);
  text("    Entre no trator e chegue na cidade com sua carga de soja.", 50, 630);

  // Botão Voltar
  let backButtonX = width / 2;
  let backButtonY = height - 100;
  let buttonWidth = 150;
  let buttonHeight = 50;

  fill(200, 0, 0); // Cor do botão Voltar (vermelho)
  rect(
    backButtonX - buttonWidth / 2,
    backButtonY - buttonHeight / 2,
    buttonWidth,
    buttonHeight,
    10
  );
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER); // Centraliza o texto dentro do botão
  text("VOLTAR", backButtonX, backButtonY);
}

function drawGameOver() {
  background(150, 0, 0); // Fundo vermelho escuro
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("VOCÊ PERDEU!", width / 2, height / 2 - 50);

  textSize(30);
  drawRestartButton();
}

function drawGameWon() {
  background(0, 150, 0); // Fundo verde escuro
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("VOCÊ É O CAMPEÃO!", width / 2, height / 2 - 100);
  textSize(35);
  text("A soja foi entregue com sucesso!", width / 2, height / 2);
  text("Parabéns, fazendeiro!", width / 2, height / 2 + 50);

  textSize(30);
  drawRestartButton();
}

function drawRestartButton() {
  let restartButtonX = width / 2;
  let restartButtonY = height / 2 + 150; // Ajustei a posição
  let buttonWidth = 200;
  let buttonHeight = 60;

  fill(50, 50, 200); // Cor do botão Reiniciar (azul escuro)
  rect(
    restartButtonX - buttonWidth / 2,
    restartButtonY - buttonHeight / 2,
    buttonWidth,
    buttonHeight,
    10
  );
  fill(255);
  text("REINICIAR", restartButtonX, restartButtonY);
}

// --- LÓGICA PRINCIPAL DO JOGO (trator) ---

function gameLoop() {
  // Controles do trator
  if (keyIsDown(65)) tratorX -= 3; // A
  if (keyIsDown(68)) tratorX += 3; // D
  if (keyIsDown(87)) tratorY -= velocidadeTrator; // W (vai pra cima)
  if (keyIsDown(83)) tratorY += velocidadeTrator; // S (vai pra baixo)

  let segmentoEstradaAtual = null;
  for (let i = estrada.length - 1; i >= 0; i--) {
    let e = estrada[i];
    if (tratorY >= e.y && tratorY < e.y + 20) {
      segmentoEstradaAtual = e;
      break;
    }
  }

  if (segmentoEstradaAtual) {
    let limiteEsquerdoEstrada = segmentoEstradaAtual.x - estradaLargura / 2;
    let limiteDireitoEstrada = segmentoEstradaAtual.x + estradaLargura / 2;
    tratorX = constrain(tratorX, limiteEsquerdoEstrada, limiteDireitoEstrada);
  }

  // Câmera segue o trator
  push();
  translate(0, height / 2 - tratorY);

  // Desenhar estrada e postes
  noStroke();
  for (let i = 0; i < estrada.length; i++) {
    let e = estrada[i];
    fill(50); // Cor da estrada (cinza escuro)
    rect(e.x - estradaLargura / 2, e.y, estradaLargura, 20);

    // Desenhar postes a cada 8 segmentos da estrada (menos postes)
    // E garantir que não apareçam postes na área da cidade
    if (i % 8 === 0 && e.y > cidadeY + 50) { // Adicionada condição para não aparecer na cidade
      stroke(255); // Cor do poste (branco)
      strokeWeight(3);
      line(
        e.x - estradaLargura / 2 - 10,
        e.y + 10,
        e.x - estradaLargura / 2 - 10,
        e.y - 20
      );
      line(
        e.x + estradaLargura / 2 + 10,
        e.y + 10,
        e.x + estradaLargura / 2 + 10,
        e.y - 20
      );
      noStroke();
    }
  }

  // AQUI É A MUDANÇA PRINCIPAL:
  // Desenhar a *rua* da cidade ANTES do trator, mas os *prédios/decorações* DEPOIS
  const currentViewY = tratorY - height / 2;
  const cityBottom = cidadeY + 500;

  if (currentViewY < cityBottom + height && currentViewY > cidadeY - height) {
    drawCityRoad(cidadeY); // Desenha apenas a rua da cidade
  }

  // Desenhar árvores e pedras
  drawObstacles();

  // Desenhar trator
  fill(tratorColor); // trator (cor aleatória)
  rect(tratorX - 15, tratorY - 20, 30, 40);
  fill(tratorDarkerColor); // parte de baixo do trator
  rect(tratorX - 15, tratorY + 20, 30, 10);

  // Desenhar a carreta
  fill(150, 75, 0); // Cor da carreta (marrom)
  rect(tratorX - 25, tratorY + 40, 50, 60); // Carreta
  fill(205, 133, 63); // Cor da soja (laranja claro/marrom claro)
  rect(tratorX - 20, tratorY + 45, 40, 50); // Soja dentro da carreta

  fill(100); // base da carreta
  rect(tratorX - 25, tratorY + 100, 50, 10);

  // AQUI É A MUDANÇA PRINCIPAL:
  // Desenhar os prédios e decorações da cidade DEPOIS do trator
  if (currentViewY < cityBottom + height && currentViewY > cidadeY - height) {
    drawCityBuildingsAndDecorations(cidadeY); // Desenha prédios e decorações da cidade
  }

  pop(); // Restaura as configurações de transformação

  // Medidor de KM (sempre visível no topo da tela)
  resetMatrix(); // Volta para a origem da tela para desenhar HUD
  fill(0); // Cor do texto (preto)
  textSize(20);
  text(`KM: ${km.toFixed(1)} km`, 20, 30);

  // Verifica se está perto da cidade para ativar a vitória
  if (tratorY >= cidadeY && tratorY <= cidadeY + 500) {
    nearCity = true;
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, TOP);
    text("Pressione 'R' para descarregar a soja!", width / 2, 90);
  } else {
    nearCity = false;
  }

  km = (tratorY - cidadeY) / 100;
  if (km < 0) km = 0;

  // Colisão com árvores e pedras (adicionei a lógica de GAME_OVER aqui)
  for (let tree of trees) {
    if (dist(tratorX, tratorY, tree.x, tree.y) < (tree.size / 2) + 15) {
      let estaNaEstrada = false;
      if (segmentoEstradaAtual) {
        if (tratorX >= segmentoEstradaAtual.x - estradaLargura / 2 && tratorX <= segmentoEstradaAtual.x + estradaLargura / 2) {
          estaNaEstrada = true;
        }
      }
      if (!estaNaEstrada) {
        gameState = "GAME_OVER";
      }
    }
  }

  for (let rock of rocks) {
    if (dist(tratorX, tratorY, rock.x, rock.y) < (rock.size / 2) + 10) {
      let estaNaEstrada = false;
      if (segmentoEstradaAtual) {
        if (tratorX >= segmentoEstradaAtual.x - estradaLargura / 2 && tratorX <= segmentoEstradaAtual.x + estradaLargura / 2) {
          estaNaEstrada = true;
        }
      }
      if (!estaNaEstrada) {
        gameState = "GAME_OVER";
      }
    }
  }

  // Check for collision with poles
  // This assumes poles are drawn at every 8th segment of the road
  // We'll check for collision with the tractor's center
  const tractorHitRadius = 20; // Approximate hit radius for the tractor
  for (let i = 0; i < estrada.length; i++) {
    let e = estrada[i];
    // Apenas verifica colisão se o poste estiver fora da área da cidade
    if (i % 8 === 0 && e.y > cidadeY + 50) { // Adicionada condição para não verificar colisão na cidade
      let poleLeftX = e.x - estradaLargura / 2 - 10;
      let poleRightX = e.x + estradaLargura / 2 + 10;
      let poleY = e.y + 10; // Base of the pole, where collision is most likely

      // Check collision with left pole
      if (dist(tratorX, tratorY, poleLeftX, poleY) < tractorHitRadius) {
        gameState = "GAME_OVER";
        break; // No need to check other poles
      }
      // Check collision with right pole
      if (dist(tratorX, tratorY, poleRightX, poleY) < tractorHitRadius) {
        gameState = "GAME_OVER";
        break; // No need to check other poles
      }
    }
  }

  // Also check collision with city poles - removed as per request
  // The logic for city poles was removed from here.
}

// --- LÓGICA DO JOGADOR A PÉ ---

function playerWalkingLoop() {
  background(100, 155, 100); // Fundo grama

  // Controles do jogador a pé
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) playerX -= playerSpeed; // Esquerda (seta ou A)
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) playerX += playerSpeed; // Direita (seta ou D)
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) playerY -= playerSpeed; // Cima (seta ou W)
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) playerY += playerSpeed; // Baixo (seta ou S)

  // A câmera segue o jogador
  push();
  translate(0, height / 2 - playerY); // Câmera segue o jogador

  // Desenhar estrada e postes (os mesmos do gameLoop)
  noStroke();
  for (let i = 0; i < estrada.length; i++) {
    let e = estrada[i];
    fill(50);
    rect(e.x - estradaLargura / 2, e.y, estradaLargura, 20);
    // E garantir que não apareçam postes na área da cidade
    if (i % 8 === 0 && e.y > cidadeY + 50) { // Adicionada condição para não aparecer na cidade
      stroke(255);
      strokeWeight(3);
      line(
        e.x - estradaLargura / 2 - 10,
        e.y + 10,
        e.x - estradaLargura / 2 - 10,
        e.y - 20
      );
      line(
        e.x + estradaLargura / 2 + 10,
        e.y + 10,
        e.x + estradaLargura / 2 + 10,
        e.y - 20
      );
      noStroke();
    }
  }

  // AQUI É A MUDANÇA PRINCIPAL:
  // Desenhar a *rua* da cidade ANTES do trator/jogador, mas os *prédios/decorações* DEPOIS
  const currentViewY = playerY - height / 2;
  const cityBottom = cidadeY + 500;
  if (currentViewY < cityBottom + height && currentViewY > cidadeY - height) {
    drawCityRoad(cidadeY); // Desenha apenas a rua da cidade
  }

  // Desenhar árvores e pedras
  drawObstacles();

  // Desenhar trator parado
  fill(tratorColor);
  rect(tratorX - 15, tratorY - 20, 30, 40);
  fill(tratorDarkerColor);
  rect(tratorX - 15, tratorY + 20, 30, 10);
  fill(150, 75, 0); // Cor da carreta (marrom)
  rect(tratorX - 25, tratorY + 40, 50, 60); // Carreta
  fill(205, 133, 63); // Cor da soja (laranja claro/marrom claro)
  rect(tratorX - 20, tratorY + 45, 40, 50); // Soja dentro da carreta
  fill(100); // base da carreta
  rect(tratorX - 25, tratorY + 100, 50, 10);


  // AQUI É A MUDANÇA PRINCIPAL:
  // Desenhar os prédios e decorações da cidade DEPOIS do trator/jogador
  if (currentViewY < cityBottom + height && currentViewY > cidadeY - height) {
    drawCityBuildingsAndDecorations(cidadeY); // Desenha prédios e decorações da cidade
  }

  // Desenhar jogador
  fill(0, 0, 200); // Cor do jogador (azul)
  ellipse(playerX, playerY, 20, 20); // Simples círculo para o jogador

  pop(); // Restaura as configurações

  // HUD (KM) continua visível
  resetMatrix();
  fill(0);
  textSize(20);
  text(`KM: ${km.toFixed(1)} km`, 20, 30);

  // Instrução para o jogador a pé (com timer)
  if (showEnterTratorMessage) {
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, TOP);
    text("Pressione 'E' perto do trator para entrar.", width / 2, 90);

    // Gerencia o timer da mensagem
    if (millis() - enterTratorMessageTimer > ENTER_TRATOR_MESSAGE_DURATION) {
      showEnterTratorMessage = false;
    }
  }
}

// --- FUNÇÕES DE INTERAÇÃO DO USUÁRIO ---

function mousePressed() {
  if (gameState === "MENU") {
    let playButtonX = width / 2;
    let playButtonY = height / 2;
    let buttonWidth = 200;
    let buttonHeight = 60;

    // Clicou em JOGAR?
    if (
      mouseX > playButtonX - buttonWidth / 2 &&
      mouseX < playButtonX + buttonWidth / 2 &&
      mouseY > playButtonY - buttonHeight / 2 &&
      mouseY < playButtonY + buttonHeight / 2
    ) {
      gameState = "PLAYER_WALKING"; // Inicia no modo a pé
      resetGame(); // Reinicia o jogo ao começar uma nova partida
    }

    // Clicou em COMO JOGAR?
    let howToPlayButtonX = width / 2;
    let howToPlayButtonY = height / 2 + 80;
    if (
      mouseX > howToPlayButtonX - buttonWidth / 2 &&
      mouseX < howToPlayButtonX + buttonWidth / 2 &&
      mouseY > howToPlayButtonY - buttonHeight / 2 &&
      mouseY < howToPlayButtonY + buttonHeight / 2
    ) {
      gameState = "HOW_TO_PLAY";
    }
  } else if (gameState === "HOW_TO_PLAY") {
    let backButtonX = width / 2;
    let backButtonY = height - 100;
    let buttonWidth = 150;
    let buttonHeight = 50;

    // Clicou em VOLTAR?
    if (
      mouseX > backButtonX - buttonWidth / 2 &&
      mouseX < backButtonX + buttonWidth / 2 &&
      mouseY > backButtonY - buttonHeight / 2 &&
      mouseY < backButtonY + buttonHeight / 2
    ) {
      gameState = "MENU";
    }
  } else if (gameState === "GAME_OVER" || gameState === "WON") {
    // Clicou em REINICIAR?
    let restartButtonX = width / 2;
    let restartButtonY = height / 2 + 150;
    let buttonWidth = 200;
    let buttonHeight = 60;

    if (
      mouseX > restartButtonX - buttonWidth / 2 &&
      mouseX < restartButtonX + buttonWidth / 2 &&
      mouseY > restartButtonY - buttonHeight / 2 &&
      mouseY < restartButtonY + buttonHeight / 2
    ) {
      gameState = "MENU"; // Volta para o menu
      resetGame(); // Reinicia todas as variáveis do jogo
    }
  }
}

function keyPressed() {
  if (keyCode === 69) {
    // KeyCode para a tecla 'E'
    if (gameState === "PLAYER_WALKING") {
      // Verificar se está perto do trator (ajustei o ponto de referência do trator)
      if (dist(playerX, playerY, tratorX, tratorY + 20) < 40) {
        // +20 para pegar no meio do trator
        gameState = "PLAYING"; // Entra no trator
      }
    }
  }
  if (keyCode === 82) {
    // KeyCode para a tecla 'R'
    if (gameState === "PLAYING" && nearCity) {
      gameState = "WON"; // Ganha o jogo se estiver na cidade e apertar R
    }
  }
}

// --- FUNÇÃO DE REINICIAR O JOGO ---

function resetGame() {
  tratorX = width / 2;
  tratorY = 8000; // Trator começa lá embaixo

  // Posiciona o jogador ao lado do trator no início
  playerX = tratorX - 50;
  playerY = tratorY;

  // Reinicia as variáveis de estado do jogo
  km = 0;
  showEnterTratorMessage = true; // Mostra a mensagem novamente
  enterTratorMessageTimer = millis(); // Reseta o timer da mensagem
  nearCity = false; // Reseta a flag de perto da cidade

  // Escolhe uma cor aleatória para o trator
  const tractorColors = [
    color(255, 0, 0),    // Vermelho
    color(255, 204, 0),  // Amarelo
    color(0, 200, 0),    // Verde
    color(255, 120, 0)   // Laranja
  ];
  tratorColor = random(tractorColors);
  // Calcula uma cor mais escura para a parte de baixo do trator
  tratorDarkerColor = color(red(tratorColor) * 0.7, green(tratorColor) * 0.7, blue(tratorColor) * 0.7);


  // Recria a estrada para que as curvas sejam diferentes a cada jogo
  estrada = [];
  let x = width / 2;
  for (let y = 8000; y > 0; y -= 20) {
    x += random(-30, 30);
    x = constrain(x, 100, width - 100);
    estrada.push({ x: x, y: y });
  }

  // Define a posição Y da cidade no final da estrada (no final do "mapa" virtual)
  // O último elemento da estrada é o mais "para baixo" (maior Y)
  cidadeY = estrada[estrada.length - 1].y;

  // Limpa os arrays de obstáculos e edifícios antes de gerar novos
  trees = [];
  rocks = [];
  cityBuildings = []; // Zera os prédios
  cityDecorations = []; // Zera as decorações da cidade

  // Ajuste a margem de segurança para evitar a estrada
  const margin = 30; // 10 pixels de cada lado da estrada (estradaLargura/2 + 10)
  // Para a geração de obstáculos, é melhor usar a largura da tela e subtrair a área da estrada
  // A estrada é gerada dinamicamente, então os limites exatos variam,
  // mas podemos usar os limites médios da estrada para a geração de obstáculos.
  const avgRoadLeftEdge = width / 2 - estradaLargura / 2;
  const avgRoadRightEdge = width / 2 + estradaLargura / 2;


  // Gera árvores e pedras ao longo de TODA a estrada, começando DEPOIS da cidade
  const minObstacleY = cidadeY + 200; // Começa a gerar obstáculos um pouco abaixo da cidade
  const maxObstacleY = estrada[estrada.length - 1].y; // Vai até o final da estrada

  for (let i = 0; i < numTrees; i++) {
    let y = random(minObstacleY, maxObstacleY);
    let xPos;
    // Garante que as árvores não nasçam na estrada
    do {
      xPos = random(0, width);
    } while (xPos >= avgRoadLeftEdge - margin && xPos <= avgRoadRightEdge + margin);
    trees.push({ x: xPos, y: y, size: random(20, 50) });
  }

  for (let i = 0; i < numRocks; i++) {
    let y = random(minObstacleY, maxObstacleY);
    let xPos;
    // Garante que as pedras não nasçam na estrada
    do {
      xPos = random(0, width);
    } while (xPos >= avgRoadLeftEdge - margin && xPos <= avgRoadRightEdge + margin);
    rocks.push({ x: xPos, y: y, size: random(10, 25) });
  }

  // --- GERAÇÃO DOS EDIFÍCIOS E DECORAÇÕES DA CIDADE (AGORA FIXOS) ---
  const cityHeight = 500; // Altura total da cidade
  const buildingColors = [
    color(60),
    color(80, 80, 80),
    color(150, 0, 0),
    color(50, 50, 150),
    color(100, 50, 10),
  ];
  const windowColor = color(255, 255, 150, 180);

  // Lado esquerdo da estrada na cidade - Gerando prédios
  for (let currentY = cidadeY + cityHeight - 50; currentY > cidadeY; currentY -= random(60, 120)) {
    let buildingWidth = random(40, 80);
    let buildingHeight = random(50, 200);
    let buildingX = random(0, width / 2 - estradaLargura / 2 - buildingWidth - 10);
    let windows = [];
    for (let j = 0; j < buildingHeight / 30; j++) {
      windows.push({
        x: buildingX + 5,
        y: currentY - buildingHeight + 5 + j * 30,
        w: buildingWidth - 10,
        h: 15
      });
    }
    cityBuildings.push({
      x: buildingX,
      y: currentY - buildingHeight,
      w: buildingWidth,
      h: buildingHeight,
      color: random(buildingColors),
      windows: windows
    });
  }

  // Lado direito da estrada na cidade - Gerando prédios
  for (let currentY = cidadeY + cityHeight - 50; currentY > cidadeY; currentY -= random(60, 120)) {
    let buildingWidth = random(40, 80);
    let buildingHeight = random(50, 200);
    let buildingX = random(width / 2 + estradaLargura / 2 + 10, width - buildingWidth);
    let windows = [];
    for (let j = 0; j < buildingHeight / 30; j++) {
      windows.push({
        x: buildingX + 5,
        y: currentY - buildingHeight + 5 + j * 30,
        w: buildingWidth - 10,
        h: 15
      });
    }
    cityBuildings.push({
      x: buildingX,
      y: currentY - buildingHeight,
      w: buildingWidth,
      h: buildingHeight,
      color: random(buildingColors),
      windows: windows
    });
  }

  // Adicionando as decorações da cidade à lista cityDecorations
  cityDecorations.push({ type: 'house', x: width / 2 - estradaLargura / 2 - 80, y: cidadeY + cityHeight - 100 });
  cityDecorations.push({ type: 'building_gray', x: width / 2 + estradaLargura / 2 + 20, y: cidadeY + cityHeight - 150 });
  cityDecorations.push({ type: 'park', x: width / 2 - estradaLargura / 2 - 100, y: cidadeY + cityHeight - 250, size: 50 });
  cityDecorations.push({ type: 'park', x: width / 2 + estradaLargura / 2 + 100, y: cidadeY + cityHeight - 300, size: 70 });
  cityDecorations.push({ type: 'car', x: width / 2 - 40, y: cidadeY + cityHeight - 50, color: color(255, 255, 0) });
  cityDecorations.push({ type: 'car', x: width / 2 + 20, y: cidadeY + cityHeight - 100, color: color(200, 0, 200) });
  cityDecorations.push({ type: 'car', x: width / 2 - 10, y: cidadeY + cityHeight - 150, color: color(0, 200, 200) });
}

// --- FUNÇÃO PARA DESENHAR OBSTÁCULOS (árvores e pedras) ---
function drawObstacles() {
  // Desenha as árvores
  for (let tree of trees) {
    // Desenha o tronco
    fill(100, 70, 40); // Marrom
    rect(tree.x - tree.size / 4, tree.y, tree.size / 2, tree.size * 0.8);
    // Desenha a folhagem
    fill(34, 139, 34); // Verde floresta
    ellipse(tree.x, tree.y - tree.size * 0.4, tree.size, tree.size);
  }

  // Desenha as pedras
  for (let rock of rocks) {
    fill(100, 100, 100); // Cinza
    ellipse(rock.x, rock.y, rock.size, rock.size * 0.8);
  }
}

// --- FUNÇÃO PARA DESENHAR APENAS A RUA DA CIDADE ---
function drawCityRoad(y) {
  const cityHeight = 500;
  const roadCenter = width / 2;
  const roadHalfWidth = estradaLargura / 2;

  fill(40); // Cor da rua da cidade (cinza mais escuro)
  rect(roadCenter - roadHalfWidth, y, estradaLargura, cityHeight); // Estrada na cidade

  // Postes da cidade foram removidos daqui para não aparecerem
}

// --- FUNÇÃO PARA DESENHAR APENAS OS PRÉDIOS E DECORAÇÕES DA CIDADE ---
function drawCityBuildingsAndDecorations(y) {
  const cityHeight = 500;
  const windowColor = color(255, 255, 150, 180);

  // Desenhar os prédios da cidade a partir do array cityBuildings
  for (let building of cityBuildings) {
    fill(building.color);
    rect(building.x, building.y, building.w, building.h);

    // Janelas
    fill(windowColor);
    for (let win of building.windows) {
      rect(win.x, win.y, win.w, win.h);
    }
  }

  // Desenhar as decorações da cidade a partir do array cityDecorations
  for (let deco of cityDecorations) {
    if (deco.type === 'house') {
      fill(200, 150, 100); // Cor de casa
      rect(deco.x, deco.y, 70, 70);
      fill(180, 130, 80);
      triangle(deco.x, deco.y, deco.x + 35, deco.y - 30, deco.x + 70, deco.y);
    } else if (deco.type === 'building_gray') {
      fill(100, 100, 100); // Outro prédio cinza
      rect(deco.x, deco.y, 60, 120);
    } else if (deco.type === 'park') {
      fill(0, 120, 0);
      ellipse(deco.x, deco.y, deco.size, deco.size);
    } else if (deco.type === 'car') {
      fill(deco.color);
      rect(deco.x, deco.y, 20, 10);
    }
  }
}