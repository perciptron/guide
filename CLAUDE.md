# FIN-RA Guides — Лендинги для сбора лидов

## О проекте

Платформа лендингов инвестиционной школы **FIN-RA**. Каждый лендинг — отдельная страница с PDF-гайдом или записью на обучение. Лиды собираются через Telegram-бота (Salebot.pro).

**Домен:** https://guides.fin-ra.pro
**Хостинг:** GitHub Pages, деплой автоматически при пуше в main
**Репозиторий:** https://github.com/perciptron/guide

## Структура

```
/                     → редирект на https://fin-ra.ru/
/0226/                → [активен] Гайд "Облигации с ежемесячным купоном 2026" (36 стр., старая версия)
/0326/                → [активен] Гайд "ТОП-30 ОФЗ" (19 стр., 6 категорий)
/0526/                → [активен/ЭТАЛОН] Гайд "Облигации с ежемесячным купоном 2026" (36 стр.)
/0326max/             → дубль 0326 (для A/B или отдельного трафика)
/0426/                → [активен] Гайд "ИИ для инвестора" (43 стр., промпты для ChatGPT)
/dividends/           → [активен] Гайд "ТОП дивидендных акций 2026" (17 стр.)
/invest-salary/       → [активен] Запись на предобучение "Инвест-зарплата" (старый)
/invest-salary-2026/  → [активен] Запись на предобучение "Инвест-зарплата" (новый, mobile-first, с таймером/бонусами)
/isalary/             → [активен] Лендинг "Инвест-зарплата" (длинный, строго по ТЗ: 11 экранов, 4 эксперта, видеоотзывы; без таймера/дат/бонусов)
/mpk/                 → [активен] Регистрация на бесплатный практикум «Моя первая крипта» (старт 13 августа, one-screen по эталону 0526)
/anketa/              → [активен] Анкета предзаписи в закрытый канал (тёмная тема, золотой акцент)
/quiz-money/          → [активен] Квиз "Где вы теряете деньги прямо сейчас?" (7 вопросов, score-based, ИЗ + ФП)
/quiz-defense/        → [активен] Квиз "Насколько защищены ваши деньги?" (8 вопросов, score-based, ИЗ + ФП)
/quiz-investor/       → [активен] Квиз "Какой вы инвестор: Баффет / Гейтс / Маск / Кийосаки / Трамп?" (типология, ведёт на ИЗ)
/thoughts/            → спеки и планирование (Salebot, n8n, агенты)
```

## Стек

- **HTML/CSS/JS** — всё inline, без фреймворков и сборщиков
- **Google Fonts** — Outfit (заголовки), DM Sans (текст), Bricolage Grotesque (invest-salary)
- **Salebot.pro** — формы сбора лидов (FormIntegration API, project ID: 354621)
- **GitHub Pages** — хостинг через CNAME

## Эталонный шаблон для гайдов — Premium-минимализм (0526)

Все новые лендинги гайдов создавать на основе `/0526/index.html`.

### Визуальный стиль
- **Философия:** Premium-минимализм — single product-card, бумажный фон, премиум-тени
- **Фон:** тёплый `#ece9e1` (бумага), без паттернов, grain, glassmorphism
- **Контент в одной карточке** `--paper #fbfaf6` с `border-radius: 24px` и многоуровневыми тенями
- **Никаких:** dot grid, grain overlay, ambient blobs, backdrop-filter, стеклянных эффектов

### Палитра
| Переменная | Значение | Назначение |
|-----------|----------|------------|
| `--green` | `#0f9d58` | Акцентный (CTA arrow, чекмарки, free-badge) |
| `--green-tint` | `rgba(15,157,88,0.08)` | Фон чекмарков буллетов |
| `--bg` | `#ece9e1` | Тёплый бумажный фон страницы |
| `--paper` | `#fbfaf6` | Фон product-card |
| `--ink` | `#14171a` | Основной текст и CTA |
| `--text-mid` | `#5a5f66` | Вторичный текст |
| `--text-muted` | `#8c8f94` | Третичный текст (meta-row) |
| `--hairline` | `rgba(20,23,26,0.08)` | Тонкие линии между секциями |

