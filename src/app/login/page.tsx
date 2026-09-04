import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8">
        <h1 className="text-xl font-bold text-slate-900 mb-1">POEM Data Room</h1>
        <p className="text-sm text-slate-500 mb-6">Enter the access password to continue.</p>
        <LoginForm />
      </div>
    </div>
  );
}
