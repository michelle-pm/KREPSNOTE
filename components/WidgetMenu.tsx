import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, CheckSquare, FileText, PieChart, X, Heading1, ListChecks, Image, BookText, Folder } from 'lucide-react';
import { WidgetType } from '../types';

interface WidgetMenuProps {
  onSelect: (type: WidgetType) => void;
  onClose: () => void;
}

const widgetOptions = [
  { type: WidgetType.Plan, label: 'Прогресс-бар', icon: <CheckSquare /> },
  { type: WidgetType.Pie, label: 'Круговой график', icon: <PieChart /> },
  { type: WidgetType.Line, label: 'Линейный график', icon: <BarChart /> },
  { type: WidgetType.Checklist, label: 'Чек-лист', icon: <ListChecks /> },
  { type: WidgetType.Image, label: 'Изображение', icon: <Image /> },
  { type: WidgetType.Article, label: 'Статья', icon: <BookText /> },
  { type: WidgetType.Text, label: 'Заметка', icon: <FileText /> },
  { type: WidgetType.Title, label: 'Заголовок', icon: <Heading1 /> },
  { type: WidgetType.Folder, label: 'Папка', icon: <Folder /> },
];

const WidgetMenu: React.FC<WidgetMenuProps> = ({ onSelect, onClose }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-md"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '100%' }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
        className="fixed top-0 right-0 h-full w-80 bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/70 backdrop-blur-2xl z-50 shadow-2xl p-6 flex flex-col border-l border-light-border dark:border-dark-border"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Добавить виджет</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {widgetOptions.map(option => (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              className="flex items-center gap-4 p-4 rounded-2xl text-left hover:bg-accent-light dark:hover:bg-white/10 transition-colors duration-200"
            >
              <div className="text-accent dark:text-accent-dark">{option.icon}</div>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default WidgetMenu;