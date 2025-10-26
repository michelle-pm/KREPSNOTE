import React, { useMemo, useState, useEffect } from 'react';
import { PlanData } from '../../types';
import Confetti from '../Confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanWidgetProps {
  data: PlanData;
  updateData: (data: PlanData) => void;
}

const ColorPicker: React.FC<{color: string, onChange: (color: string) => void}> = ({ color, onChange }) => (
    <div className="relative w-6 h-6 rounded-full border border-light-border dark:border-dark-border cursor-pointer" style={{ backgroundColor: color }}>
        <input 
            type="color" 
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer no-drag"
        />
    </div>
);


const PlanWidget: React.FC<PlanWidgetProps> = ({ data, updateData }) => {
  const { current, target, unit, customUnit, color, color2 } = data;
  const [showConfetti, setShowConfetti] = useState(false);

  const percentage = useMemo(() => {
    if (unit === '%') {
        return Math.min(Math.max(current, 0), 100);
    }
    if (target <= 0) return 0;
    return Math.min(Math.max((current / target) * 100, 0), 100);
  }, [current, target, unit]);

  useEffect(() => {
    if (percentage >= 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [percentage]);
  
  const handleUpdate = (field: keyof PlanData, value: string | number) => {
    let new_data: PlanData = {...data, [field]: value}
    if (field === 'current' || field === 'target') {
        new_data = {...new_data, [field]: parseFloat(value as string) || 0}
    }
    if (field === 'color' || field === 'color2') {
        new_data.userSetColors = true;
    }
    updateData(new_data);
  };
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  return (
    <div className="h-full flex flex-col relative text-sm">
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>
      <div className="absolute top-0 right-0 flex items-center gap-2 z-10">
         <ColorPicker color={color} onChange={(c) => handleUpdate('color', c)} />
         <ColorPicker color={color2} onChange={(c) => handleUpdate('color2', c)} />
      </div>
      
      <div className="flex-grow flex flex-col justify-center">
        <div className="flex flex-col justify-center items-center">
            <div className="text-center font-bold text-5xl md:text-6xl">
                <span 
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color2})` }}
                >
                    {percentage.toFixed(0)}%
                </span>
            </div>
        </div>

        <div className="w-full mt-4">
            <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                <motion.div
                    className="h-3 rounded-full"
                    style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color2})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />
            </div>

            <div className={`grid ${unit === '%' ? 'grid-cols-1' : 'grid-cols-2'} gap-4 w-full font-medium mt-4`}>
                <div className="flex flex-col items-start gap-1">
                    <label className="text-light-text-secondary dark:text-dark-text/60 text-xs font-semibold px-1 w-full text-center">
                        {unit === '%' ? 'Процент выполнения' : 'Текущее значение'}
                    </label>
                    <input 
                        type="number" 
                        value={current}
                        onChange={(e) => handleUpdate('current', e.target.value)}
                        onFocus={handleFocus}
                        className="bg-transparent w-full text-center focus:outline-none p-1 text-lg font-semibold rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
                    />
                </div>
                <AnimatePresence>
                {unit !== '%' && (
                    <motion.div 
                        initial={{opacity:0}} 
                        animate={{opacity:1}} 
                        exit={{opacity:0}}
                        transition={{duration: 0.2}}
                        className="w-full"
                    >
                        <div className="flex flex-col items-start gap-1">
                            <label className="text-light-text-secondary dark:text-dark-text/60 text-xs font-semibold px-1 w-full text-center">Целевое значение</label>
                            <input 
                                type="number"
                                value={target}
                                onChange={(e) => handleUpdate('target', e.target.value)}
                                onFocus={handleFocus}
                                className="bg-transparent w-full text-center focus:outline-none p-1 text-lg font-semibold rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors"
                            />
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 w-full mt-1">
        <div className="flex items-center gap-1">
            <label className="text-light-text-secondary dark:text-dark-text/60 text-xs font-semibold whitespace-nowrap">Единицы:</label>
            <AnimatePresence>
            {unit === 'custom' && (
                <motion.div initial={{width: 0, opacity: 0}} animate={{width: 'auto', opacity: 1}} exit={{width: 0, opacity: 0}}>
                    <input 
                        type="text"
                        value={customUnit}
                        onChange={(e) => handleUpdate('customUnit', e.target.value)}
                        onFocus={handleFocus}
                        className="bg-transparent w-16 text-center font-semibold text-light-text-secondary dark:text-dark-text/80 focus:outline-none p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                        placeholder="Unit"
                    />
                </motion.div>
            )}
            </AnimatePresence>
            <select
                value={unit}
                onChange={(e) => handleUpdate('unit', e.target.value)}
                className="bg-transparent font-semibold text-light-text-secondary dark:text-dark-text/80 focus:outline-none no-drag p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            >
                <option value="%">%</option>
                <option value="₽">₽</option>
                <option value="custom">Другое</option>
            </select>
        </div>
    </div>

    </div>
  );
};

export default React.memo(PlanWidget);