# AUDIT_ONSPACE_IMPORT

Дата: 2026-05-10
Репозиторий: `gnabriverner-pixel/Zerkalo-9bgpjl`
Статус: импорт из OnSpace выполнен, проект доступен на GitHub.

## Executive verdict

Проект успешно синхронизирован с GitHub и содержит Expo / React Native исходники. Это экспорт-кандидат, а не production-ready версия.

## Подтверждено

- `package.json` найден.
- `app.json` найден.
- `services/telegram.ts` найден.
- Проект использует Expo Router, React Native, React Native Web и TypeScript.
- В `app.json` уже есть dark web/PWA-конфигурация: `themeColor`, `backgroundColor`, `display: standalone`, `output: static`.
- В `services/telegram.ts` есть безопасная заготовка Telegram WebApp helper: `isTelegramWebApp`, `expandApp`, `readyApp`, `closeApp`, `getTelegramUser`, `getInitData`.

## Риски

1. `package.json` перегружен зависимостями. В проекте есть много библиотек, которые, вероятно, не нужны для первого web/PWA/Telegram MVP.
2. Нужна проверка локального запуска вне OnSpace.
3. Нужна проверка web-сборки.
4. Нужна проверка, что приложение не зависит от OnSpace runtime.
5. Нужна сверка интерпретаций с авторским каноном Цифрового Кода.

## Не делать до аудита

- не подключать реальную оплату;
- не подключать реальный backend;
- не расширять базу интерпретаций внутри OnSpace;
- не добавлять новые разделы;
- не использовать OnSpace как главный production-builder.

## Первый локальный запуск

```bash
git clone https://github.com/gnabriverner-pixel/Zerkalo-9bgpjl.git
cd Zerkalo-9bgpjl
npm install
npm run web
```

Если появятся конфликты установки:

```bash
corepack enable
pnpm install
npm run web
```

Expo dev server:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

## Следующая ветка

```bash
git checkout -b audit/first-local-run
```

## Проверить после установки

- установка зависимостей;
- запуск `npm run web`;
- запуск `npm run lint`;
- ошибки TypeScript;
- работа экранов onboarding / расчет / паспорт / числа / синтез / циклы / деньги / профиль;
- готовность к Telegram WebView;
- фактический размер bundle;
- список реально используемых зависимостей.

## План работ

### Phase 1 — Local integrity

Запуск, lint, базовая проверка структуры.

### Phase 2 — Dependency reduction

Удалить лишние тяжелые пакеты после подтверждения, что они не используются.

### Phase 3 — Canon engine

Вынести расчеты и интерпретации в чистые модули, сверить с авторским каноном.

### Phase 4 — Telegram Mini App

Довести helper до рабочего Telegram WebApp shell, оставить browser fallback.

### Phase 5 — Payment / backend

Подключать только после стабилизации web/PWA и технического аудита.

### Phase 6 — PDF

PDF-экспорт добавлять после стабилизации продукта и структуры данных.

## Immediate checklist

- [x] Код доступен на GitHub.
- [x] `package.json` проверен.
- [x] `app.json` проверен.
- [x] `services/telegram.ts` проверен.
- [ ] Переименовать repository в латиницу без случайного суффикса.
- [ ] Ограничить доступ OnSpace GitHub App только этим repository.
- [ ] Клонировать на ПК.
- [ ] Запустить локально.
- [ ] Создать `LOCAL_RUN_REPORT.md`.
