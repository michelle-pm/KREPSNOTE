import React from 'react';
import { TextData } from '../../types';

interface TextWidgetProps {
  data: TextData;
  updateData: (data: TextData) => void;
}

const TextWidget: React.FC<TextWidgetProps> = ({ data, updateData }) => {
  const { content } = data;

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    event.target.select();
  };

  return (
    <div className="h-full flex flex-col">
      <textarea
        value={content}
        onChange={(e) => updateData({ ...data, content: e.target.value })}
        onFocus={handleFocus}
        className="flex-grow w-full bg-transparent resize-none text-sm text-light-text/80 dark:text-dark-text/80 focus:outline-none leading-relaxed p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
        placeholder="Введите ваш текст здесь..."
      />
    </div>
  );
};

export default React.memo(TextWidget);