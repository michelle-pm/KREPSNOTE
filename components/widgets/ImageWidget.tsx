import React, { useRef } from 'react';
import { ImageData } from '../../types';
import { Upload, X } from 'lucide-react';

interface ImageWidgetProps {
  data: ImageData;
  updateData: (data: ImageData) => void;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ data, updateData }) => {
  const { title, src } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof ImageData, value: string | null) => {
    updateData({ ...data, [field]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdate('src', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdate('src', null);
  }

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex-grow relative flex items-center justify-center rounded-2xl bg-white/20 dark:bg-white/5 overflow-hidden">
        {src ? (
          <>
            <img src={src} alt={title} className="w-full h-full object-contain" />
            <button
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-red-500 transition-colors"
                aria-label="Удалить изображение"
            >
                <X size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={triggerFileInput}
            className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-white/30 dark:border-white/20 hover:border-accent transition-colors rounded-2xl text-light-text-secondary dark:text-dark-text/60 hover:text-accent"
          >
            <Upload size={48} />
            <span className="mt-2 font-semibold">Загрузить изображение</span>
          </button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default React.memo(ImageWidget);