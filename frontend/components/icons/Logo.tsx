import React from 'react';

export const Logo: React.FC<{
  className?: string;
  size?: 'sm' | 'lg';
}> = ({ className, size = 'lg' }) => {
  const containerSize = size === 'lg' ? 'h-16 w-16' : 'h-8 w-8';
  const textSize = size === 'lg' ? 'text-5xl' : 'text-2xl';
  const tnColor = size === 'lg' ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400';
  const space = size === 'lg' ? 'space-x-3' : 'space-x-2';

  return (
    <div className={`flex items-center ${space} ${className}`}>
      <div className={`relative ${containerSize}`}>
        <svg
          className="absolute h-full w-full text-indigo-600 dark:text-indigo-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <svg
          className="absolute h-full w-full text-white dark:text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2.5"
          style={{
            transform: 'scale(0.5) translate(24%, 24%)',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        >
          <path d="M9 18l6-6-6-6"></path>
        </svg>
      </div>
      <span className={`${textSize} font-bold`}>
        <span className="text-indigo-600 dark:text-indigo-400">Transit</span>
        <span className={`${tnColor} font-light`}>TN</span>
      </span>
    </div>
  );
};