document.addEventListener("DOMContentLoaded", function () {
  // Темная тема переключатель
  const toggle = document.getElementById("toggleSwitch");
  if (toggle) {
    toggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      document.documentElement.classList.toggle("dark-mode");
    });
  }

  const newGameButton = document.getElementById("newGame");
  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      YandexSDK.showAd();
    });
  }

  const forceEndButton = document.getElementById("force-end");
  if (forceEndButton) {
    forceEndButton.addEventListener("click", () => {
      showGameOver(score);
    });
  }
});

window.addEventListener("load", () => {
  YandexSDK.init().then(() => {
    console.log("[Main] SDK инициализирован. Показываем рекламу при старте...");
    YandexSDK.showAd();
  });
});

/// Завершение игры — отображение результата
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

// 🚀 Глобальная функция запуска новой игры, вызывается из YandexSDK
function startNewGame() {
  console.log("[Main] Запуск новой игры...");
  init();
}
