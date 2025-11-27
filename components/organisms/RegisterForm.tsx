'use client';

import React, { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authRegister } from '@/lib/api';

const RegisterForm: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = username.trim() !== '' && 
                      email.trim() !== '' &&
                      password.trim() !== '' && 
                      confirmPassword.trim() !== '';

  const isDisabled = loading || !isFormValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Le password non corrispondono.");
      setLoading(false);
      return;
    }

    try {
      await authRegister(username, password, email); 
      alert("Registrazione completata e sessione avviata! Benvenuto nel tuo Feed.");
      router.push('/');
      
    } catch (err) {
      console.error("Errore di registrazione:", err);
      
      let errorMessage = "Si è verificato un errore sconosciuto durante la registrazione.";

      if (err && (err as any).status) {
          const apiError = err as any;
          
          switch (apiError.status) {
              case 400:
                  errorMessage = apiError.message;
                  break;
                  
              case 500:
                  errorMessage = "Errore interno del server. Riprova più tardi.";
                  break;
                  
              default:
                  errorMessage = apiError.message || errorMessage;
          }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      p-10             
      border             
      border-gray-800    
      rounded-xl         
      shadow-2xl         
      bg-[#0f172b]       
      max-w-md           
      mx-auto            
    ">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Crea un account</h2>
      <h6 className="text-s text-gray-400 mb-3 text-center">Inserisci i tuoi dati per registrarti</h6>
      
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

        <label htmlFor="email" className="text-sm text-gray-400 mb-3 block">Email</label>
        <Input 
          type="email" 
          placeholder="nome@esempio.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
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
        
        <label htmlFor="confirm-password" className="text-sm text-gray-400 mb-3 block">Conferma password</label>
        <Input 
          type="password" 
          placeholder="*******" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
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
          {loading ? 'Registrazione...' : 'Continua'}
        </button>

        <div className="flex justify-center space-x-1">
          <h6 className="text-s text-gray-400 text-center">Hai già un account?</h6>
          <Link href="/login" className="text-s text-blue-500 underline">Accedi</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;