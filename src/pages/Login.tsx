import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-[#4285f4] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">Login to Account</h1>
        <p className="text-gray-500 text-center text-sm mb-8">
          Please enter your email and password to continue
        </p>
        <LoginForm />
      </div>
    </div>
  );
}