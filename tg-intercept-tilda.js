/**
 * TG Link Interceptor for Tilda v1
 *
 * Перехватывает все переходы на t.me и подменяет на промежуточную страницу
 * guides.fin-ra.pro/tg/ — которая открывает Telegram через deep link (tg://)
 *
 * Установка в Tilda:
 *   Настройки сайта → Ещё → HTML-код для вставки внутрь HEAD
 *   ИЛИ
 *   Настройки сайта → Ещё → HTML-код для вставки перед </body>
 *
 *   Вставить: <script src="https://guides.fin-ra.pro/tg-intercept-tilda.js"></script>
 *
 *   Или скопировать содержимое целиком в <script>...</script>
 */
(function() {
  var PROXY = 'https://guides.fin-ra.pro/tg/';

  function rewrite(url) {
    if (!url || typeof url !== 'string') return null;
    var m = url.match(/https?:\/\/t\.me\/(.+)/);
    return m ? PROXY + m[1] : null;
  }

  function rewriteInText(text) {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/https?:\/\/t\.me\/([\w\d_?=&%+.\/-]+)/g, function(match, path) {
      return PROXY + path;
    });
  }

  // 1. Подмена <a href="t.me/..."> — ловит ссылки Tilda и Salebot
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

  // 2. Перехват window.open (Tilda иногда открывает ссылки через window.open)
  var _open = window.open;
  window.open = function(url) {
    return _open.apply(window, [rewrite(url) || url].concat([].slice.call(arguments, 1)));
  };

  // 3. Перехват jQuery $.ajax — для Salebot-форм встроенных в Tilda
  function wrapJqueryAjax() {
    if (!window.jQuery && !window.$) return false;
    var jq = window.jQuery || window.$;
    if (!jq.ajax || jq._tgAjaxWrapped) return true;

    var origAjax = jq.ajax;
    jq.ajax = function(settings) {
      if (!settings) return origAjax.apply(this, arguments);

      var opts = typeof settings === 'string' ? arguments[1] || {} : settings;
      var origSuccess = opts.success;

      opts.success = function(data, status, xhr) {
        if (typeof data === 'string') {
          data = rewriteInText(data);
        } else if (data && typeof data === 'object') {
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

  // 4. Перехват fetch — Tilda может использовать fetch вместо jQuery
  var _fetch = window.fetch;
  if (_fetch) {
    window.fetch = function(input, init) {
      return _fetch.apply(window, arguments).then(function(response) {
        var ct = response.headers.get('content-type') || '';
        if (ct.indexOf('json') !== -1 || ct.indexOf('text') !== -1) {
          return response.clone().text().then(function(text) {
            var rewritten = rewriteInText(text);
            if (rewritten !== text) {
              return new Response(rewritten, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
              });
            }
            return response;
          });
        }
        return response;
      });
    };
  }

  // 5. Перехват location.href через polling
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

  // 6. Перехват click по ссылкам (на случай динамически созданных)
  document.addEventListener('click', function(e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var r = rewrite(a.href);
    if (r) {
      e.preventDefault();
      window.location.href = r;
    }
  }, true);

  // Ждём jQuery (Tilda загружает его асинхронно)
  var jqCheck = setInterval(function() {
    if (wrapJqueryAjax()) clearInterval(jqCheck);
  }, 100);
  setTimeout(function() { clearInterval(jqCheck); }, 30000);
})();
