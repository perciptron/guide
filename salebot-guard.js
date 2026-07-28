/*!
 * salebot-guard.js v1 — страховка формы Salebot от пустой модалки.
 *
 * ЗАЧЕМ. Форма Salebot не лежит на нашей странице. FormIntegration.init тянет её
 * цепочкой из девяти последовательных запросов к четырём доменам:
 *
 *   salebot.pro/js/form_scripts.js
 *     -> ajax.googleapis.com/.../jquery.min.js
 *       -> salebot.pro/js/emojis.js
 *         -> cdnjs.cloudflare.com/.../jquery.easing.min.js
 *           -> salebot.pro/js/calendarCreator.js
 *             -> cdnjs.cloudflare.com/.../swiper.min.js
 *               -> cdnjs.cloudflare.com/.../swiper.min.css
 *                 -> salebot.pro/css/form_integration.css
 *                   -> XHR salebot.pro/projects/<id>/form_view/<guid>  <- сама форма
 *
 * Каждый следующий запрос стартует по onload предыдущего, и обработчиков ошибок
 * в коде Salebot нет вообще. Одно недошедшее звено (слабая мобильная связь,
 * блокировщик рекламы, DNS-фильтр, замедление CDN) останавливает цепочку
 * навсегда: блок формы остаётся пустым, человек видит пустую белую модалку и
 * уходит. Найдено 2026-07-28 на /mpk/ по скриншоту от клиента.
 *
 * ЧТО ДЕЛАЕТ. Показывает индикатор загрузки вместо пустоты, через 7 секунд
 * повторяет init, через 18 объясняет человеку что произошло и даёт кнопку
 * перезагрузки. Таймер тикает только пока блок реально виден на экране, поэтому
 * закрытые модалки и отложенные формы квизов не ловят ложную ошибку.
 *
 * ПОДКЛЮЧЕНИЕ. На каждом лендинге с формой Salebot, рядом с tg-intercept.js:
 *   <script src="/salebot-guard.js" defer></script>
 * Правки разметки не нужны, конфиг init скрипт находит сам.
 */
