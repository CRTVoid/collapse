window.YandexSDK = (function() {
  let ysdk = null;
  let isReadyCalled = false;

  // 1. Загрузка SDK через callback (самый быстрый способ)
  function loadSDK() {
    return new Promise((resolve) => {
      if (window.YaGames) {
        YaGames.init()
          .then(sdk => {
            ysdk = sdk;
            callReady(); // Важно: сразу после получения SDK
            resolve(true);
          })
          .catch(err => {
            console.error('[YandexSDK] Init error:', err);
            resolve(false);
          });
      } else {
        console.warn('[YandexSDK] YaGames not found');
        resolve(false);
      }
    });
  }

  // 2. Мгновенный вызов ready
  function callReady() {
    if (!isReadyCalled && ysdk?.features?.LoadingAPI) {
      ysdk.features.LoadingAPI.ready();
      isReadyCalled = true;
      console.log('[YandexSDK] READY called at:', performance.now(), 'ms');
    }
  }

  return {
    init: loadSDK,
    isReady: () => isReadyCalled
  };
})();

// 3. Автоматическая загрузка
(function() {
  const startTime = performance.now();
  YandexSDK.init().then(() => {
    console.log('[YandexSDK] Full init time:', performance.now() - startTime, 'ms');
  });
})();