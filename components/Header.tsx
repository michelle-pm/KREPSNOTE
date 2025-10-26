

import React from 'react';
import { PanelLeft, Plus, RotateCcw } from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  onAddWidget: () => void;
  showAddWidgetButton: boolean;
  onUndo: () => void;
  canUndo: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar, onAddWidget, showAddWidgetButton, onUndo, canUndo }) => {
  return (
    <header className="sticky top-0 z-30 bg-light-bg/80 dark:bg-dark-bg/70 backdrop-blur-2xl p-4 flex justify-between items-center border-b border-light-border dark:border-dark-border">
      <div className="flex items-center gap-4 min-w-0">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors flex-shrink-0" 
          aria-label="Открыть меню"
        >
            <PanelLeft className="text-gray-600 dark:text-accent" size={24} />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{title}</h1>
         <button 
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" 
          aria-label="Отменить действие"
        >
            <RotateCcw className="text-gray-600 dark:text-accent" size={20} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {showAddWidgetButton && (
            <button
            onClick={onAddWidget}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-dark-bg dark:bg-accent dark:hover:bg-accent-dark dark:text-dark-bg transition-all duration-200 w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full sm:rounded-lg font-semibold text-sm shadow-sm hover:shadow-md"
            >
                <Plus size={16} />
                <span className="hidden sm:inline">Добавить виджет</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;
