import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useI18n } from '../hooks/useI18n';
import { UserRole } from '../types';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { t } = useI18n();
  const { signUp } = useAppContext();
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: UserRole.USER,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const checkPasswordStrength = (password: string) => {
    setPasswordValidity({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') {
        checkPasswordStrength(value);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    
    const isPasswordStrong = Object.values(passwordValidity).every(Boolean);
    if (!isPasswordStrong) {
        setError(t('passwordIsWeak'));
        return;
    }

    setError('');
    setIsLoading(true);
    try {
      await signUp({
          displayName: formData.displayName,
          username: formData.username,
          password: formData.password,
          role: formData.role,
      });
      onClose(); // Close modal on successful sign-up
    } catch (err: any) {
        if (err.message === 'Username already exists') {
            setError(t('usernameExists'));
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const PasswordRequirement = ({ label, isValid }: { label: string; isValid: boolean }) => (
    <li className={`flex items-center text-xs transition-colors ${isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
        <i className={`fas ${isValid ? 'fa-check-circle' : 'fa-times-circle'} mr-2 rtl:ml-2`}></i>
        <span>{label}</span>
    </li>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col max-h-[90vh] text-gray-900 dark:text-gray-100" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 pb-4 border-b dark:border-gray-700 flex-shrink-0 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
            <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">{t('signUp')}</h2>
        </div>
        
        <div className="overflow-y-auto flex-grow p-6">
            <form id="signUpForm" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('displayName')}</label>
                <input type="text" name="displayName" value={formData.displayName} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('username')}</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="mt-1 block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('password')}</label>
                <div className="relative mt-1">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {formData.password && (
                  <ul className="mt-2 space-y-1">
                    <PasswordRequirement label={t('passwordPolicyLength')} isValid={passwordValidity.length} />
                    <PasswordRequirement label={t('passwordPolicyUppercase')} isValid={passwordValidity.uppercase} />
                    <PasswordRequirement label={t('passwordPolicyLowercase')} isValid={passwordValidity.lowercase} />
                    <PasswordRequirement label={t('passwordPolicyNumber')} isValid={passwordValidity.number} />
                    <PasswordRequirement label={t('passwordPolicySpecial')} isValid={passwordValidity.special} />
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('confirmPassword')}</label>
                <div className="relative mt-1">
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="block w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-600 dark:text-white" required />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('iAmA')}</label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: UserRole.USER }))}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
                            ${formData.role === UserRole.USER
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-400 shadow-md'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}
                        `}
                    >
                        <i className={`fas fa-user text-3xl mb-2 ${formData.role === UserRole.USER ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}></i>
                        <span className={`text-sm font-semibold ${formData.role === UserRole.USER ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>{t('regularUser')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: UserRole.OPERATOR }))}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
                            ${formData.role === UserRole.OPERATOR
                                ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-400 shadow-md'
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}
                        `}
                    >
                        <i className={`fas fa-id-card text-3xl mb-2 ${formData.role === UserRole.OPERATOR ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}></i>
                        <span className={`text-sm font-semibold ${formData.role === UserRole.OPERATOR ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-700 dark:text-gray-300'}`}>{t('driverOperator')}</span>
                    </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
        </div>
        
        <div className="p-6 pt-4 border-t dark:border-gray-700 flex-shrink-0">
             <button 
                type="submit" 
                form="signUpForm"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
              >
                {isLoading ? `${t('createAccount')}...` : t('createAccount')}
              </button>

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
              {t('haveAccount')}{' '}
              <button onClick={onSwitchToLogin} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                {t('login')}
              </button>
            </p>
        </div>
      </div>
    </div>
  );
};
