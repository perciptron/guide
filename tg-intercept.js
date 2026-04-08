/**
 * TG Link Interceptor
 * Подменяет все ссылки t.me на guides.fin-ra.pro/tg/ для обхода блокировки
 * Подключить: <script src="/tg-intercept.js" defer></script>
 */
(function() {
  var BASE = 'https://guides.fin-ra.pro/tg/';

  function rewriteLink(href) {
    // https://t.me/botname?start=xxx → https://guides.fin-ra.pro/tg/botname?start=xxx
    var match = href.match(/^https?:\/\/t\.me\/([^\s]+)/);
    if (match) return BASE + match[1];
    return null;
  }

  function processLinks() {
    document.querySelectorAll('a[href*="t.me/"]').forEach(function(a) {
      var newHref = rewriteLink(a.href);
      if (newHref) a.href = newHref;
    });
  }

  // Process existing links
  processLinks();

  // Watch for dynamically added links (Salebot injects them)
  var observer = new MutationObserver(function() {
    processLinks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
})();
