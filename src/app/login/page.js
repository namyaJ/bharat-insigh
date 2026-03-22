'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';
import { LogIn, UserPlus, Mail, Lock, ArrowRight, Loader2, LineChart } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (!email || !password) { setError('Please fill in all fields.'); setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }

    if (isSignUp) {
      const { error: err } = await signUp(email, password);
      if (err) { setError(err.message); } else {
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setIsSignUp(false); setPassword('');
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) { setError(err.message); } else { router.push('/dashboard'); }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-8">
      {/* Ambient orbs */}
      <div className="fixed -top-36 -left-24 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] rounded-full blur-[60px] animate-pulse-glow pointer-events-none" />
      <div className="fixed -bottom-36 -right-24 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] rounded-full blur-[60px] animate-pulse-glow pointer-events-none" style={{ animationDelay: '1s' }} />

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-surface border border-border rounded-2xl p-10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5),0_0_40px_rgba(99,102,241,0.08)] animate-slide-up z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mx-auto mb-4">
            <LineChart size={22} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-gray-500">
            {isSignUp ? 'Sign up to access the GovData Analytics Platform' : 'Sign in to your analytics dashboard'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="px-3 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all">
              <Mail size={16} className="text-gray-500 shrink-0" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-gray-600 font-sans"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all">
              <Lock size={16} className="text-gray-500 shrink-0" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="flex-1 bg-transparent border-none text-white text-sm outline-none placeholder:text-gray-600 font-sans"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg font-semibold text-sm mt-1 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.15)] hover:translate-y-[-1px] hover:shadow-[0_6px_25px_rgba(99,102,241,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                {isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-gray-600 text-xs uppercase tracking-widest">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span>or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Toggle */}
        <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
          className="w-full text-center text-primary-light text-sm font-medium py-2 rounded-lg transition-colors hover:text-white hover:bg-white/[0.03]"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
