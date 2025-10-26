import React from 'react';
import { ArticleData } from '../../types';

interface ArticleWidgetProps {
  data: ArticleData;
  updateData: (data: ArticleData) => void;
}

const ArticleWidget: React.FC<ArticleWidgetProps> = ({ data, updateData }) => {
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
        className="flex-grow w-full bg-transparent resize-none text-base text-light-text/90 dark:text-dark-text/90 focus:outline-none leading-relaxed p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
        placeholder="Начните писать вашу статью здесь..."
      />
    </div>
  );
};

export default React.memo(ArticleWidget);