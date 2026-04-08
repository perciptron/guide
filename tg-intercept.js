/**
 * TG Link Interceptor v3
 * Перехватывает Salebot-редиректы на t.me через обёртку formCreateHref
 * + подмена <a> href + window.open + navigation events
 *
 * Подключить: <script src="/tg-intercept.js"></script> (до salebot скрипта или defer)
 */
(function() {
  var PROXY = 'https://guides.fin-ra.pro/tg/';

  function rewrite(url) {
    if (!url || typeof url !== 'string') return null;
    var m = url.match(/https?:\/\/t\.me\/(.+)/);
    return m ? PROXY + m[1] : null;
  }

  // 1. Подмена <a href="t.me/...">
  function fixLinks() {
    document.querySelectorAll('a[href*="t.me/"]').forEach(function(a) {
      var r = rewrite(a.href);
      if (r) a.href = r;
    });
  }

  if (document.body) {
    fixLinks();
    new MutationObserver(fixLinks).observe(document.body, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['href']
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      fixLinks();
      new MutationObserver(fixLinks).observe(document.body, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['href']
      });
    });
  }

  // 2. Перехват window.open
  var _open = window.open;
  window.open = function(url) {
    return _open.apply(window, [rewrite(url) || url].concat([].slice.call(arguments, 1)));
  };

  // 3. Обёртка formCreateHref (Salebot) — ждём пока функция появится
  function wrapSalebot() {
    if (typeof window.formCreateHref !== 'function') return;
    if (window._tgWrapped) return;
    window._tgWrapped = true;

    var orig = window.formCreateHref;
    window.formCreateHref = function() {
      // Перед вызовом оригинала — подменяем data-url на всех кнопках
      document.querySelectorAll('.salebot_button[data-url*="t.me"]').forEach(function(btn) {
        var r = rewrite(btn.getAttribute('data-url'));
        if (r) btn.setAttribute('data-url', r);
      });
      return orig.apply(this, arguments);
    };
  }

  // Проверяем каждые 200ms пока formCreateHref не появится
  var checkInterval = setInterval(function() {
    wrapSalebot();
    if (window._tgWrapped) clearInterval(checkInterval);
  }, 200);
  setTimeout(function() { clearInterval(checkInterval); }, 30000); // стоп через 30 сек

  // 4. Перехват navigation events
  window.addEventListener('beforeunload', function() {}, false);

  // Навигация через location — перехватываем через defineProperty на document
  var desc = Object.getOwnPropertyDescriptor(window, 'location');
  // Не можем переопределить location напрямую — используем polling
  var lastUrl = '';
  setInterval(function() {
    var current = window.location.href;
    if (current !== lastUrl) {
      lastUrl = current;
      var r = rewrite(current);
      if (r) {
        lastUrl = r;
        window.location.replace(r);
      }
    }
  }, 50);
})();

