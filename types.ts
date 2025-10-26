import { Layout } from 'react-grid-layout';

export enum WidgetType {
  Plan = 'plan',
  Pie = 'pie',
  Line = 'line',
  Text = 'text',
  Title = 'title',
  Checklist = 'checklist',
  Image = 'image',
  Article = 'article',
  Folder = 'folder',
}

export interface PlanData {
  title: string;
  current: number;
  target: number;
  unit: '%' | '₽' | 'custom';
  customUnit: string;
  color: string;
  color2: string;
  userSetColors?: boolean;
}

export interface PieData {
  title: string;
  total: number;
  part: number;
  totalLabel: string;
  partLabel: string;
  color1: string;
  color2: string;
  userSetColors?: boolean;
}

export type DependencyDataKey = keyof Pick<PlanData, 'current' | 'target'> | keyof Pick<PieData, 'total' | 'part'>;

export interface LineDataPoint {
  id: string;
  x: string | number;
  y: number;
  dependency?: {
    widgetId: string;
    dataKey: DependencyDataKey;
  }
}
export interface LineData {
  title: string;
  color: string;
  color2: string;
  userSetColors?: boolean;
  series: {
    name: string;
    data: LineDataPoint[];
  }[];
}

export interface TextData {
  title: string;
  content: string;
}

export interface TitleData {
    title: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ChecklistData {
  title: string;
  items: ChecklistItem[];
}

export interface ImageData {
  title: string;
  src: string | null;
}

export type ArticleData = TextData;

export interface FolderData {
    title: string;
    isCollapsed: boolean;
    expandedH: number;
    childrenLayouts?: { [key: string]: Layout[] };
    color?: string;
}

export type WidgetData = PlanData | PieData | LineData | TextData | TitleData | ChecklistData | ImageData | ArticleData | FolderData;

export interface Widget {
  id: string;
  type: WidgetType;
  data: WidgetData;
  minW?: number;
  minH?: number;
  parentId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  widgets: Widget[];
  layouts: { [key: string]: Layout[] };
}

export interface User {
  id: string;
  name: string;
  email: string;
}
