'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  location: string;
  joinDate: string;
  avatar: string;
  bio: string;
}

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const mode = searchParams.get('mode');
  
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  });

  useEffect(() => {
    setIsLogin(mode !== 'signup');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll just simulate a successful login/signup
    console.log('Form submitted:', { isLogin, formData });
    
    // Get existing users
    const allUsers = JSON.parse(localStorage.getItem('users') || '{}') as Record<string, UserData>;
    let userId = '';
    let userName = '';

    // Find user by email
    const userEntry = Object.entries(allUsers).find(([_, userData]) => userData.email === formData.email);
    
    if (userEntry) {
      // User exists
      userId = userEntry[0];
      userName = userEntry[1].name;
    } else {
      // Create new user if signing up
      if (!isLogin) {
        userId = Date.now().toString();
        const userData = {
          id: userId,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: '',
          joinDate: new Date().toISOString(),
          avatar: '/default-avatar.png',
          bio: `${formData.name} is a member of our film gear lending community.`
        };
        
        allUsers[userId] = userData;
        localStorage.setItem('users', JSON.stringify(allUsers));
        userName = formData.name;

        // Initialize empty arrays for user's data
        localStorage.setItem(`userListings_${userId}`, JSON.stringify([]));
        localStorage.setItem(`userFavorites_${userId}`, JSON.stringify([]));
        localStorage.setItem(`userReviews_${userId}`, JSON.stringify([]));
      } else {
        alert('User not found. Please sign up first.');
        return;
      }
    }
    
    // Store the user's session data
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('isAuthenticated', 'true');
    
    // Trigger a storage event for other components to update
    window.dispatchEvent(new Event('storage'));
    
    // Redirect back to homepage or the return URL
    router.push(returnTo === '/dashboard' ? '/' : returnTo);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-2xl font-bold text-white">Crew<span className="text-yellow-400">Mate</span></span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isLogin ? 'Sign in to your account' : 'Create your account'}
        </h2>
        <div className="mt-2 text-center">
          <button
            onClick={() => {
              const newMode = isLogin ? 'signup' : 'login';
              router.push(`/auth/login${newMode === 'signup' ? '?mode=signup' : ''}`);
            }}
            className="font-medium text-yellow-400 hover:text-yellow-300"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-700 rounded bg-gray-800"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-yellow-400 hover:text-yellow-300">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 