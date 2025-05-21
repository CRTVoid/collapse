document.addEventListener("DOMContentLoaded", function() {
  // Темная тема переключатель
  const toggle = document.getElementById("toggleSwitch");
  toggle.addEventListener("change", function() {
    document.body.classList.toggle("dark-mode");
    document.documentElement.classList.toggle("dark-mode");
  });

  // Запускаем инициализацию SDK
  initYandexSDK();

  // Кнопка "Новая игра"
  const newGameButton = document.getElementById("newGame");
  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      showAdThenStartGame();
    });
  }
});

// Глобальные переменные для SDK
let ysdk = null;
let sdkReady = false;

// Инициализация Yandex SDK
aasync function initYandexSDK() {
  if (window.YaGames) {
    try {
      ysdk = await YaGames.init();
      sdkReady = true;

      const lang = ysdk.environment.i18n.lang || 'en';
      console.log('🌐 Язык пользователя:', lang);

      console.log('✅ Yandex SDK инициализирован');
      ysdk.features?.LoadingAPI?.ready(); // сигнал платформе, что игра готова
    } catch (e) {
      console.error('❌ Ошибка инициализации Yandex SDK:', e);
    }
  } else {
    console.warn('❗ YaGames SDK не найден');
  }
}
// Показываем рекламу и запускаем игру после неё
async function showAdThenStartGame() {
  if (ysdk && ysdk.adv) {
    try {
      await ysdk.adv.showFullscreenAdv({
        callbacks: {
          onOpen: () => console.log('[YandexSDK] Реклама открыта'),
          onClose: (wasShown) => {
            console.log('[YandexSDK] Реклама закрыта. Показана полностью:', wasShown);
            init(); // запускаем игру
          },
          onError: (err) => {
            console.warn('[YandexSDK] Ошибка рекламы:', err);
            init(); // fallback
          }
        }
      });
    } catch (e) {
      console.warn('[YandexSDK] Ошибка показа рекламы:', e);
      init(); // fallback
    }
  } else {
    init(); // fallback
  }
}

// Завершение игры — отображение результата
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
