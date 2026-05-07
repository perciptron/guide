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
/0526/                → [активен] Гайд "Облигации с ежемесячным купоном 2026" (36 стр., новая версия по эталону)
/0326max/             → дубль 0326 (для A/B или отдельного трафика)
/0426/                → [активен] Гайд "ИИ для инвестора" (43 стр., промпты для ChatGPT)
/dividends/           → [активен] Гайд "ТОП дивидендных акций 2026" (17 стр.)
/invest-salary/       → [активен] Запись на предобучение "Инвест-зарплата" (старый)
/invest-salary-2026/  → [активен] Запись на предобучение "Инвест-зарплата" (новый, mobile-first)
/anketa/              → [активен] Анкета предзаписи в закрытый канал (тёмная тема, золотой акцент)
/thoughts/            → спеки и планирование (Salebot, n8n, агенты)
```

## Стек

- **HTML/CSS/JS** — всё inline, без фреймворков и сборщиков
- **Google Fonts** — Outfit (заголовки), DM Sans (текст), Bricolage Grotesque (invest-salary)
- **Salebot.pro** — формы сбора лидов (FormIntegration API, project ID: 354621)
- **GitHub Pages** — хостинг через CNAME

## Эталонный шаблон для гайдов — Apple-минимализм (0326)

Все новые лендинги гайдов создавать на основе `/0326/index.html`.

### Визуальный стиль
- **Философия:** Apple-минимализм — чистота, типография, воздух
- **Фон:** чистый `#fbfbfb`, без паттернов, grain, blur, glassmorphism
- **Никаких:** dot grid, grain overlay, ambient blobs, backdrop-filter, стеклянных эффектов

### Палитра
| Переменная | Значение | Назначение |
|-----------|----------|------------|
| `--green` | `#0f9d58` | Акцентный (CTA, чекмарки, badge) |
| `--green-dark` | `#0b7a43` | Hover-состояния |
| `--green-glow` | `rgba(15,157,88,0.15)` | Тень CTA при пульсации |
| `--bg` | `#fbfbfb` | Фон страницы |
| `--text` | `#1d1d1f` | Основной текст (Apple black) |
| `--text-secondary` | `#86868b` | Вторичный текст (Apple grey) |
| `--separator` | `rgba(0,0,0,0.06)` | Разделители |

### Типография
- **Display:** Outfit, weight 800, `letter-spacing: -0.05em`, `line-height: 1.04`
- **Body:** DM Sans, `line-height: 1.6`, цвет `--text-secondary`
- **`(ОФЗ)`** или акцентные слова — просто `color: var(--green)`, без gradient clip
- `-webkit-font-smoothing: antialiased` на body

### Анимации (только две + входные)
- **fadeUp** — вход элементов, 0.8s ease, stagger через animation-delay
- **fadeDown** — вход хедера
- **ctaGlow** — тень CTA плавно нарастает/гаснет каждые 4 сек, `animation: ctaGlow 4s ease-in-out 2s infinite`. Останавливается при hover (`animation: none`)
- **coverFloat** — обложка парит ±5px каждые 5 сек, `animation: coverFloat 5s ease-in-out infinite`. Останавливается при hover

### Элементы
- **Badge** — просто текст + точка, без фона и border
- **Буллеты** — чистый список, круглые зелёные чекмарки (`border-radius: 50%`, `gap: 0.6rem`)
- **CTA** — плоский `var(--green)`, hover = `var(--green-dark)` + лёгкая тень. `font-weight: 600`, pulse-glow анимация каждые 4 сек
- **cta-hint** — мелкий текст под CTA с чекмарком, описывает куда придёт гайд. Формулировка: «Гайд придёт в Telegram или MAX»
- **Обложка** — чистая тень `0 20px 50px rgba(0,0,0,0.08)`, hover = lift + усиление тени
- **Float-теги** — белый фон `#fff`, лёгкая тень, без blur
- **Proxy-hint** — pill-плашка с info-иконкой. Фон `rgba(15,157,88,0.06)`, `border-radius: 8px`, `padding: 0.6rem 0.85rem`, `width: fit-content`, `font-family: DM Sans`, `font-size: 0.78rem`. Располагается над CTA. Текст: «Проблемы с Telegram? **Подключите прокси**»
- **Модалка** — чистый белый `#fff`, overlay `rgba(0,0,0,0.4)` без blur, `border-radius: 20px`, `max-width: 460px`
- **Кнопка закрытия модалки** — круглая 40×40 на десктопе (44×44 мобилка), `z-index: 9999`, `touch-action: manipulation`. Обязательно `padding-top: 3rem` у модалки чтобы форма не перекрывала кнопку
- **Инпуты формы** — фон `#f5f5f7`, border transparent, focus = зелёный border + glow
- **Чекбоксы формы (toggle-switch)** — `-webkit-appearance: none`, 44×24px, фон `#e5e5ea`, активный = зелёный. Круглый белый `::after` с transform `translateX(20px)` при `:checked`
- **Выравнивание чекбоксов** — оба чекбокса (согласие + политика) в `display: flex` с `margin-right: 0.625rem` на input (не `gap`). Сброс `margin/padding` на контейнерах `.ml_quiz.quiz_checkbox`, `.salebot-checkbox-field`, `.ml_answers`. `font-size: 0` на `.salebot-checkbox-field` гасит whitespace-ноды
- **Кнопки мессенджеров** — каждая в фирменном цвете (см. ниже), padding как у CTA (`1rem 2rem`)

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
  - **Скрывать `.hero__desc`** на мобилке — сразу заголовок → буллеты → proxy-hint → CTA
  - Кнопка закрытия модалки минимум 44×44 (Apple touch target)
