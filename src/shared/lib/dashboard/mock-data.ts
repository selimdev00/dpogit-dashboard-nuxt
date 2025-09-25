import type { DashboardMetric } from './types'

export const mockDashboardMetrics: DashboardMetric[] = [
  {
    id: 'revenue',
    title: 'Выставленные договора, руб',
    value: 2654500,
    subtitle: '2 800 000',
    changeText: '↑ 11.32% чем в январе',
    changeType: 'increase',
    formatType: 'currency',
    progressValue: 76
  },
  {
    id: 'income',
    title: 'Приход денег, руб',
    value: 1985000,
    subtitle: '2 100 000',
    changeText: '↗ 2.85% чем в январе',
    changeType: 'increase',
    formatType: 'currency',
    progressValue: 57
  },
  {
    id: 'payments',
    title: 'Оплата, руб',
    value: 2110000,
    subtitle: '2 300 000',
    changeText: '↓ 1.21% чем в январе',
    changeType: 'decrease',
    formatType: 'currency',
    progressValue: 60
  },
  {
    id: 'planned-income',
    title: 'Планируемые поступления,...',
    value: 1300000,
    subtitle: '2 000 000',
    changeText: '↓ 1.85% чем в январе',
    changeType: 'decrease',
    formatType: 'currency',
    progressValue: 65
  },
  {
    id: 'leads-today',
    title: 'Лиды за текущий день, шт',
    value: 32,
    subtitle: '100',
    changeText: '↓ 15.67% лидов за текущий день',
    changeType: 'decrease',
    formatType: 'number',
    progressValue: 32
  },
  {
    id: 'managers-online',
    title: 'Менеджеров на линии',
    value: 21,
    subtitle: '31',
    changeText: '',
    changeType: 'neutral',
    formatType: 'number',
    progressValue: 35
  },
  {
    id: 'calls',
    title: 'Звонки, шт',
    value: 1358,
    subtitle: '2 000',
    changeText: '↑ 2.1% чем в январе',
    changeType: 'increase',
    formatType: 'number',
    progressValue: 68
  },
  {
    id: 'meetings',
    title: 'Назвом, мин',
    value: 4074,
    subtitle: '5 000',
    changeText: '↓ 3.69% чем в январе',
    changeType: 'decrease',
    formatType: 'number',
    progressValue: 51
  },
  {
    id: 'deals',
    title: 'Сделки, шт',
    value: 786,
    subtitle: '1 000',
    changeText: '↑ 9.01% чем в январе',
    changeType: 'increase',
    formatType: 'number',
    progressValue: 77
  },
  {
    id: 'confirmed-arrivals',
    title: 'Подтвержденные приезды...',
    value: 15,
    subtitle: '100',
    changeText: '↑ 1.25% чем в январе',
    changeType: 'increase',
    formatType: 'number',
    progressValue: 95
  },
  {
    id: 'conversion-leads',
    title: 'Конверсия (Лидов), %',
    value: '10.45%',
    changeText: '',
    changeType: 'neutral',
    formatType: 'text',
    description: 'Кол-во отправлено-ро за сделок от всех лидов'
  },
  {
    id: 'conversion-calls',
    title: 'Конверсия (Лидов), %',
    value: '28.15%',
    changeText: '',
    changeType: 'neutral',
    formatType: 'text',
    description: 'Кол-во оплативших-во от всех лидов'
  },
  {
    id: 'avg-call-time',
    title: 'Среднее время на вебинаре',
    value: '147 мин',
    changeText: '↓ 3.69% чем в январе',
    changeType: 'decrease',
    formatType: 'text'
  },
  {
    id: 'home-percentage',
    title: '% домашних',
    value: '67%',
    changeText: '↓ 1.65% чем в январе',
    changeType: 'decrease',
    formatType: 'text'
  },
  {
    id: 'avg-successful-deal',
    title: 'Средний чек успешных сд...',
    value: '23 дня',
    changeText: '↓ 1.05% чем в январе',
    changeType: 'decrease',
    formatType: 'text',
    description: 'Созданных и Заключены договор'
  },
  {
    id: 'avg-closed-deal',
    title: 'Средний чек успешных сд...',
    value: '34 дня',
    changeText: '↓ 1.45% чем в январе',
    changeType: 'decrease',
    formatType: 'text',
    description: 'Закрыты за период'
  }
]