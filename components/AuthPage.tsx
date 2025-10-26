import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Требуется адрес электронной почты.');
      return;
    }
    if (!password) {
        setError('Требуется пароль.');
        return;
    }
    if (!isLoginView && !name) {
      setError('Для регистрации требуется имя.');
      return;
    }

    try {
      if (isLoginView) {
        login(email, password);
      } else {
        register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-accent to-pastel-blue mb-2">KREPSNOTE</h1>
            <p className="text-lg text-light-text-secondary dark:text-dark-text/60">Войдите, чтобы продолжить</p>
        </div>

        <motion.div 
            layout
            className="bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/70 backdrop-blur-2xl rounded-3xl shadow-soft-light dark:shadow-glass-dark p-8"
        >
            <div className="flex justify-center border-b border-light-border dark:border-dark-border mb-6">
                <button onClick={() => setIsLoginView(true)} className={`px-4 py-2 text-lg font-semibold relative transition-colors ${isLoginView ? 'text-light-text dark:text-dark-text' : 'text-light-text-secondary dark:text-dark-text/60'}`}>
                    Вход
                    {isLoginView && <motion.div layoutId="auth-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                </button>
                <button onClick={() => setIsLoginView(false)} className={`px-4 py-2 text-lg font-semibold relative transition-colors ${!isLoginView ? 'text-light-text dark:text-dark-text' : 'text-light-text-secondary dark:text-dark-text/60'}`}>
                    Регистрация
                    {!isLoginView && <motion.div layoutId="auth-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
                </button>
            </div>
            
            <AnimatePresence mode="wait">
                <motion.form 
                    key={isLoginView ? 'login' : 'register'}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleSubmit} 
                    className="flex flex-col gap-4"
                >
                    {!isLoginView && (
                         <div>
                            <label className="block text-sm font-medium mb-1">Имя</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all text-base" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Пароль</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                placeholder="••••••••" 
                                className="w-full p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-accent transition-all pr-10 text-base" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-light-text-secondary dark:text-dark-text/60"
                                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="w-full mt-4 p-3 bg-accent hover:bg-accent-dark text-dark-bg font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-glow-violet transform hover:-translate-y-0.5">
                        {isLoginView ? 'Войти' : 'Создать аккаунт'}
                    </button>
                </motion.form>
            </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