### Типография
- **Display:** Outfit, weight 500, `letter-spacing: -0.04em`, `line-height: 1.06` (НЕ 800!)
- **Body:** DM Sans, weight 400-500
- **Технические метки:** JetBrains Mono, weight 500, uppercase, `letter-spacing: 0.06em`
- **Акцент** в заголовке — отдельное слово через `<span class="accent">` с `color: var(--green)`

### Анимации
- **cardRise** — entrance, 0.9s cubic-bezier, появление карточки снизу
- **coverFloat** — обложка парит ±10px и rotateX 1.5° каждые 7 сек
- **glowPulse** — мягкий зелёный glow внизу cover-panel, 6 сек
- **badgePop** — отскок free-badge при загрузке (cubic-bezier(.34,1.56,.64,1))
- **dotPulse** — белая точка в free-badge пульсирует
- **3D parallax** — JS отслеживает mousemove на cover-panel, обложка наклоняется ±6°/5°. Только desktop, `(hover: none)` отключает

### Структура — single product-card

Вместо двух колонок hero — единая `.product-card` с двумя зонами:
- **`.product-card__cover`** (слева): радиальный градиент фон, обложка, free-badge
- **`.product-card__body`** (справа): eyebrow → title → desc → bullets → CTA → meta-row

### Элементы
- **Topbar** — лого + разделитель + tagline слева, label справа. Без border-bottom
- **Free-badge** — зелёный pill в углу обложки, с белой точкой и glow-shadow
- **Eyebrow** — JetBrains Mono uppercase «PDF-гайд · 36 страниц»
- **Title** — Outfit weight 500 (не 800!), `clamp(2rem, 4vw, 2.85rem)`, accent-слово зелёным
- **Desc** — DM Sans, скрыт на мобилке (`display: none`)
- **Буллеты** — 16×16 круг с `--green-tint` фоном и зелёным чекмарком, разделители hairline
- **CTA** — тёмная плоская (`--ink`), занимает всю ширину body, с зелёным circular arrow внутри (28px)
- **Meta-row** — JetBrains Mono, через разделители «·»: `PDF · 36 стр. · 25 мин · Telegram / MAX`
- **Cover** — обложка PDF с 4-уровневыми тенями, parallax-tilt при hover
- **Модалка** — чистый белый `#fff`, overlay `rgba(20,23,26,0.5)` без blur, `border-radius: 20px`, `max-width: 460px`
- **Кнопка закрытия модалки** — круглая 36px (32px на мобилке), `z-index: 9999`, `padding-top: 3rem` у `.modal` на мобилке
- **Инпуты формы** — фон `#f5f5f7`, focus = зелёный border + glow
- **Чекбоксы формы (toggle-switch)** — `-webkit-appearance: none`, 44×24px, фон `#e5e5ea`, активный = зелёный
- **Выравнивание чекбоксов** — `margin-right: 0.625rem` на input (не `gap`). Сброс на `.ml_quiz.quiz_checkbox`, `.salebot-checkbox-field`, `.ml_answers`. `font-size: 0` гасит whitespace
- **Кнопки мессенджеров** — каждая в фирменном цвете (см. ниже)

### Кнопки мессенджеров в форме Salebot

Форма с тремя кнопками — VK, Telegram, MAX. Гайд выдаётся через TG или MAX, VK опционально.

| Мессенджер | CSS-класс Salebot | Цвет | Hover |
|-----------|-------------------|------|-------|
| VK | `.vk_link` | `#0077FF` | `#0066DD` |
| Telegram | `.tg_link` | `#2AABEE` | `#229ED9` |
| MAX | `.max_link` | `linear-gradient(90deg, #527CF2, #9040C8)` | `linear-gradient(90deg, #4870E0, #8038B8)` |

