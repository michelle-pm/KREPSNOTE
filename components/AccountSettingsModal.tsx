import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { X, KeyRound, UserPlus, Link, Copy, Check } from 'lucide-react';

interface AccountSettingsModalProps {
  onClose: () => void;
  activeWorkspaceName: string;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ onClose, activeWorkspaceName }) => {
  const { user, updateUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [shareLinkEnabled, setShareLinkEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Новые пароли не совпадают!");
      return;
    }
    // Mock logic: In a real app, this would be an API call.
    alert(`Пароль для пользователя ${user?.email} был изменен (демонстрация).`);
    onClose();
  };
  
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToInvite = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    alert(`Приглашение отправлено на ${emailToInvite} для просмотра доски "${activeWorkspaceName}". Обратите внимание: это демонстрационная функция, реальные письма не отправляются.`);
    (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value = '';
  }

  const publicLink = shareLinkEnabled ? `${window.location.origin}/share/${user?.id}/${activeWorkspaceName.replace(/\s+/g, '-')}` : '';
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        className="fixed inset-0 m-auto w-11/12 max-w-2xl h-fit max-h-[90vh] bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/70 backdrop-blur-2xl z-50 shadow-2xl p-8 rounded-4xl flex flex-col border border-light-border dark:border-dark-border"
      >
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h2 className="text-2xl font-bold">Настройки аккаунта</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col gap-8 overflow-y-auto pr-2 -mr-4">
          {/* Change Password Section */}
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-3"><KeyRound size={20} className="text-accent" /> Смена пароля</h3>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Старый пароль" className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base" />
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Новый пароль" className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Подтвердите новый пароль" className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base" />
                <button type="submit" className="self-start mt-2 px-6 py-2 bg-accent hover:bg-accent-dark text-dark-bg font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-glow-violet">
                    Сохранить
                </button>
            </form>
          </div>
          
          {/* Invite Users Section */}
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-3"><UserPlus size={20} className="text-accent" /> Пригласить в доску "{activeWorkspaceName}"</h3>
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <input name="email" type="email" placeholder="email@example.com" required className="flex-grow p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base" />
                <button type="submit" className="px-6 py-3 bg-accent hover:bg-accent-dark text-dark-bg font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-glow-violet">
                    Пригласить
                </button>
            </form>
             <p className="text-xs text-light-text-secondary dark:text-dark-text/60 mt-2">
                <b>Примечание:</b> Это демонстрационная функция. Реальные электронные письма не отправляются.
            </p>
          </div>

          {/* Share Section */}
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-3"><Link size={20} className="text-accent" /> Поделиться доской "{activeWorkspaceName}"</h3>
             <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-black/20">
                <label htmlFor="share-toggle" className="font-medium">Включить доступ по ссылке</label>
                <div
                    onClick={() => setShareLinkEnabled(!shareLinkEnabled)}
                    className={`flex items-center w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${shareLinkEnabled ? 'bg-accent' : 'bg-gray-400 dark:bg-gray-600'}`}
                >
                    <motion.div
                        id="share-toggle"
                        className="w-4 h-4 bg-white rounded-full shadow-md"
                        layout
                        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                        style={{ marginLeft: shareLinkEnabled ? 'auto' : '0' }}
                    />
                </div>
            </div>
             <AnimatePresence>
                {shareLinkEnabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="relative"
                    >
                        <input type="text" readOnly value={publicLink} className="w-full p-3 pr-12 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border text-base" />
                        <button onClick={copyToClipboard} className="absolute inset-y-0 right-0 px-3 flex items-center text-light-text-secondary dark:text-dark-text/60 hover:text-accent transition-colors">
                           {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <p className="text-xs text-light-text-secondary dark:text-dark-text/60 mt-2">Любой, у кого есть ссылка, сможет просматривать доску без входа в систему.</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AccountSettingsModal;
