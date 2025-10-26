import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieData } from '../../types';

interface PieWidgetProps {
  data: PieData;
  updateData: (data: PieData) => void;
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

const PieWidget: React.FC<PieWidgetProps> = ({ data, updateData }) => {
  const { total, part, totalLabel, partLabel, color1, color2 } = data;

  const percentage = useMemo(() => {
    if (total <= 0) return 0;
    const value = (part / total) * 100;
    return Math.max(0, Math.min(100, value));
  }, [total, part]);

  const chartData = [
    { name: partLabel, value: part },
    { name: 'Остальные', value: Math.max(0, total - part) },
  ];
  
  const handleUpdate = (field: keyof Omit<PieData, 'title'>, value: string | number) => {
    let new_data: PieData = { ...data, [field]: value };
    if (field === 'total' || field === 'part') {
      new_data[field] = parseFloat(value as string) || 0;
    }
    if (field === 'color1' || field === 'color2') {
        new_data.userSetColors = true;
    }
    updateData(new_data);
  };
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  return (
    <div className="w-full h-full flex flex-col text-sm">
      <div className="relative w-full flex-grow">
        <div className="absolute top-0 right-0 flex items-center gap-2 z-10">
            <ColorPicker color={color1} onChange={(c) => handleUpdate('color1', c)} />
            <ColorPicker color={color2} onChange={(c) => handleUpdate('color2', c)} />
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
                <linearGradient id={`pieGradient-${data.color1}-${data.color2}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color1} stopOpacity={1}/>
                <stop offset="100%" stopColor={color2} stopOpacity={1}/>
                </linearGradient>
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={'65%'}
              outerRadius={'90%'}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
              cornerRadius={8}
            >
              <Cell fill={`url(#pieGradient-${data.color1}-${data.color2})`} stroke="none" />
              <Cell fill={data.color1 + '20'} stroke="none" />
            </Pie>
            <Tooltip 
                 contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    color: '#1F2937'
                }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-3xl font-bold" style={{color: color2}}>{percentage.toFixed(1)}%</div>
            <div className="text-xs text-light-text-secondary dark:text-dark-text/60">конверсия</div>
        </div>
      </div>
      <div className="flex justify-around items-center gap-4 mt-2">
         <div className="flex flex-col gap-1 w-1/2">
             <input value={totalLabel} onChange={e => handleUpdate('totalLabel', e.target.value)} onFocus={handleFocus} className="bg-transparent text-light-text-secondary dark:text-dark-text/60 focus:outline-none text-center text-xs p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors" />
             <input type="number" value={total} onChange={e => handleUpdate('total', e.target.value)} onFocus={handleFocus} className="bg-transparent w-full text-center focus:outline-none p-1 text-lg font-semibold rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors" />
         </div>
         <div className="flex flex-col gap-1 w-1/2">
             <input value={partLabel} onChange={e => handleUpdate('partLabel', e.target.value)} onFocus={handleFocus} className="bg-transparent text-light-text-secondary dark:text-dark-text/60 focus:outline-none text-center text-xs p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors" />
             <input type="number" value={part} onChange={e => handleUpdate('part', e.target.value)} onFocus={handleFocus} className="bg-transparent w-full text-center focus:outline-none p-1 text-lg font-semibold rounded-md hover:bg-black/5 dark:hover:bg-white/5 focus:bg-black/10 dark:focus:bg-white/10 transition-colors" />
         </div>
      </div>
    </div>
  );
};

export default React.memo(PieWidget);