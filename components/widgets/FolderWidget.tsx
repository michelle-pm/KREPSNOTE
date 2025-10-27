import React, { useMemo, useState, Suspense } from 'react';
import { Widget, WidgetType, FolderData, WidgetData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import WidgetWrapper from '../WidgetWrapper';
import { NESTED_GRID_COLS } from '../../App';
import { WIDGET_DEFAULTS } from '../../constants';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface FolderWidgetProps {
  widget: Widget;
  allWidgets: Widget[];
  renderWidget: (widget: Widget, allWidgets: Widget[]) => React.ReactNode;
  onUpdateWidgetData: (id: string, data: WidgetData) => void;
  onRemoveWidget: (id: string) => void;
  onInitiateAddWidget: (parentId?: string) => void;
  onChildrenLayoutChange: (folderId: string, allLayouts: {[key: string]: Layout[]}) => void;
  onToggleFolder: (id: string) => void;
  theme: 'light' | 'dark';
  onDragStart: (layout: Layout[], oldItem: Layout) => void;
  onDragStop: () => void;
  onResizeStop: () => void;
  setDraggingWidgetId: (id: string | null) => void;
}

const FolderWidget: React.FC<FolderWidgetProps> = ({ 
    widget, allWidgets, renderWidget, onUpdateWidgetData, 
    onRemoveWidget, onInitiateAddWidget, onChildrenLayoutChange, onToggleFolder,
    theme, onDragStart, onDragStop, onResizeStop
}) => {
  const data = widget.data as FolderData;
  const { isCollapsed, childrenLayouts } = data;
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  
  const childrenWidgets = useMemo(() => {
    return allWidgets.filter(w => w.parentId === widget.id);
  }, [allWidgets, widget.id]);

  const handleLayoutUpdate = (layout: Layout[], allLayouts: {[key: string]: Layout[]}) => {
      onChildrenLayoutChange(widget.id, allLayouts);
  };
  
  const handleResize = (layout: Layout[], oldItem: Layout, newItem: Layout) => {
      const newAllLayouts = {
          ...(childrenLayouts || {}),
          [currentBreakpoint]: layout,
      };
      onChildrenLayoutChange(widget.id, newAllLayouts);
  };

  const processedChildrenLayouts = useMemo(() => {
    const newLayouts = JSON.parse(JSON.stringify(childrenLayouts || {}));
    Object.keys(newLayouts).forEach(bp => {
      newLayouts[bp] = newLayouts[bp]?.map((item: Layout) => {
        const childWidget = childrenWidgets.find(w => w.id === item.i);
        if (childWidget) {
          const defaults = WIDGET_DEFAULTS[childWidget.type];
          return { 
            ...item, 
            minW: (defaults.minW || 1) * 2, 
            minH: (defaults.minH || 1) * 2
          };
        }
        return item;
      }) || [];
    });
    return newLayouts;
  }, [childrenLayouts, childrenWidgets]);

  return (
    <div className="h-full w-full flex flex-col pt-2 -m-4 -mb-2 nested-grid">
      <AnimatePresence initial={false}>
      {!isCollapsed && (
        <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
                open: { opacity: 1, height: 'auto' },
                collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden flex flex-col flex-grow"
        >
          {childrenWidgets.length === 0 ? (
            <div className="w-full h-full flex-grow p-4 flex">
                <div className="w-full h-full rounded-2xl bg-black/5 dark:bg-white/5 border-2 border-dashed border-accent/50 flex flex-col items-center justify-center p-8">
                    <p className="text-center text-light-text-secondary dark:text-dark-text/60 mb-4 px-4">
                        Эта папка пуста. Добавьте в нее виджеты.
                    </p>
                    <button
                        onClick={() => onInitiateAddWidget(widget.id)}
                        className="flex items-center gap-3 bg-accent hover:bg-accent-dark text-dark-bg font-bold dark:bg-accent dark:hover:bg-accent-dark dark:text-dark-bg transition-all duration-300 px-6 py-3 rounded-xl text-base shadow-lg hover:shadow-glow-violet transform hover:scale-105 no-drag"
                    >
                        <Plus size={20} />
                        <span>Добавить виджет</span>
                    </button>
                </div>
            </div>
          ) : (
            <div className="flex-grow">
              <ResponsiveGridLayout
                  layouts={processedChildrenLayouts}
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={NESTED_GRID_COLS}
                  rowHeight={21}
                  compactType="vertical"
                  onLayoutChange={handleLayoutUpdate}
                  onResize={handleResize}
                  onBreakpointChange={setCurrentBreakpoint}
                  draggableHandle=".drag-handle"
                  draggableCancel=".no-drag, input, textarea, button, select"
                  isDroppable={true}
                  margin={[8, 8]}
                  isBounded={true}
                  onDragStart={onDragStart}
                  onDragStop={onDragStop}
                  onResizeStop={onResizeStop}
              >
                  {childrenWidgets.map(child => (
                      <div key={child.id} id={`widget-${child.id}`} className="cursor-auto">
                          <WidgetWrapper
                              onRemove={() => onRemoveWidget(child.id)}
                              widgetId={child.id}
                              widgetTitle={child.data.title || 'widget'}
                              onTitleChange={(newTitle) => onUpdateWidgetData(child.id, {...child.data, title: newTitle})}
                              theme={theme}
                              isFolder={child.type === WidgetType.Folder}
                              folderData={child.type === WidgetType.Folder ? (child.data as FolderData) : undefined}
                              folderColor={child.type === WidgetType.Folder ? (child.data as FolderData).color : undefined}
                              onFolderColorChange={child.type === WidgetType.Folder ? (newColor) => onUpdateWidgetData(child.id, { ...child.data, color: newColor }) : undefined}
                              onFolderToggle={() => onToggleFolder(child.id)}
                              onFolderAddWidget={child.type === WidgetType.Folder ? () => onInitiateAddWidget(child.id) : undefined}
                          >
                              <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Загрузка...</div>}>
                                {renderWidget(child, allWidgets)}
                              </Suspense>
                          </WidgetWrapper>
                      </div>
                  ))}
              </ResponsiveGridLayout>
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(FolderWidget);