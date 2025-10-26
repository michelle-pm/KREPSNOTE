import React, { useRef } from 'react';
import { TitleData } from '../../types';
import useResizeObserver from '../../hooks/useResizeObserver';

interface TitleWidgetProps {
  data: TitleData;
  updateData: (data: TitleData) => void;
}

const TitleWidget: React.FC<TitleWidgetProps> = ({ data, updateData }) => {
  const { title } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResizeObserver(containerRef);
  
  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    event.target.select();
  };

  const calculateFontSize = (containerWidth: number, containerHeight: number): string => {
    if (!containerWidth || !containerHeight) return '2.25rem'; // Default: text-4xl
    const vw = containerWidth / 100;
    // This formula creates a fluid font size that grows with the container width
    const fontSizeFromWidth = Math.max(16, Math.min(vw * 7.5, 48));
    // Add a constraint based on height. Font size shouldn't exceed 70% of height.
    const fontSizeFromHeight = containerHeight * 0.7;
    return `${Math.min(fontSizeFromWidth, fontSizeFromHeight)}px`;
  };

  return (
    <div ref={containerRef} className="h-full w-full grid place-items-center p-0 overflow-hidden">
      <textarea
        value={title}
        rows={1}
        onChange={(e) => updateData({ ...data, title: e.target.value })}
        onFocus={handleFocus}
        style={{ fontSize: calculateFontSize(width, height) }}
        className="w-full bg-transparent resize-none font-bold text-center text-light-text dark:text-dark-text focus:outline-none hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors rounded-lg flex items-center justify-center overflow-hidden p-2 leading-tight"
        placeholder="Заголовок"
      />
    </div>
  );
};

export default React.memo(TitleWidget);