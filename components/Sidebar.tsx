import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Moon, Sun, Plus, Trash2, FilePenLine, LogOut, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Workspace, User } from '../types';

interface SidebarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onSave: () => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onWorkspaceCreate: () => void;
  onWorkspaceDelete: (id: string) => void;
  onWorkspaceRename: (id: string, newName: string) => void;
  onWorkspaceSelect: (id: string) => void;
  user: User | null;
  onLogout: () => void;
  onOpenAccountSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    theme, toggleTheme, onSave, 
    workspaces, activeWorkspaceId, onWorkspaceCreate, onWorkspaceDelete, onWorkspaceRename, onWorkspaceSelect,
    user, onLogout, onOpenAccountSettings
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState('');

    const handleRenameStart = (workspace: Workspace) => {
        setEditingId(workspace.id);
        setTempName(workspace.name);
    };
    
    const handleRenameSave = () => {
        if (editingId && tempName.trim()) {
            onWorkspaceRename(editingId, tempName.trim());
        }
        setEditingId(null);
        setTempName('');
    };

  return (
    <motion.div
      className="fixed top-0 left-0 h-full w-72 bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/70 backdrop-blur-2xl z-40 shadow-2xl p-6 flex flex-col border-r border-light-border dark:border-dark-border"
      initial={{ x: '-100%' }}
      animate={{ x: '0%' }}
      exit={{ x: '-100%' }}
      transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
    >
      <div className="flex flex-col gap-4 overflow-y-auto flex-grow pr-2 -mr-2">
        <h2 className="text-2xl font-bold tracking-tight">Настройки</h2>
        
        <div className="border-t border-light-border dark:border-dark-border pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Пространства</h3>
              <button onClick={onWorkspaceCreate} className="p-1.5 rounded-md text-accent hover:bg-white/50 dark:hover:bg-white/10 transition-colors"><Plus size={18}/></button>
            </div>
            <div className="flex flex-col gap-2">
                {workspaces.map(ws => (
                    <div 
                        key={ws.id} 
                        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${activeWorkspaceId === ws.id ? 'bg-accent text-dark-bg dark:bg-accent/20 dark:text-accent font-semibold' : 'hover:bg-white/50 dark:hover:bg-white/10'}`}
                        onClick={() => onWorkspaceSelect(ws.id)}
                    >
                        {editingId === ws.id ? (
                            <input 
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onBlur={handleRenameSave}
                                onKeyDown={(e) => e.key === 'Enter' && handleRenameSave()}
                                className="bg-transparent outline-none w-full text-base"
                                autoFocus
                            />
                        ) : (
                            <span className="flex-grow truncate">{ws.name}</span>
                        )}
                        <div className={`flex items-center sm:text-transparent sm:group-hover:text-current ${activeWorkspaceId === ws.id ? (theme === 'dark' ? 'text-accent' : 'text-dark-bg') : 'text-light-text-secondary dark:text-dark-text/60'}`}>
                           <button onClick={(e) => { e.stopPropagation(); handleRenameStart(ws); }} className="p-1 rounded-md hover:bg-black/20 dark:hover:bg-white/20"><FilePenLine size={14}/></button>
                           <button onClick={(e) => { e.stopPropagation(); onWorkspaceDelete(ws.id); }} className="p-1 rounded-md hover:bg-black/20 dark:hover:bg-white/20"><Trash2 size={14}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="border-t border-light-border dark:border-dark-border pt-4 mt-auto">
            <h3 className="font-semibold mb-2">Тема оформления</h3>
            <div className="flex justify-between items-center p-2 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'light' ? 'Светлая' : 'Темная'}</span>
                </div>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </div>

        <div className="border-t border-light-border dark:border-dark-border pt-4">
            <h3 className="font-semibold mb-2">Экспорт</h3>
             <button 
                onClick={onSave} 
                className="w-full flex items-center justify-center gap-3 bg-accent/80 hover:bg-accent text-dark-bg dark:bg-accent dark:hover:bg-accent-dark dark:text-dark-bg transition-all duration-200 px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
                <Image size={20} />
                <span>Сохранить как PNG</span>
            </button>
        </div>
      </div>
      
      <div className="border-t border-light-border dark:border-dark-border pt-4 mt-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-dark-bg flex-shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow overflow-hidden">
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text/60 truncate">{user?.email}</p>
          </div>
           <button onClick={onOpenAccountSettings} title="Настройки аккаунта" className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            <Settings size={20} className="text-light-text-secondary dark:text-dark-text/60" />
          </button>
          <button onClick={onLogout} title="Выйти" className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            <LogOut size={20} className="text-light-text-secondary dark:text-dark-text/60 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
