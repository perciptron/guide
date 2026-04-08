/**
 * TG Link Interceptor v4
 * Перехватывает $.ajax ответы от Salebot и подменяет t.me на tg:// deep link
 *
 * Подключить: <script src="/tg-intercept.js"></script>
 */
(function() {
  var VER = 'v4';
  var PROXY = 'https://guides.fin-ra.pro/tg/';

  function rewrite(url) {
    if (!url || typeof url !== 'string') return null;
    var m = url.match(/https?:\/\/t\.me\/(.+)/);
    return m ? PROXY + m[1] : null;
  }

  function rewriteInText(text) {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/https?:\/\/t\.me\/([\w\d_?=&%+.-]+)/g, function(match, path) {
      return PROXY + path;
    });
  }

  // 1. Подмена <a href="t.me/...">
  function fixLinks() {
    document.querySelectorAll('a[href*="t.me/"]').forEach(function(a) {
      var r = rewrite(a.href);
      if (r) a.href = r;
    });
  }

  function initObserver() {
    fixLinks();
    new MutationObserver(fixLinks).observe(document.body, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['href']
    });
  }

  if (document.body) initObserver();
  else document.addEventListener('DOMContentLoaded', initObserver);

  // 2. Перехват window.open
  var _open = window.open;
  window.open = function(url) {
    return _open.apply(window, [rewrite(url) || url].concat([].slice.call(arguments, 1)));
  };

  // 3. Перехват jQuery $.ajax — ключевой метод для Salebot
  function wrapJqueryAjax() {
    if (!window.jQuery && !window.$) return false;
    var jq = window.jQuery || window.$;
    if (!jq.ajax || jq._tgAjaxWrapped) return true;

    var origAjax = jq.ajax;
    jq.ajax = function(settings) {
      if (!settings) return origAjax.apply(this, arguments);

      // Если это объект настроек
      var opts = typeof settings === 'string' ? arguments[1] || {} : settings;
      var origSuccess = opts.success;
      var origComplete = opts.complete;

      // Перехватываем success
      opts.success = function(data, status, xhr) {
        // Подменяем t.me в ответе
        if (typeof data === 'string') {
          data = rewriteInText(data);
        } else if (data && typeof data === 'object') {
          // Рекурсивно ищем t.me в свойствах объекта
          var json = JSON.stringify(data);
          var rewritten = rewriteInText(json);
          if (rewritten !== json) {
            try { data = JSON.parse(rewritten); } catch(e) {}
          }
        }
        if (origSuccess) return origSuccess.call(this, data, status, xhr);
      };

      if (typeof settings === 'string') {
        arguments[1] = opts;
        return origAjax.apply(this, arguments);
      }
      return origAjax.call(this, opts);
    };

    jq._tgAjaxWrapped = true;
    return true;
  }

  // 4. Перехват window.location.href через polling
  var lastUrl = window.location.href;
  setInterval(function() {
    var cur = window.location.href;
    if (cur !== lastUrl) {
      var r = rewrite(cur);
      if (r) {
        lastUrl = r;
        window.location.replace(r);
        return;
      }
      lastUrl = cur;
    }
  }, 30);

  // Ждём jQuery
  var jqCheck = setInterval(function() {
    if (wrapJqueryAjax()) clearInterval(jqCheck);
  }, 100);
  setTimeout(function() { clearInterval(jqCheck); }, 30000);

  // Version stamp
  document.addEventListener('DOMContentLoaded', function() {
    var f = document.querySelector('.footer, footer');
    if (f && f.textContent.indexOf(VER) === -1) {
      f.innerHTML = f.innerHTML.replace('FIN-RA', 'FIN-RA ' + VER);
    }
  });
})();