**CSS-правила для стилизации кнопок Salebot:**
- Скрывать SVG-иконки: `.salebot_button svg, .salebot_button img, .salebot_button .mes_ident { display: none }`
- Сбросить высоту контейнера: `.custom_social_btn_container { height: auto; min-height: 0 }`
- Padding кнопок = padding CTA (`1rem 2rem`)
- `font-family: 'Outfit'`, `font-weight: 600`, `font-size: 0.95rem`
- `border-radius: var(--radius)` (14px)
- `margin-bottom: 0.5rem` между кнопками

### Адаптив
- **768px** — мобилка: одна колонка, обложка сверху (маленькая 160px), sticky CTA внизу, модалка = bottom-sheet
  - **Скрывать `.hero__desc`** на мобилке — сразу заголовок → буллеты → CTA
  - Кнопка закрытия модалки минимум 44×44 (Apple touch target)
- **1400px+** — увеличение шрифтов, gap, обложки до 380px
- **1800px+** — дальнейшее масштабирование до 420px обложка
- **2200px+** — максимум: 4.6rem заголовок, 460px обложка

### Структура разметки (эталон 0526)

```html
<header class="topbar">
  <div class="topbar__brand">
    <img src="logo.png" alt="FIN-RA">
    <span class="topbar__divider"></span>
    <span class="topbar__tag">Школа безопасных инвестиций</span>
  </div>
  <span class="topbar__label">Подборка облигаций</span>
</header>

<main class="stage">
  <article class="product-card">
    <div class="product-card__cover">
      <div class="cover-holder" onclick="openModal()">
        <span class="free-badge">Бесплатно</span>
        <img src="обложка.png" alt="Обложка гайда">
      </div>
    </div>

    <div class="product-card__body">
      <div class="eyebrow">PDF-гайд&nbsp;·&nbsp;36 страниц</div>
      <h1 class="title">Облигации с <span class="accent">ежемесячным</span> купоном 2026</h1>
      <p class="desc">Описание...</p>
      <ul class="bullets">
        <li>Буллет 1</li>
        <li>Буллет 2</li>
        <li>Буллет 3</li>
      </ul>
      <button class="cta" onclick="openModal()">
        <span>Забрать гайд бесплатно</span>
        <span class="cta__arrow"><svg>↓</svg></span>
      </button>
      <div class="meta-row">
        <span>PDF</span><span>36 стр.</span><span>25 мин</span><span>Telegram / MAX</span>
      </div>
    </div>
  </article>
</main>

<footer class="footer">&copy; <a href="https://fin-ra.ru/">FIN-RA</a> — Школа безопасных инвестиций</footer>

<!-- Модалка с формой Salebot -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModalOutside(event)">
  <div class="modal">
    <button class="modal__close" onclick="closeModal()">&times;</button>
    <script src='https://salebot.pro/js/form_scripts.js'></script>
    <div class='form_integration_block'></div>
    <script>FormIntegration.init({ project_id: XXX, guid: 'XXX' })</script>
  </div>
</div>

<script src="/tg-intercept.js" defer></script>
```

### Что меняется при создании нового гайда

1. **Title** + accent-слово в `<span class="accent">`
2. **Eyebrow** — количество страниц
3. **Description** (на мобилке скрыт)
4. **3 буллета**
5. **Meta-row** — `PDF · {N стр.} · {M мин} · Telegram / MAX`
6. **og:url** + **og:image** + **og:title** + **og:description** + **meta description**
7. **Salebot GUID и project_id**
8. **Topbar label** — категория гайда
9. **Title тега** `<title>FIN-RA — ...</title>`
10. **Обложка** `обложка.png` в директории гайда

### Порядок элементов в hero (сверху вниз)

1. **Badge** — короткий лейбл категории
2. **H1** — заголовок с акцентом на зелёный span
3. **hero__desc** — описание, 2-3 строки. **Скрыто на мобилке** (`display: none`)
4. **hero__bullets** — 3 буллета с чекмарками
5. **cta-btn** — основная кнопка «Забрать гайд бесплатно»
6. **cta-hint** — мелкий текст «Гайд придёт в Telegram или MAX»

