
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineData, Widget, LineDataPoint } from '../../types';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import DependencySelector from '../DependencySelector';

interface LineWidgetProps {
  data: LineData;
  updateData: (data: LineData) => void;
  allWidgets: Widget[];
  currentWidgetId: string;
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

const LineWidget: React.FC<LineWidgetProps> = ({ data, updateData, allWidgets, currentWidgetId }) => {
  const { series, color, color2 } = data;
  const [editingSeriesName, setEditingSeriesName] = useState<string | null>(null);
  const [tempSeriesName, setTempSeriesName] = useState('');

  const handleUpdate = (field: keyof LineData, value: any) => {
    let new_data: LineData = { ...data, [field]: value };
    if (field === 'color' || field === 'color2') {
        new_data.userSetColors = true;
    }
    updateData(new_data);
  };
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  const updatePoint = (seriesName: string, pointId: string, newPointData: Partial<LineDataPoint>) => {
    const newSeries = series.map(s => {
      if (s.name === seriesName) {
        return {
          ...s,
          data: s.data.map(p => (p.id === pointId ? { ...p, ...newPointData } : p)),
        };
      }
      return s;
    });
    handleUpdate('series', newSeries);
  };
  
  const addPoint = (seriesName: string) => {
      const newPoint: LineDataPoint = { id: uuidv4(), x: 'New', y: 0 };
      const newSeries = series.map(s => {
          if (s.name === seriesName) {
              return { ...s, data: [...s.data, newPoint] };
          }
          return s;
      });
      handleUpdate('series', newSeries);
  };
  
  const deletePoint = (seriesName: string, pointId: string) => {
    const newSeries = series.map(s => {
        if (s.name === seriesName) {
            return { ...s, data: s.data.filter(p => p.id !== pointId) };
        }
        return s;
    });
    handleUpdate('series', newSeries);
  };
  
  const handleSeriesNameEditStart = (seriesName: string) => {
      setEditingSeriesName(seriesName);
      setTempSeriesName(seriesName);
  };
  
  const handleSeriesNameSave = (oldName: string) => {
      if (tempSeriesName.trim() && tempSeriesName.trim() !== oldName) {
          const newSeries = series.map(s => 
              s.name === oldName ? { ...s, name: tempSeriesName.trim() } : s
          );
          handleUpdate('series', newSeries);
      }
      setEditingSeriesName(null);
  };

  return (
    <div className="w-full h-full flex flex-col text-sm">
      <div className="w-full h-1/2 min-h-[150px] flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
                <linearGradient id={`lineGradient-${color}-${color2}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={color} />
                    <stop offset="100%" stopColor={color2} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="x" stroke="rgba(128, 128, 128, 0.7)" tick={{ fontSize: 12 }} />
            <YAxis stroke="rgba(128, 128, 128, 0.7)" tick={{ fontSize: 12 }} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                }}
            />
            <Legend />
            {series.map(s => (
                <Line key={s.name} type="monotone" dataKey="y" data={s.data} name={s.name} stroke={`url(#lineGradient-${color}-${color2})`} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full flex-grow overflow-y-auto mt-4 pr-2 text-sm">
          <div className="flex justify-end items-center mb-2 px-1">
              <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">Цвета:</label>
                  <ColorPicker color={color} onChange={(c) => handleUpdate('color', c)} />
                  <ColorPicker color={color2} onChange={(c) => handleUpdate('color2', c)} />
              </div>
          </div>
          {series.map(s => (
              <div key={s.name} className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                      {editingSeriesName === s.name ? (
                        <input 
                            value={tempSeriesName}
                            onChange={(e) => setTempSeriesName(e.target.value)}
                            onBlur={() => handleSeriesNameSave(s.name)}
                            onKeyDown={e => e.key === 'Enter' && handleSeriesNameSave(s.name)}
                            className="font-bold text-lg bg-transparent p-1 rounded-md focus:outline-none focus:bg-black/10 dark:focus:bg-white/10"
                            autoFocus
                        />
                      ) : (
                        <h4 className="font-bold text-lg flex-grow">{s.name}</h4>
                      )}
                      <button onClick={() => editingSeriesName === s.name ? handleSeriesNameSave(s.name) : handleSeriesNameEditStart(s.name)} className="p-1 text-gray-400 hover:text-accent">
                          {editingSeriesName === s.name ? <Save size={16}/> : <Edit size={16}/>}
                      </button>
                      <button onClick={() => addPoint(s.name)} className="p-1 text-gray-400 hover:text-accent">
                          <Plus size={16} />
                      </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {s.data.map(point => (
                        <motion.div layout key={point.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                            <input 
                              type="text"
                              value={point.x}
                              placeholder="Label"
                              onChange={e => updatePoint(s.name, point.id, { x: e.target.value })}
                              onFocus={handleFocus}
                              className="bg-transparent p-1 rounded-md flex-grow min-w-[80px] hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:bg-black/10 dark:focus:bg-white/10"
                            />
                            <input
                              type="number"
                              value={point.y}
                              placeholder="Value"
                              onChange={e => updatePoint(s.name, point.id, { y: parseFloat(e.target.value) || 0 })}
                              onFocus={handleFocus}
                              disabled={!!point.dependency}
                              className="bg-transparent p-1 rounded-md w-20 hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:bg-black/10 dark:focus:bg-white/10 disabled:opacity-50"
                            />
                            <div className="flex-grow min-w-[150px]">
                                <DependencySelector 
                                  allWidgets={allWidgets}
                                  currentWidgetId={currentWidgetId}
                                  value={point.dependency}
                                  onChange={dep => updatePoint(s.name, point.id, { dependency: dep })}
                                />
                            </div>
                            <button onClick={() => deletePoint(s.name, point.id)} className="text-gray-400 hover:text-red-500 p-1">
                                <Trash2 size={14}/>
                            </button>
                        </motion.div>
                    ))}
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default React.memo(LineWidget);
