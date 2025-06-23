document.addEventListener("DOMContentLoaded", function () {
  // Темная тема переключатель
  const toggle = document.getElementById("toggleSwitch");
  if (toggle) {
    toggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      document.documentElement.classList.toggle("dark-mode");
    });
  }
  // 👇 Добавляем инициализацию SDK
//  initYandexSDK();
});

document.addEventListener("DOMContentLoaded", function () {
  const newGameButton = document.getElementById("newGame");

  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      showAdThenStartGame();
    });
  }
});


 ///Завершение игры — отображение результата
function showGameOver(score) {
  document.getElementById("final-score").textContent = score;
  document.getElementById("overlay").style.display = "block";
  document.getElementById("gameover-popup").style.display = "flex";

  updateVkShareLink(score);
  updateWaShareLink(score);
}

// Перезапуск игры (без рекламы)
function restartGame() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("gameover-popup").style.display = "none";
  init(); // старт новой игры
}

// Тестовая кнопка завершения игры
document.getElementById("force-end").addEventListener("click", () => {
  showGameOver(score);
});

window.addEventListener("resize", resizeBoard);
document.addEventListener("DOMContentLoaded", () => {
  resizeBoard();
});

function resizeBoard() {
  const board = document.querySelector(".board");
  const screenWidth = window.innerWidth;

  // Максимальная ширина board — 320px
  const boardWidth = Math.min(screenWidth * 0.9, 320);
  const cellSize = boardWidth / 10; // 10 столбцов

  board.style.width = boardWidth + "px";
  board.style.height = cellSize * 13 + "px"; // 13 строк

  // Обновляем размер шариков (если они есть)
  const cells = board.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.style.width = cellSize + "px";
    cell.style.height = cellSize + "px";
  });

  // Обновим также размер шкалы очков, если нужно
  const scoreWrapper = document.querySelector(".score-wrapper");
  if (scoreWrapper) {
    scoreWrapper.style.width = boardWidth + "px";
  }
}

//const soundPool = Array.from({ length: 4 }, () => {
//  const audio = new Audio("sounds/click1.wav");
//  audio.preload = "auto";
//  return audio;
//});
//
//function playBreakSound() {
//  const sound = document.getElementById('break-sound');
//  if (sound) {
//    sound.currentTime = 0;
//    sound.play().catch(() => {}); // игнор ошибок
//  }
//}
//
//function vibrate() {
//  if (navigator.vibrate) {
//    navigator.vibrate(80);
//  }
//}

// Сброс затемнения кнопок и pointer-events