## Лид-воронка

1. Пользователь заходит на лендинг
2. Видит превью гайда/обучения + CTA-кнопку
3. Нажимает → открывается модалка с формой Salebot
4. Вводит имя + Telegram-ник
5. Бот отправляет PDF или регистрирует на обучение

## Формы Salebot (GUID)

| Страница | GUID | Project |
|----------|------|---------|
| 0226 | `a6134ca4f0615213d6fdda04ddde267f` | 354621 |
| 0326 | `7c19e73c50d1e17cfd8f88da284fefb9` | 317313 |
| 0326max (VK+TG+MAX) | `7c19e73c50d1e17cfd8f88da284fefb9` | 317313 |
| 0526 (TG+MAX) | `a25e8b663251c9d1f0e350c1fcfee22f` | 317313 |
| 0426 (TG) | `768259744d146c9bfb2c7225f7d2a3e4` | 354621 |
| dividends (TG+MAX) | `75382c3836819abab95a19511bf78fc1` | 317313 |
| invest-salary-2026 | `zpreg` | 317313 |
| isalary (VK+TG+MAX) | `9adb4552388bf0b240d3e7b2010e65b9` | 317313 |
| mpk (TG+MAX) | `95c0f7d075db7c2c9c09428e2353de98` | 317313 |
| anketa | `596132074c1ec31deb915cca849e2726` | 317313 |
| quiz-money (ИЗ) | `zpreg` | 317313 |
| quiz-defense (ИЗ) | `zpreg` | 317313 |
| quiz-investor (ИЗ) | `zpreg` | 317313 |

**Стоп-сигналы → «Финансовый прорыв»:** все результаты-стопы в `quiz-money` и `quiz-defense` редиректят на `https://fin-ra.ru/courses/fin-breakthrough` без Salebot-формы. Если позже появится отдельная посадка/бот для ФП — поменять `link:` в `QUIZ.results.stop` обоих квизов.

## Модалка (общий паттерн)

- `.modal-overlay` — `rgba(0,0,0,0.4)`, без blur
- `.modal` — белый `#fff`, `border-radius: 20px`, max 460px
- Закрытие: клик вне, ESC, кнопка-крестик (круглая)
- На мобиле: bottom-sheet стиль (закруглён сверху, прижат к низу)

## Локальная разработка

```bash
python3 -m http.server 8000
# или
npx serve -l 3000
```

Конфиг серверов в `.claude/launch.json`.

## Правила работы

- Каждый лендинг — самостоятельный HTML-файл со встроенными стилями
- Не использовать внешние CSS/JS файлы (всё inline для скорости)
- **Новые гайды создавать копированием `/0526/index.html`** — это эталон (Premium-минимализм: single product-card с тёплым бумажным фоном, 3D parallax обложки, JetBrains Mono для меток, тёмная плоская CTA с зелёным circular arrow)
- Salebot GUID уникален для каждой кампании — менять при создании нового лендинга
- Изображения хранить в папке лендинга (logo.png, обложка.png и т.д.)
- Коммиты на русском или английском, пушить в main — деплой автоматический

## Чеклист при создании/редактировании лендинга

### SEO и шеринг
- `<meta name="description">` — обязательно
- `<meta property="og:title/description/image/url">` — для шеринга в мессенджерах
- `<title>` должен совпадать с контентом страницы

### Доступность
- НЕ использовать `user-scalable=no`
- Все `<img>` должны иметь осмысленный `alt`
- ESC закрывает модалку

### Производительность
- Все `<img>` должны иметь `width` и `height`
- Вторичные изображения — `loading="lazy"`
- `<meta name="theme-color">` для мобильных браузеров
- Favicon: `<link rel="icon" href="/favicon.ico">`

