const translations = {
  ru: {
    title: "Как играть",
    line1: "Нажмите на группу кубиков одного цвета, чтобы удалить их с поля.",
    line2: "Чем больше группа, тем больше очков:",
    points: [
      "2 кубика — 2 очка",
      "3 — 6 очков",
      "4 — 12 очков",
      "5 — 20 очков",
      "6+ — по формуле: N × (N - 1)"
    ],
    button: "Понятно",
    pageTitle: "Коллапс - Цветная головоломка",
    newGameTitle: "Новая игра",
    helpButtonTitle: "Справка",
    changeColorButtonTitle: "Сменить оформление",
    dropBlockBtnTitle: "Сбросить 7 случайных кубиков",
    repaintBtnTitle: "Перекрасить одиночный кубик в случайный цвет",
    scoreLabel: "Счёт",
    gameOverTitle: "Конец игры",
    playAgainButton: "Новая игра",
    splashLogoTitle: "КОЛЛАПС",
    feature1: "Сбрасывает вниз семь случайных кубиков",
    feature2: "Перекрашивает одиночный кубик в случайный цвет"
  },
  en: {
    title: "How to Play",
    line1: "Click on a group of bricks of the same color to remove them from the board.",
    line2: "The larger the group, the more points you earn:",
    points: [
      "2 bricks — 2 points",
      "3 — 6 points",
      "4 — 12 points",
      "5 — 20 points",
      "6+ — by the formula: N × (N - 1)"
    ],
    button: "Got it",
    pageTitle: "Collapse - Color puzzle",
    newGameTitle: "New game",
    helpButtonTitle: "Help",
    changeColorButtonTitle: "Change color theme",
    dropBlockBtnTitle: "Drop 7 random blocks",
    repaintBtnTitle: "Recolor a single block to a random color",
    scoreLabel: "Score",
    gameOverTitle: "Game over",
    playAgainButton: "New game",
    splashLogoTitle: "COLLAPSE",
    feature1: "Drops seven random cubes down",
    feature2: "Repaints a single cube to a random color"
  }
};

let currentLang = 'en'; // язык по умолчанию

function t(key) {
  return translations[currentLang]?.[key] ?? key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = t(key);
    const attr = el.dataset.i18nAttr;

    if (!value) return;

    if (attr) {
      el.setAttribute(attr, value);
    } else if (Array.isArray(value)) {
      el.innerHTML = value.map(item => `<li>${item}</li>`).join('');
    } else {
      el.textContent = value;
    }
  });

  document.title = t('pageTitle');
}

// Инициализация SDK и языка
YaGames.init().then(ysdk => {
  const sdkLang = ysdk.environment.i18n.lang;
  currentLang = translations[sdkLang] ? sdkLang : 'en';
  applyTranslations();
});
