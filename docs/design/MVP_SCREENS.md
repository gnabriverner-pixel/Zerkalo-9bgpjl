# Зеркало себя — MVP Screens v1

## Flow

```
01 Welcome → 02 Date Input → 03 Free Result → 04 Big Research CTA
```

---

## Screen 01 — Welcome

**Цель**: быстро передать суть продукта. Одна идея, одна кнопка.

### Layout
```
[StatusBar — safe area]
[Center vertically]

  MirrorSymbol (oval + orbit lines + number sigils)

  Label:   ЗЕРКАЛО СЕБЯ
  Title:   Увидь свой цифровой код
  Body:    Персональный разбор по дате рождения.
           Не гороскоп, не предсказание —
           внутренняя архитектура вашей природы.

  [Начать]                    ← primary gold button

  Маленький текст: попробовать без регистрации

[LegalMicrocopy bottom]
```

### Visual notes
- Тёмный фон #090909
- Зеркало/овал в центре с тонким золотым контуром
- Никаких лишних элементов
- Один CTA

---

## Screen 02 — Date Input

**Цель**: получить дату рождения, показать что будет рассчитано.

### Layout
```
[Back button]
[Title]: Введите дату рождения
[Subtitle]: Мы соберём вашу личную формулу

[DOB Input field — large centered numbers]
  ДД   /   ММ   /   ГГГГ
  [Рассчитать код →]

[FormulaPreview card — «Что войдёт в ваш код»]
  Душа · Выражение · Путь · Направление · Результат
  Цепочки расчёта с составными числами
  Матрица · Циклы · Денежный код

[Имя — optional, small field]
[+ дополнительные поля — collapsible]

[LegalMicrocopy]
```

### Visual notes
- Дата рождения — большой шрифт 34–40px, serif, gold
- Поле DOB выделяется, остальные поля — вторичные
- FormulaPreview — тёмная карточка, без конкретных цифр

---

## Screen 03 — Free Result

**Цель**: дать реальную ценность, но не весь продукт.

### Layout
```
[Back] [Save]

[ResultHeader dark card]
  Ваш цифровой код
  [Имя]  [ДД.ММ.ГГГГ]
  Formula: 9 — 3 — 6 — 3 — 6    ← large, gold
  Подпись: Душа · Выражение · Путь · Направление · Результат
  Составные: 11 / 35 / 41 / 82

[Tabs: Паспорт | Числа | Синтез | ★ Глубина]

— TAB: Паспорт —
  5 number rows:
    [circle N] | Число Души | Венера | chain
  [Матрица] [Циклы] [Деньги] quick buttons

— TAB: Числа —
  Cards per number with Light/Tension/Orientation

— TAB: Синтез —
  Ключевой вектор + 3 сильные стороны
  [Locked block: Зоны напряжения]

[BigResearchCTA upsell at bottom]
  Большое исследование · 22 раздела · 2 900 ₽
  [Открыть Большое исследование]

[LegalMicrocopy]
```

### Visual notes
- Header: полностью тёмная карточка
- Formula: serif display, gold color
- Number circles: planet-color coded
- Locked blocks: gold border + lock icon
- Bottom CTA sticky при скролле или внутри контента

---

## Screen 04 — Big Research CTA

**Цель**: конвертировать. Показать ценность, убрать сомнения.

### Layout
```
[Close ×]

[Hero dark gradient card]
  Badge: БОЛЬШОЕ ИССЛЕДОВАНИЕ
  Title: Дом Самопознания
  Subtitle: Персональный PDF-разбор вашей формулы

  FormulaBox:
    Ваша формула: 9—3—6—3—6
    составные: 11 / 35 / 41 / 82
    Раскрываем не только итоговые числа,
    но и составные — они показывают,
    как формируется ваш код.

[What's included — 22 разделов]
  • bullet list

[Trust signals]
  ✓ Авторская система · мастер Вяземский
  ✓ Разовая покупка · без подписки
  ✓ Постоянный доступ в аккаунте

[Disclaimer]

[Fixed CTA bar]
  [Открыть Большое исследование   2 900 ₽]
  Не является консультацией
```

### Visual notes
- Full dark screen
- Hero card: darkest gradient, gold badge
- CTA bar: fixed bottom, ivory bg or gold button
- Price на кнопке, не заголовок
