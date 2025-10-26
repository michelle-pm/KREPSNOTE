import React from 'react';
import { GripVertical, X, Camera, ChevronDown, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { FolderData } from '../types';
import { hexToRgba } from '../utils/colors';

interface WidgetWrapperProps {
  children: React.ReactNode;
  onRemove: () => void;
  widgetId: string;
  widgetTitle: string;
  onTitleChange: (newTitle: string) => void;
  theme: 'light' | 'dark';
  isFolder?: boolean;
  folderData?: FolderData;
  folderColor?: string;
  onFolderColorChange?: (color: string) => void;
  onFolderToggle?: () => void;
  onFolderAddWidget?: () => void;
  [key: string]: any; 
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({ 
    children, onRemove, widgetId, widgetTitle, onTitleChange, theme, 
    isFolder, folderData, folderColor, onFolderColorChange, onFolderToggle, onFolderAddWidget,
    ...props 
}) => {
  const { static: isStatic, ...divProps } = props;

  const saveWidgetAsPng = () => {
    const widgetElement = document.getElementById(`widget-${widgetId}`);
    if (widgetElement) {
      html2canvas(widgetElement, {
         backgroundColor: null,
         useCORS: true,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${widgetTitle.replace(/ /g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.target.select();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onFolderColorChange) {
          const rgbaColor = hexToRgba(e.target.value);
          onFolderColorChange(rgbaColor);
      }
  };

  const headerContent = (
     <div 
        className={`flex justify-between items-center p-2 pr-3 gap-2 border-b border-light-border dark:border-dark-border ${isFolder ? 'cursor-pointer' : ''}`}
        onClick={isFolder ? onFolderToggle : undefined}
    >
        <div className="flex items-center gap-1 flex-grow min-w-0">
          <div className="drag-handle cursor-move p-1 text-gray-400 dark:text-gray-400 flex-shrink-0">
            <GripVertical size={20} />
          </div>
          <input 
              value={widgetTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              onFocus={handleFocus}
              onClick={isFolder ? e => e.stopPropagation() : undefined}
              className={`flex-grow min-w-0 font-semibold bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none p-1 rounded-md focus:bg-black/10 dark:focus:bg-white/10 transition-colors no-drag ${isFolder ? 'text-2xl font-bold pointer-events-auto' : 'text-base pointer-events-auto'}`}
              placeholder="Название виджета"
          />
        </div>
        <div className="flex items-center flex-shrink-0 z-10">
          {isFolder && onFolderColorChange && (
            <div className="relative w-5 h-5 rounded-full border border-white/20 cursor-pointer mr-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: folderColor }}>
                <input 
                    type="color"
                    onChange={handleColorChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer no-drag"
                    aria-label="Изменить цвет папки"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
          )}
          {isFolder && (
             <motion.div
                animate={{ rotate: folderData?.isCollapsed ? -90 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
                <ChevronDown size={20} className="text-gray-400 mr-2" />
            </motion.div>
          )}
          {isFolder && !folderData?.isCollapsed && onFolderAddWidget && (
            <button
                onClick={(e) => { e.stopPropagation(); onFolderAddWidget(); }}
                className="p-1.5 rounded-full text-gray-400 hover:text-accent hover:bg-white/50 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 no-drag"
                aria-label="Добавить виджет в папку"
            >
                <Plus size={16} />
            </button>
          )}
          <button
            onClick={saveWidgetAsPng}
            className="p-1.5 rounded-full text-gray-400 hover:text-accent hover:bg-white/50 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 no-drag"
            aria-label="Сохранить виджет"
          >
            <Camera size={16} />
          </button>
          <button 
            onClick={onRemove} 
            className="ml-1 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors no-drag"
            aria-label="Удалить виджет"
          >
            <X size={16} />
          </button>
        </div>
      </div>
  )

  return (
    <motion.div
      {...divProps}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      style={{ ...(props.style || {}), ...(folderColor ? { backgroundColor: folderColor } : {}) }}
      className="group bg-light-bg-secondary dark:bg-dark-bg-secondary backdrop-blur-3xl rounded-3xl shadow-soft-light dark:shadow-glass-dark shadow-glass-pane flex flex-col h-full overflow-hidden border border-light-border dark:border-dark-border transition-all duration-300 hover:shadow-soft-light-hover dark:hover:border-white/20 dark:hover:shadow-glow-violet"
    >
      {headerContent}
      <div className="flex-grow p-4 pt-2 w-full h-full overflow-auto">
        {children}
      </div>
    </motion.div>
  );
};

export default React.memo(WidgetWrapper);