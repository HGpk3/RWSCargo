# RWSCargo

Новый сайт RWSCargo: B2B-импорт из Китая, доставка "в белую", коммерческие грузы, документы и контроль поставки.

## Стек

- Node.js LTS
- Astro 5
- TypeScript
- Docker
- PostgreSQL и Redis как опциональная инфраструктура

## Локальный запуск

Установка зависимостей:

```bash
npm install
```

Dev-сервер:

```bash
npm run dev
```

Сборка:

```bash
npm run build
```

## Docker

Запуск сайта:

```bash
docker compose up -d --build
```

Сайт будет доступен на:

```text
http://localhost:4321
```

Запуск вместе с PostgreSQL и Redis:

```bash
docker compose --profile infra up -d --build
```

## Документы проекта

- `docs/PROJECT_CONTEXT.md` - контекст, позиционирование и текущий статус.
- `docs/DESIGN_PRINCIPLES.md` - визуальные правила и принципы интерактива.
- `docs/CONTENT_STRUCTURE.md` - структура главной и смысл блоков.
- `docs/TECH_RULES.md` - технические правила разработки и проверки.
- `docs/STACK.md` - стек, инфраструктура и решение по базе/заявкам.
- `docs/SEO_STRATEGY.md` - SEO-кластеры, текущая база и будущие посадочные.
- `docs/ROADMAP.md` - дорожная карта и статусы этапов.