(function () {
  'use strict';

  var RETRY_AFTER = 7000;
  var FAIL_AFTER = 18000;
  var TICK = 400;
  var LOADER_URL = 'https://salebot.pro/js/form_scripts.js';

  var CSS =
    '.sb-guard{display:none;padding:1.25rem .5rem;text-align:center;font:inherit;color:inherit}' +
    '.sb-guard.is-visible{display:block}' +
    '.sb-guard__spinner{width:26px;height:26px;margin:0 auto .85rem;border:2.5px solid rgba(127,127,127,.25);' +
    'border-top-color:currentColor;border-radius:50%;animation:sbGuardSpin .8s linear infinite}' +
    '.sb-guard.is-error .sb-guard__spinner{display:none}' +
    '.sb-guard__text{font-size:.9rem;line-height:1.5;opacity:.85;margin:0}' +
    '.sb-guard__retry{margin-top:1rem;width:100%;padding:.8rem 1.5rem;background:transparent;color:inherit;' +
    'border:1.5px solid currentColor;border-radius:12px;font:inherit;font-size:.95rem;cursor:pointer;opacity:.85}' +
    '.sb-guard__retry:hover{opacity:1}' +
    '@keyframes sbGuardSpin{to{transform:rotate(360deg)}}';

  function injectCss() {
    if (document.getElementById('sb-guard-css')) return;
    var s = document.createElement('style');
    s.id = 'sb-guard-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* Конфиг init берём из инлайн-скрипта страницы, чтобы не дублировать guid руками.
     Три формы записи: литерал прямо в init (гайды), обратный порядок ключей,
     объект product у квизов, где в init уходят уже переменные. */
  function findConfig() {
    var direct = [
      /FormIntegration\.init\(\s*\{[^}]*project_id\s*:\s*(\d+)[^}]*guid\s*:\s*['"]([^'"]+)['"]/,
      /FormIntegration\.init\(\s*\{[^}]*guid\s*:\s*['"]([^'"]+)['"][^}]*project_id\s*:\s*(\d+)/
    ];
    var loose = [
      /\{\s*project_id\s*:\s*(\d+)\s*,\s*guid\s*:\s*['"]([^'"]+)['"]/,
      /\{\s*guid\s*:\s*['"]([^'"]+)['"]\s*,\s*project_id\s*:\s*(\d+)/
    ];
    var scripts = document.getElementsByTagName('script');
    var i, code, m;

    for (i = 0; i < scripts.length; i++) {
      if (scripts[i].src) continue;
      code = scripts[i].textContent || '';
      m = direct[0].exec(code);
      if (m) return { project_id: parseInt(m[1], 10), guid: m[2] };
      m = direct[1].exec(code);
      if (m) return { project_id: parseInt(m[2], 10), guid: m[1] };
    }
    for (i = 0; i < scripts.length; i++) {
      if (scripts[i].src) continue;
      code = scripts[i].textContent || '';
      m = loose[0].exec(code);
      if (m) return { project_id: parseInt(m[1], 10), guid: m[2] };
      m = loose[1].exec(code);
      if (m) return { project_id: parseInt(m[2], 10), guid: m[1] };
    }
    return null;
  }

  /* Форма отрисовалась, когда внутри блока появились живые поля или кнопки */
  function isReady(box) {
    return !!box.querySelector('input, textarea, select, button, .salebot_button');
  }

  function isVisible(el) {
    if (el.checkVisibility) {
      try { return el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true }); } catch (e) {}
    }
    if (!el.offsetParent) return false;
    for (var n = el; n && n !== document.body; n = n.parentElement) {
      var cs = window.getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    }
    return true;
  }

  function makeState(box) {
    var wrap = document.createElement('div');
    wrap.className = 'sb-guard';
    wrap.innerHTML = '<div class="sb-guard__spinner"></div><p class="sb-guard__text">Загружаем форму.</p>';
    box.parentNode.insertBefore(wrap, box);
    return wrap;
  }

  /* Лендинги бывают светлые и тёмные, а форма иногда лежит в белой карточке
     на тёмной странице. Наследовать цвет текста нельзя, ищем реальный фон
     под блоком и берём контрастный к нему цвет. */
  function realBackground(el) {
    for (var n = el; n; n = n.parentElement) {
      var m = /rgba?\(([^)]+)\)/.exec(window.getComputedStyle(n).backgroundColor);
      if (!m) continue;
      var p = m[1].split(',').map(parseFloat);
      if (p.length < 4 || p[3] > 0.5) return p;
    }
    return [255, 255, 255];
  }

  function applyContrast(state) {
    var bg = realBackground(state);
    var light = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2] >= 128;
    state.style.color = light ? '#14171a' : '#f2f2f2';
  }

  /* Повторная попытка. Счётчик внутри Salebot после первого init уходит на
     следующий .form_integration_block, поэтому единственному блоку проставляем
     id: по нему их код находит тот же самый элемент. */
  function retry(box, single) {
    var cfg = findConfig();
    if (!cfg) return;
    if (single && !box.id) box.id = 'form_integration_block';
    if (window.FormIntegration) {
      try { window.FormIntegration.init(cfg); } catch (e) {}
      return;
    }
    var s = document.createElement('script');
    s.src = LOADER_URL;
    s.onload = function () {
      try { window.FormIntegration.init(cfg); } catch (e) {}
    };
    document.head.appendChild(s);
  }

  function fail(state) {
    state.classList.add('is-error');
    var text = state.querySelector('.sb-guard__text');
    text.textContent = 'Форма не загрузилась. Обычно мешает медленный интернет или блокировщик рекламы.';
    if (state.querySelector('.sb-guard__retry')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sb-guard__retry';
    btn.textContent = 'Попробовать снова';
    btn.onclick = function () { window.location.reload(); };
    state.appendChild(btn);
  }

  function watch(box, single) {
    var state = makeState(box);
    var text = state.querySelector('.sb-guard__text');
    var shownAt = 0;
    var retried = false;

    var timer = setInterval(function () {
      if (isReady(box)) {
        clearInterval(timer);
        state.classList.remove('is-visible');
        return;
      }
      /* Пока блок скрыт (закрытая модалка, ещё не пройденный квиз) время не идёт */
      if (!isVisible(box)) {
        shownAt = 0;
        state.classList.remove('is-visible');
        return;
      }
      if (!shownAt) {
        shownAt = Date.now();
        applyContrast(state);
      }
      state.classList.add('is-visible');

      var passed = Date.now() - shownAt;
      if (!retried && passed > RETRY_AFTER) {
        retried = true;
        text.textContent = 'Соединение медленное, пробуем ещё раз.';
        retry(box, single);
      }
      if (passed > FAIL_AFTER) {
        clearInterval(timer);
        fail(state);
      }
    }, TICK);
  }

  function boot() {
    if (window.__sbGuardStarted) return;
    window.__sbGuardStarted = true;
    var blocks = document.querySelectorAll('.form_integration_block, #form_integration_block');
    if (!blocks.length) return;
    injectCss();
    for (var i = 0; i < blocks.length; i++) watch(blocks[i], blocks.length === 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
