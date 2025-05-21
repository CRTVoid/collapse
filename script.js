document.addEventListener("DOMContentLoaded", function() {
  // Темная тема переключатель
  const toggle = document.getElementById("toggleSwitch");
if (toggle) {
  toggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode");
    document.documentElement.classList.toggle("dark-mode");
  });
}


  // Запускаем инициализацию SDK
  initYandexSDK();

  // Кнопка "Новая игра"
  const newGameButton = document.getElementById("newGame");
  if (newGameButton) {
    newGameButton.addEventListener("click", () => {
      showAdThenStartGame();
    });
  }

  // Тестовая кнопка завершения игры
  const forceEnd = document.getElementById("force-end");
  if (forceEnd) {
    forceEnd.addEventListener("click", () => {
      showGameOver(score);
    });
  }
});

let ysdk = null;
let sdkReady = false;
let userLang = 'en';

// Таблица локализации
const i18n = {
  en: {
    title: "Collapse",
    newGame: "New Game",
    gameOver: "Game Over",
    finalScore: "Your score:",
  },
  ru: {
    title: "Коллапс",
    newGame: "Новая игра",
    gameOver: "Игра окончена",
    finalScore: "Ваш счёт:",
  }
};

// Устанавливает текст на основе языка
function applyLocalization(lang) {
  const dict = i18n[lang] || i18n.en;
  const el = (id) => document.getElementById(id);

  if (el("title")) el("title").textContent = dict.title;
  if (el("newGame")) el("newGame").textContent = dict.newGame;
  if (el("gameover-title")) el("gameover-title").textContent = dict.gameOver;
  if (el("final-score-label")) el("final-score-label").textContent = dict.finalScore;
}

// Инициализация Yandex SDK
async function initYandexSDK() {
  if (window.YaGames) {
    try {
      ysdk = await YaGames.init();
      sdkReady = true;

      // Определение языка
      userLang = ysdk.environment.i18n.lang || 'en';
      console.log(`✅ Yandex SDK инициализирован. Язык: ${userLang}`);

      // Применение локализации
      applyLocalization(userLang);

      // Готовность игры
      ysdk.features?.LoadingAPI?.ready();
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
