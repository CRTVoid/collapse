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
  initYandexSDK();
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
