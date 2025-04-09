// pages/LoginPage.jsx
import React, { useState } from 'react';
import { AtSign, Lock, AlertCircle } from 'lucide-react';

export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset error
    setError('');
    setIsLoading(true);

    // Validate email domain is @reply.it
    if (!email.endsWith('@reply.it')) {
      setError('Only Reply employees are allowed to access this platform.');
      setIsLoading(false);
      return;
    }

    // Validate password
    if (password !== '123stella') {
      setError('Invalid password. Please try again.');
      setIsLoading(false);
      return;
    }

    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);

      // Get initials from email
      const emailName = email.split('@')[0];
      const nameParts = emailName.split('.');
      const initials = nameParts
        .map((part) => part.charAt(0).toUpperCase())
        .join('');

      // Call login callback with user info
      onLogin({
        email,
        name: email.split('@')[0].replace('.', ' '),
        initials,
      });
    }, 800);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center'>
      <div className='max-w-md w-full mx-auto'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M12 2a8 8 0 0 0-8 8c0 1.5.4 2.9 1 4.2.6 1.3 1.5 2.4 2.6 3.3L12 21l4.4-3.5c1.1-.9 2-2 2.6-3.3.6-1.3 1-2.7 1-4.2a8 8 0 0 0-8-8z'></path>
                <circle cx='12' cy='10' r='3'></circle>
              </svg>
            </div>
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>
            MultiAgent Platform
          </h1>
          <p className='text-gray-600 mt-2'>Sign in to your account</p>
        </div>

        <div className='bg-white rounded-lg shadow-xl overflow-hidden p-8'>
          {error && (
            <div className='mb-6 bg-red-50 text-red-700 p-4 rounded-md flex items-start'>
              <AlertCircle className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address
              </label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <AtSign className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='name@reply.it'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
                />
              </div>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Password
              </label>
              <div className='relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className='mt-6 text-center text-xs text-gray-500'>
            <p>Use your Reply corporate email to access the platform.</p>
          </div>
        </div>

        <div className='mt-8 text-center text-sm text-gray-600'>
          <p>© 2025 Reply. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