- **1400px+** — увеличение шрифтов, gap, обложки до 380px
- **1800px+** — дальнейшее масштабирование до 420px обложка
- **2200px+** — максимум: 4.6rem заголовок, 460px обложка

### Структура разметки hero (эталон 0326)

```html
<section class="hero">
  <div class="hero__inner">
    <div class="hero__content">
      <div class="badge">Подборка ОФЗ</div>
      <h1 class="hero__title">ТОП-30 облигаций федерального займа <span>(ОФЗ)</span></h1>
      <p class="hero__desc">Описание гайда...</p>  <!-- скрыто на мобилке -->
      <ul class="hero__bullets">
        <li>Буллет 1</li>
        <li>Буллет 2</li>
        <li>Буллет 3</li>
      </ul>
      <div class="proxy-hint">
        <span>Проблемы с Telegram? <a href="tg://proxy?...">Подключите прокси</a></span>
      </div>
      <button class="cta-btn" onclick="openModal()">
        <svg>...</svg>
        Забрать гайд бесплатно
      </button>
      <span class="cta-hint">Гайд придёт в Telegram или MAX</span>
    </div>
    <div class="hero__cover">
      <div class="cover-wrapper" onclick="openModal()">
        <img src="обложка.png" alt="Обложка гайда">
      </div>
    </div>
  </div>
</section>

<!-- Модалка с формой Salebot -->
<div class="modal-overlay" id="modalOverlay" onclick="closeModalOutside(event)">
  <div class="modal">
    <button class="modal__close" onclick="closeModal()">&times;</button>
    <script src='https://salebot.pro/js/form_scripts.js'></script>
    <div class='form_integration_block'></div>
    <script>
      FormIntegration.init({ project_id: XXX, guid: 'XXX' })
    </script>
  </div>
</div>

<script src="/tg-intercept.js" defer></script>
```

### Порядок элементов в hero (сверху вниз)

1. **Badge** — короткий лейбл категории
2. **H1** — заголовок с акцентом на зелёный span
3. **hero__desc** — описание, 2-3 строки. **Скрыто на мобилке** (`display: none`)
4. **hero__bullets** — 3 буллета с чекмарками
5. **proxy-hint** — pill-плашка с ссылкой на прокси
6. **cta-btn** — основная кнопка «Забрать гайд бесплатно»
7. **cta-hint** — мелкий текст «Гайд придёт в Telegram или MAX»

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
| anketa | `596132074c1ec31deb915cca849e2726` | 317313 |

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
- **Новые гайды создавать копированием `/0326/index.html`** — это эталон (Apple-минимализм, 3 кнопки мессенджеров, proxy-hint, доработанная модалка)
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

## Обход блокировки t.me — tg-intercept.js

В России заблокирован домен `t.me`. Salebot после заполнения формы делает редирект на `t.me/bot?start=xxx` через `$.ajax` + `location.href`. Без обхода пользователи не попадают в Telegram.

### Решение

Файл `/tg-intercept.js` (v4) — подключать на **каждом** лендинге где есть Salebot-форма:
```html
<script src="/tg-intercept.js"></script>
```

### Как работает

1. Перехватывает jQuery `$.ajax` ответы от Salebot и подменяет `t.me` → `guides.fin-ra.pro/tg/`
2. Поллит `location.href` каждые 30ms — если браузер начал переход на `t.me`, подменяет URL
3. Подменяет `<a href="t.me/...">` через MutationObserver
4. Перехватывает `window.open`

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
- [ ] Проверить что в футере появляется версия скрипта (сейчас v4)
- [ ] Протестировать заполнение формы без VPN

### TG-прокси для пользователей
На лендингах добавлять ссылку на бесплатный MTProxy:
```
tg://proxy?server=proxy2.fin-ra.pro&port=8443&secret=ee24e07bbc4b4290c4251d17c437b13e8670726f7879322e66696e2d72612e70726f
```
Текст: «Проблемы с Telegram? Подключите бесплатный прокси»
