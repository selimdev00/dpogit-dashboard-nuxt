# DPOGTI Dashboard

> Система управления и мониторинга DPOGTI

Современный веб-дашборд построенный на **Nuxt 4** с использованием архитектуры **Feature-Sliced Design (FSD)** и **shadcn/ui** компонентов.

## 🏗️ Архитектура

Проект следует принципам **Feature-Sliced Design (FSD)** для обеспечения масштабируемости и поддерживаемости:

```
src/
├── app/           # Конфигурация приложения
│   ├── layouts/   # Макеты страниц
│   ├── plugins/   # Плагины Nuxt
│   ├── styles/    # Глобальные стили
│   └── config/    # Конфигурационные файлы
├── pages/         # Страницы (роутинг Nuxt)
│   ├── home/      # Главная страница
│   ├── login/     # Авторизация
│   ├── department/# Страницы отделов
│   └── plans/     # Планирование
├── widgets/       # Сложные UI-компоненты
│   ├── dashboard/ # Виджеты дашборда
│   ├── header/    # Виджет хедера
│   └── departments/# Виджеты отделов
├── features/      # Бизнес-логика
│   └── auth/      # Функционал авторизации
├── shared/        # Переиспользуемые ресурсы
│   ├── api/       # API слой
│   ├── ui/        # UI компоненты
│   ├── stores/    # Pinia стейт
│   ├── lib/       # Утилиты
│   └── types/     # TypeScript типы
└── middleware/    # Middleware маршрутов
```

## 🛠️ Технологический стек

### Основные технологии
- **[Nuxt 4](https://nuxt.com/)** - Full-stack Vue фреймворк
- **[Vue 3](https://vuejs.org/)** - Реактивный фреймворк
- **[TypeScript](https://www.typescriptlang.org/)** - Типизированный JavaScript
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS фреймворк

### UI & Стилизация
- **[shadcn/ui](https://ui.shadcn.com/)** - Переиспользуемые UI компоненты
- **[Radix Vue](https://www.radix-vue.com/)** - Низкоуровневые UI примитивы
- **[Reka UI](https://reka-ui.com/)** - Vue компоненты
- **[Lucide Vue](https://lucide.dev/)** - Иконки

### Управление состоянием и данными
- **[Pinia](https://pinia.vuejs.org/)** - Стейт менеджмент
- **[TanStack Vue Query](https://tanstack.com/query/latest)** - Управление серверным состоянием
- **[VeeValidate](https://vee-validate.logaretm.com/v4/) + Yup** - Валидация форм

### Визуализация данных
- **[ECharts](https://echarts.apache.org/)** - Графики и диаграммы
- **[GSAP](https://greensock.com/gsap/)** - Анимации

### Утилиты
- **[VueUse](https://vueuse.org/)** - Композабли для Vue
- **[class-variance-authority](https://cva.style/)** - Условные CSS классы

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- npm/yarn/pnpm/bun

### Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd dpogti-dashboard-nuxt

# Установить зависимости
npm install
# или
yarn install
# или
pnpm install
# или
bun install
```

### Настройка окружения

```bash
# Скопировать файл окружения
cp .env.example .env

# Настроить переменные в .env
API_HOST=your_api_host
```

### Запуск в режиме разработки

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## 📦 Сборка для продакшена

```bash
# Собрать приложение
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🏛️ Основные функции

### 📊 Дашборд
- **Метрики в реальном времени** - Отслеживание KPI отделов и сотрудников
- **Интерактивные графики** - Визуализация данных с помощью ECharts
- **Настраиваемые фильтры** - Фильтрация по датам и отделам

### 🏢 Управление отделами
- **Карточки отделов** - Обзор метрик и сотрудников
- **Детализация по отделам** - Подробная аналитика
- **Аватары сотрудников** - Визуальное представление команды

### 👥 Управление сотрудниками
- **Профили сотрудников** - Индивидуальные метрики
- **Отслеживание производительности** - Личные KPI
- **Система ролей** - Контроль доступа

### 📈 Система планирования
- **Постановка целей** - Планы по отделам
- **Трекинг прогресса** - Отслеживание выполнения
- **Аналитика отклонений** - Сравнение план/факт

## 🔧 Конфигурация

### Метрики дашборда

Система поддерживает гибкую конфигурацию метрик через `dashboardMetricsConfig`:

```typescript
// src/shared/lib/dashboard/config.ts
export const dashboardMetricsConfig: DashboardMetricConfig[] = [
  {
    id: "invoices_count",
    title: "Количество выставленных счетов",
    apiKey: "invoices",
    formatType: "count",
    dataProperty: "invoices",
    valueProperty: "count",
    progressProperty: "assumptionPercent",
    planProperty: false, // Отключить отображение плана
  },
  // ...другие метрики
];
```

### Типы форматирования
- `currency` - Валютные значения
- `number` - Числовые значения
- `percentage` - Проценты
- `count` - Количество
- `text` - Текстовые значения

## 🎨 UI компоненты

### Основные компоненты
- `MetricCard` - Карточка метрики с прогрессом
- `MetricProgress` - Прогресс-бар с настраиваемым форматированием
- `DepartmentCard` - Карточка отдела с метриками сотрудников
- `EmployeeCard` - Карточка сотрудника с личными метриками

### Шаблоны проектирования
- **Conditional Rendering** - Условное отображение UI элементов
- **Dynamic Queries** - Динамическое создание API запросов
- **Configuration-Driven** - Управление через конфигурацию

## 🔒 Аутентификация и авторизация

- **Middleware защита** - Защита маршрутов
- **Ролевая модель** - Контроль доступа по ролям
- **Гостевой режим** - Специальные страницы для неавторизованных

## 🌐 API интеграция

### TanStack Query
- Автоматическое кеширование
- Фоновое обновление данных
- Обработка состояний загрузки и ошибок
- Оптимистичные обновления

### Типизация API
```typescript
// Все API ответы типизированы
interface MetricData {
  count: number;
  plan: number;
  assumptionPercent: number;
  // ...
}
```

## 📚 Дополнительная документация

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Участие в разработке

1. Fork репозитория
2. Создайте feature ветку (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Распространяется под лицензией MIT. См. `LICENSE` для подробностей.

---

**Разработано с ❤️ для DPOGTI**