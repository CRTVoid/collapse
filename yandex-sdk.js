// yandex-sdk.js
window.YandexSDK = (function () {
  let ysdk = null;
  let player = null;
  let lang = 'en';

  async function init() {
    if (window.YaGames) {
      try {
        ysdk = await YaGames.init();
        lang = ysdk.environment.i18n.lang || 'en';
        ysdk.features.LoadingAPI?.ready();
        console.log('[YandexSDK] SDK инициализирован. Язык:', lang);
        return true;
      } catch (err) {
        console.error('[YandexSDK] Ошибка инициализации:', err);
        return false;
      }
    } else {
      console.warn('[YandexSDK] YaGames не найден');
      return false;
    }
  }

  async function initPlayer() {
    if (!ysdk) return;

    try {
      player = await ysdk.getPlayer();
      console.log('[YandexSDK] Игрок:', player.getName(), player.getUniqueID());
      return player;
    } catch (err) {
      console.warn('[YandexSDK] Не удалось получить игрока:', err);
    }
  }

  async function getSaveData() {
    if (player) {
      try {
        return await player.getData();
      } catch (e) {
        console.warn('[YandexSDK] Ошибка получения данных:', e);
        return {};
      }
    }
    return {};
  }

  async function saveData(data) {
    if (player) {
      try {
        await player.setData(data);
        console.log('[YandexSDK] Данные сохранены');
      } catch (e) {
        console.warn('[YandexSDK] Ошибка сохранения:', e);
      }
    }
  }

  async function showAd() {
    if (ysdk && ysdk.adv) {
      try {
        await ysdk.adv.showFullscreenAdv({
          callbacks: {
            onOpen: () => console.log('[YandexSDK] Реклама открыта'),
            onClose: (wasShown) => {
              console.log('[YandexSDK] Реклама закрыта. Показана полностью:', wasShown);
              // Запускаем новую игру после рекламы
              startNewGame();
            },
            onError: (err) => {
              console.warn('[YandexSDK] Ошибка рекламы:', err);
              // Даже при ошибке запускаем игру
              startNewGame();
            }
          }
        });
      } catch (e) {
        console.warn('[YandexSDK] Ошибка показа рекламы:', e);
        startNewGame(); // fallback
      }
    } else {
      startNewGame(); // fallback
    }
  }

  function getLanguage() {
    return lang;
  }

  return {
    init,
    initPlayer,
    getLanguage,
    getSaveData,
    saveData,
    showAd
  };
})();
