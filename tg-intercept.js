/**
 * TG Link Interceptor v2
 * Перехватывает ВСЕ способы перехода на t.me:
 * 1. <a href="t.me/..."> — подмена href
 * 2. window.open("t.me/...") — перехват
 * 3. window.location = "t.me/..." — перехват
 * 4. Клики по элементам с onclick содержащим t.me — перехват
 *
 * Подключить: <script src="/tg-intercept.js" defer></script>
 */
(function() {
  var BASE = 'https://guides.fin-ra.pro/tg/';

  function rewriteUrl(url) {
    if (!url || typeof url !== 'string') return null;
    var match = url.match(/^https?:\/\/t\.me\/([^\s]+)/);
    if (match) return BASE + match[1];
    return null;
  }

  // 1. Rewrite <a> href attributes
  function processLinks() {
    document.querySelectorAll('a[href*="t.me/"]').forEach(function(a) {
      var newHref = rewriteUrl(a.href);
      if (newHref) a.href = newHref;
    });
  }

  processLinks();

  new MutationObserver(processLinks).observe(document.body, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['href']
  });

  // 2. Intercept window.open
  var origOpen = window.open;
  window.open = function(url, target, features) {
    var rewritten = rewriteUrl(url);
    return origOpen.call(window, rewritten || url, target, features);
  };

  // 3. Intercept clicks that navigate to t.me
  document.addEventListener('click', function(e) {
    var el = e.target.closest('a, button, [onclick]');
    if (!el) return;

    // Check href
    if (el.href) {
      var newHref = rewriteUrl(el.href);
      if (newHref) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = newHref;
        return;
      }
    }
  }, true);

  // 4. Intercept form submissions / redirects via location
  var locationProxy = new Proxy(window.location, {});
  // Can't proxy location directly, so poll for changes
  var lastHref = window.location.href;
  setInterval(function() {
    if (window.location.href !== lastHref) {
      lastHref = window.location.href;
      var rewritten = rewriteUrl(lastHref);
      if (rewritten) window.location.replace(rewritten);
    }
  }, 100);

  // 5. Intercept location.assign and location.replace
  var origAssign = window.location.assign.bind(window.location);
  var origReplace = window.location.replace.bind(window.location);

  try {
    Object.defineProperty(window.location, 'assign', {
      value: function(url) { origAssign(rewriteUrl(url) || url); }
    });
    Object.defineProperty(window.location, 'replace', {
      value: function(url) { origReplace(rewriteUrl(url) || url); }
    });
  } catch(e) {
    // Some browsers don't allow overriding location methods
  }
})();