### Fullstack
- Salebot-скрипт загружается внутри модалки — не блокирует контент
- Формы стилизованы через CSS `!important` (переопределение Salebot-стилей)
- При дублировании — обязательно сменить Salebot GUID
- **Обязательно подключать `tg-intercept.js`** на каждом лендинге с Salebot-формой
- **Обязательно подключать `salebot-guard.js`** на каждом лендинге с Salebot-формой (см. ниже)
- **Обязательно ставить `preconnect`** к `salebot.pro`, `chatter.salebot.pro`, `ajax.googleapis.com`, `cdnjs.cloudflare.com`

## Пустая модалка вместо формы — salebot-guard.js

**Симптом:** человек жмёт CTA, открывается пустая белая шторка с одним крестиком. Формы нет и не появится. Найдено 2026-07-28 на `/mpk/` по скриншоту с мобильного.

### Причина

Форма не лежит на нашей странице. `FormIntegration.init` тянет её **цепочкой из 9 последовательных запросов к 4 доменам**, каждый следующий стартует по `onload` предыдущего:

```
salebot.pro/js/form_scripts.js
  → ajax.googleapis.com/.../jquery.min.js
    → salebot.pro/js/emojis.js
      → cdnjs.cloudflare.com/.../jquery.easing.min.js
        → salebot.pro/js/calendarCreator.js
          → cdnjs.cloudflare.com/.../swiper.min.js
            → cdnjs.cloudflare.com/.../swiper.min.css
              → salebot.pro/css/form_integration.css
                → XHR salebot.pro/projects/<id>/form_view/<guid>   ← сама форма
```

В коде Salebot **нет ни одного обработчика ошибок и ни одного таймаута**. Одно недошедшее звено (слабая мобильная связь, блокировщик рекламы, DNS-фильтр, замедление Cloudflare) останавливает цепочку навсегда: блок остаётся пустым, человек ничего не понимает и уходит. Даже на хорошем канале форма появляется примерно через 2 секунды после старта страницы.

### Решение

Файл `/salebot-guard.js` (v1) — подключать на **каждом** лендинге с Salebot-формой, рядом с `tg-intercept.js`:
```html
<script src="/tg-intercept.js" defer></script>
<script src="/salebot-guard.js" defer></script>
```

Плюс `preconnect` в `<head>`, чтобы прогреть соединения до старта цепочки:
```html
<link rel="preconnect" href="https://salebot.pro" crossorigin>
<link rel="preconnect" href="https://chatter.salebot.pro" crossorigin>
<link rel="preconnect" href="https://ajax.googleapis.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
```

### Как работает

1. Находит все `.form_integration_block` и вставляет перед каждым блок состояния
2. Пока формы нет — крутится индикатор с текстом «Загружаем форму»
3. Через 7 секунд повторяет `init`, при необходимости заново подгружая `form_scripts.js`
4. Через 18 секунд показывает «Форма не загрузилась» и кнопку «Попробовать снова»
5. **Таймер тикает только пока блок реально виден на экране.** Закрытая модалка и отложенная форма квиза не ловят ложную ошибку
6. Конфиг для повтора скрипт сам вытаскивает регуляркой из инлайн-скрипта страницы — правки разметки не нужны
7. Цвет текста подбирается по реальному фону под блоком: работает и на светлых лендингах, и на тёмных, и на белой карточке внутри тёмной страницы

### Чего делать нельзя

- **Не полагаться на то, что форма загрузится.** Любая новая посадка с Salebot без `salebot-guard.js` = пустые модалки у части аудитории
- **Не вешать свой лоадер поверх** — он уже есть в guard, второй будет мешать
- Повторный `FormIntegration.init` уводит их внутренний счётчик на следующий `.form_integration_block`. Guard обходит это, проставляя единственному блоку `id="form_integration_block"` — их код по этому id находит тот же элемент

## Обход блокировки t.me — tg-intercept.js

В России заблокирован домен `t.me`. Salebot после заполнения формы делает редирект на `t.me/bot?start=xxx` через `$.ajax` + `location.href`. Без обхода пользователи не попадают в Telegram.

