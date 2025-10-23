import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useI18n } from '../hooks/useI18n';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  const { t } = useI18n();
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      onClose();
    } catch (err) {
      setError(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm p-6 relative text-gray-900 dark:text-gray-100" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">{t('login')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('username')}</label>
            <input 
              id="login-username"
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('username')}
              className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
              required 
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('password')}</label>
            <div className="relative mt-1">
              <input 
                id="login-password"
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" 
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
          >
            {isLoading ? `${t('login')}...` : t('login')}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">{t('orSeparator')}</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <div className="space-y-3">
            <button type="button" disabled title={t('comingSoon')} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 opacity-50 cursor-not-allowed">
                <i className="fab fa-google text-lg mr-2 rtl:ml-2"></i>
                {t('continueWithGoogle')}
            </button>
            <button type="button" disabled title={t('comingSoon')} className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white opacity-50 cursor-not-allowed">
                <i className="fab fa-facebook-f text-lg mr-2 rtl:ml-2"></i>
                {t('continueWithFacebook')}
            </button>
            <button type="button" disabled title={t('comingSoon')} className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-black text-sm font-medium text-white opacity-50 cursor-not-allowed dark:bg-gray-200 dark:text-black">
                <i className="fab fa-apple text-lg mr-2 rtl:ml-2"></i>
                {t('continueWithApple')}
            </button>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {t('noAccount')}{' '}
          <button onClick={onSwitchToSignUp} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            {t('signUp')}
          </button>
        </p>

      </div>
    </div>
  );
};