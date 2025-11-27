'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authLogin } from '@/lib/api'; 

const LoginForm: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = loading || username.trim() === '' || password.trim() === '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    setLoading(true);
    setError(null);

    try {
      const data = await authLogin(username, password); 

      if (data.requires_otp) {
        
        sessionStorage.setItem('tempToken', data.temp_token); 
        
        router.push('/otp-verification'); 

      } else {
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user)); 

        router.push('/'); 
      }

    } catch (err) {
      console.error("Errore di Login:", err);
      const apiError = err as any; 
      
      let errorMessage = "Credenziali non valide. Riprova.";

      if (apiError.status === 400 || apiError.status === 401) {
          errorMessage = apiError.message; 
      } else if (apiError.status === 500) {
          errorMessage = "Errore interno del server. Riprova più tardi.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      p-10 border border-gray-800 rounded-xl shadow-2xl bg-[#0f172b] max-w-md mx-auto
    ">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Accedi</h2>
      
      {error && (
        <div className="text-red-500 bg-red-900/30 p-3 rounded text-sm border border-red-500 text-center mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <label htmlFor="username" className="text-sm text-gray-400 mb-3 block">Username</label>
        <Input 
          type="text" 
          placeholder="username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        
        <label htmlFor="password" className="text-sm text-gray-400 mb-3 block">Password</label>
        <Input 
          type="password" 
          placeholder="*******" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <button
          type="submit"
          disabled={isDisabled}
          className={`
            w-full py-3 rounded-full transition-colors mt-6 font-bold text-white
            ${isDisabled ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </button>

        <div className="flex justify-center space-x-1">
          <h6 className="text-s text-gray-400 text-center">Non hai un account?</h6>
          <Link href="/register" className="text-s text-blue-500 underline">Registrati</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;