### Решение

Файл `/tg-intercept.js` (v5) — подключать на **каждом** лендинге где есть Salebot-форма:
```html
<script src="/tg-intercept.js"></script>
```

Для Tilda (fin-ra.ru) — отдельная сборка `/tg-intercept-tilda.js` (v2), подключается в headcode сайта.

### Как работает

1. Перехватывает jQuery `$.ajax` ответы от Salebot и подменяет `t.me` → `guides.fin-ra.pro/tg/`
2. Перехватывает `fetch` — на нём сидит новая форма Salebot (`sb_form.js`), см. раздел ниже
3. Поллит `location.href` каждые 30ms — если браузер начал переход на `t.me`, подменяет URL
4. Подменяет `<a href="t.me/...">` через MutationObserver
5. Перехватывает `window.open`

### Промежуточная страница `/404.html`

GitHub Pages отдаёт `404.html` для любого пути `/tg/*`. Страница:
- Пробует `tg://resolve?domain=bot&start=xxx` — deep link напрямую в приложение Telegram
- Если через 3 сек не открылось — фоллбэк на `https://t.me/bot?start=xxx`
- Показывает «Открываем Telegram...» пока ждёт

### Схема
```
Salebot → $.ajax → ответ с t.me/bot?start=xxx
    → tg-intercept.js подменяет на guides.fin-ra.pro/tg/bot?start=xxx
        → 404.html (GitHub Pages)
            → tg://resolve (deep link в приложение) ✅
            → фоллбэк t.me (если Telegram не установлен)
```

### Чеклист при создании нового лендинга
- [ ] Подключить `<script src="/tg-intercept.js"></script>` перед `</body>`
- [ ] Проверить что в футере появляется версия скрипта (сейчас v5)
- [ ] Протестировать заполнение формы без VPN

## Мёртвые кнопки формы во встроенном браузере Telegram

**Симптом:** человек открыл лендинг по ссылке из Telegram, заполнил форму, жмёт «Продолжить в TG» — **не происходит ничего**. Ни перехода, ни ошибки. В обычном браузере та же форма работает. Найдено 2026-08-11 на `fin-ra.ru/stable-reg-august`.

### Причина

Новая форма Salebot (`sb_form.js`, веб-компонент `<sb-form>`) считает страницу «Telegram Mini App», если в окне есть мост `window.TelegramWebviewProxy` или `webkit.messageHandlers.TelegramWebviewProxy`. **Встроенный браузер Telegram подставляет этот мост в любую открытую страницу** — то есть проверка срабатывает ложно на обычном лендинге.

Что делает `submitBot()` в этом режиме:
1. вешает на POST `AbortController` с таймаутом **5 секунд** — на медленной мобильной сети отправка молча отваливается;
2. после успешного ответа вместо перехода вызывает `_closeTgWebApp()` («закрыть мини-приложение») и **выходит из функции ДО строки `window.location.href = redirect_to`**. Закрывать во встроенном браузере нечего, вызов уходит в пустоту.

Ошибка не показывается — форма считает, что всё прошло успешно.

### Решение

Обе версии интерцептора (`tg-intercept.js` v5, `tg-intercept-tilda.js` v2) перехватывают `fetch` на POST к `salebot.pro/mini_landing/`:
- снимают abort-таймаут;
- сами читают `redirect_to` из ответа и уводят человека на бота (через прокси `/tg/`, если это `t.me`).

Проверка не трогает никакие другие запросы — только POST, только по этому шаблону URL.

### Чего делать нельзя

- **Не полагаться на то, что Salebot сам уведёт в бота.** Любой лендинг с новой формой без `tg-intercept` = мёртвые кнопки у всех, кто пришёл из Telegram (а это основной канал)
- Переопределять `window.isTelegramWebApp` бесполезно: если она вернёт `false`, код Salebot не останавливается, а идёт дальше проверять мост
- Проверять форму только в десктопном браузере — там баг не воспроизводится
