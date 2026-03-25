'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LineChart,
  Loader2,
  Lock,
  Mail,
  Shield,
  User,
} from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import styles from './login.module.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (isSignUp) {
      const { error: signUpError } = await signUp(normalizedEmail, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess('Account created. Confirm your email, then sign in.');
        setIsSignUp(false);
        setPassword('');
      }
    } else {
      const { error: signInError } = await signIn(normalizedEmail, password);
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push('/dashboard');
      }
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.gridLayer} />
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />

      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <LineChart size={18} />
          </div>
          <h1>
            Bharat<span>-Insight</span>
          </h1>
          <p>AI-Driven Data Intelligence Platform</p>
        </div>

        <section className={styles.authCard}>
          <div className={styles.tabs} role="tablist" aria-label="Auth mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              className={!isSignUp ? styles.activeTab : ''}
              onClick={() => {
                setIsSignUp(false);
                setError('');
                setSuccess('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              className={isSignUp ? styles.activeTab : ''}
              onClick={() => {
                setIsSignUp(true);
                setError('');
                setSuccess('');
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {success && <div className={styles.successMsg}>{success}</div>}

            <label className={styles.field}>
              <span>Email address</span>
              <div className={styles.inputWrap}>
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <div className={styles.inputWrap}>
                <Lock size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {!isSignUp && <button type="button" className={styles.forgotBtn}>Forgot password?</button>}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <div className={styles.divider}>or</div>

            <button
              type="button"
              className={styles.socialBtn}
              onClick={() => setError('Google sign-in is not configured in this demo.')}
            >
              <span>G</span>
              Continue with Google
            </button>
          </form>
        </section>

        <aside className={styles.roleCard}>
          <h2>How roles work</h2>
          <ul>
            <li>
              <Shield size={14} />
              <p>
                <strong>Admin</strong> - full access: view, edit, delete rows and export CSV.
              </p>
            </li>
            <li>
              <User size={14} />
              <p>
                <strong>Viewer</strong> - read-only: browse, search, export CSV and AI insights.
              </p>
            </li>
          </ul>
          <p className={styles.roleNote}>
            New accounts start as Viewer. Admin access is granted by a system administrator.
          </p>
        </aside>

        <p className={styles.bottomCopy}>Bharat-Insight · Powered by Gemini AI</p>
      </div>
    </div>
  );
}
