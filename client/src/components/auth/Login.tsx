import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../config/firebase';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

export default function Login() {
  useDocumentTitle('Sign In');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      toast.error('Please enter both email and password');
      return;
    }

    const loadingToast = toast.loading('Signing in...');
    try {
      setError('');
      setLoading(true);
      await loginUser(email, password);
      toast.dismiss(loadingToast);
      toast.success('Successfully signed in!');
      navigate('/dashboard');
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Failed to sign in');
        toast.error('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-[#E0E5EC] shadow-[20px_20px_60px_#bec3c9,-20px_-20px_60px_#ffffff]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-700">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
              create a new account
            </Link>
          </p>
        </div>
        {error && (
          <div className="text-red-500 text-center p-4 rounded-xl bg-[#E0E5EC] shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#E0E5EC] text-gray-700 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-shadow duration-300"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#E0E5EC] text-gray-700 shadow-[inset_5px_5px_10px_rgba(163,177,198,0.6),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-shadow duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-[5px_5px_10px_rgba(163,177,198,0.6),-5px_-5px_10px_rgba(255,255,255,0.8)] hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.2)]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 