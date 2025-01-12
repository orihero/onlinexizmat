import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setError('Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-sm text-red-600 mb-4">{error}</div>
      )}

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">Email address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
          placeholder="solution_studio@gmail.com"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm text-gray-600">Password</label>
          <a href="#" className="text-sm text-[#4285f4] hover:underline">
            Forgot Password?
          </a>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-[#4285f4] border-gray-300 rounded"
        />
        <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
          Remember Password
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#4285f4] text-white py-2.5 rounded-md hover:bg-[#3b7de3] transition-colors"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}