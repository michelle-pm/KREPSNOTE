import { WidgetType, PlanData, PieData, LineData, TextData, TitleData, ChecklistData, ImageData, ArticleData, FolderData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const WIDGET_DEFAULTS = {
  [WidgetType.Plan]: {
    w: 4, h: 5, minW: 3, minH: 5,
    data: {
      title: 'План выполнения',
      current: 7500,
      target: 10000,
      unit: '₽',
      customUnit: 'дней',
      color: '#8A2BE2',
      color2: '#BA55D3',
    } as PlanData,
  },
  [WidgetType.Pie]: {
    w: 4, h: 5, minW: 3, minH: 4,
    data: {
      title: 'Соотношение',
      total: 100,
      part: 30,
      totalLabel: 'Всего',
      partLabel: 'Часть',
      color1: '#8A2BE2',
      color2: '#BA55D3',
    } as PieData,
  },
  [WidgetType.Line]: {
    w: 4, h: 6, minW: 4, minH: 4,
    data: {
      title: 'Динамика',
      color: '#8A2BE2',
      color2: '#4facfe',
      series: [
        {
          name: 'Продажи',
          data: [
            { id: uuidv4(), x: 'Янв', y: 30 },
            { id: uuidv4(), x: 'Фев', y: 40 },
            { id: uuidv4(), x: 'Мар', y: 45 },
            { id: uuidv4(), x: 'Апр', y: 50 },
            { id: uuidv4(), x: 'Май', y: 49 },
            { id: uuidv4(), x: 'Июн', y: 60 },
          ],
        },
      ],
    } as LineData,
  },
  [WidgetType.Text]: {
    w: 3, h: 4, minW: 2, minH: 2,
    data: {
      title: 'Заметка',
      content: 'Это текстовый виджет. Вы можете записать здесь свои мысли.',
    } as TextData,
  },
  [WidgetType.Title]: {
    w: 12, h: 2, minW: 2, minH: 2,
    data: {
      title: 'Заголовок раздела',
    } as TitleData,
  },
  [WidgetType.Checklist]: {
      w: 4, h: 5, minW: 3, minH: 5,
      data: {
          title: 'Список дел',
          items: [
              { id: '1', text: 'Первая задача', completed: false },
              { id: '2', text: 'Вторая задача', completed: true },
          ]
      } as ChecklistData,
  },
  [WidgetType.Image]: {
      w: 4, h: 5, minW: 2, minH: 2,
      data: {
          title: 'Изображение',
          src: null,
      } as ImageData,
  },
  [WidgetType.Article]: {
    w: 4, h: 8, minW: 4, minH: 4,
    data: {
      title: 'Статья',
      content: '## Заголовок статьи\n\nНачните писать здесь...',
    } as ArticleData,
  },
  [WidgetType.Folder]: {
    w: 12, h: 6, minW: 4, minH: 1,
    data: {
      title: 'Новая папка',
      isCollapsed: false,
      expandedH: 6,
    } as FolderData,
  }
};