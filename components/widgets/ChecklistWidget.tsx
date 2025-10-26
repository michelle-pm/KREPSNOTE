

import React, { useState } from 'react';
import { ChecklistData, ChecklistItem } from '../../types';
import { Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gradients } from '../../utils/colors';

interface ChecklistWidgetProps {
  data: ChecklistData;
  updateData: (data: ChecklistData) => void;
}

const CustomCheckbox = ({ completed, onToggle }: { completed: boolean; onToggle: () => void }) => {
    const accentGradient = `linear-gradient(45deg, ${gradients[10].color}, ${gradients[10].color2})`;
    
    const variants = {
        checked: { background: accentGradient, scale: 1, borderColor: 'transparent' },
        unchecked: { background: 'transparent', scale: 1 }
    };

    return (
        <motion.div
            onClick={onToggle}
            className={`w-6 h-6 rounded-full border-2 flex-shrink-0 cursor-pointer flex items-center justify-center transition-colors border-gray-400 dark:border-gray-500 group-hover:border-accent`}
            animate={completed ? "checked" : "unchecked"}
            variants={variants}
            transition={{ duration: 0.2 }}
        >
            <AnimatePresence>
                {completed && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        <Check size={16} className="text-white" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


const ChecklistWidget: React.FC<ChecklistWidgetProps> = ({ data, updateData }) => {
  const { items } = data;
  const [newItemText, setNewItemText] = useState('');

  const handleUpdate = (field: keyof ChecklistData, value: any) => {
    updateData({ ...data, [field]: value });
  };

  const addItem = () => {
    if (newItemText.trim() === '') return;
    const newItem: ChecklistItem = {
      id: `item_${Date.now()}`,
      text: newItemText.trim(),
      completed: false,
    };
    handleUpdate('items', [...items, newItem]);
    setNewItemText('');
  };

  const toggleItem = (id: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    handleUpdate('items', newItems);
  };

  const deleteItem = (id: string) => {
    handleUpdate('items', items.filter(item => item.id !== id));
  };

  const updateItemText = (id: string, text: string) => {
    const newItems = items.map(item =>
        item.id === id ? { ...item, text } : item
    );
    handleUpdate('items', newItems);
  }
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="flex-grow overflow-y-auto pr-2">
        <AnimatePresence>
            {items.map(item => (
            <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="group flex items-center gap-4 mb-3"
            >
                <CustomCheckbox completed={item.completed} onToggle={() => toggleItem(item.id)} />
                <input 
                    value={item.text}
                    onChange={(e) => updateItemText(item.id, e.target.value)}
                    onFocus={handleFocus}
                    className={`flex-grow bg-transparent focus:outline-none p-1 transition-colors font-semibold text-base text-light-text dark:text-dark-text ${item.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                />
                <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 transition-opacity">
                    <Trash2 size={18} />
                </button>
            </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <form
        onSubmit={(e) => {
            e.preventDefault();
            addItem();
        }}
        className="mt-4 border-t border-light-border dark:border-dark-border pt-3"
      >
        <div className="flex items-center gap-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 focus-within:bg-black/5 dark:focus-within:bg-white/5 transition-colors">
            <Plus size={24} className="text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
            <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Добавить новую задачу..."
            className="flex-grow bg-transparent focus:outline-none p-1 font-semibold text-base placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
        </div>
      </form>
    </div>
  );
};

export default React.memo(ChecklistWidget);
