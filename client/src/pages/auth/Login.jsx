import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => login.mutate(data);

  return (
    <>
      <Helmet>
        <title>Sign In — Zyvora</title>
      </Helmet>

      <div className="min-h-screen flex bg-surface">
        {/* Left — Brand/Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1618090584126-129cd1f3f5ce?q=80&w=1200&auto=format&fit=crop" 
              alt="Premium lifestyle" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 text-center max-w-md p-12 glass-panel rounded-3xl border border-white/10"
          >
            <Link to="/" className="text-5xl font-display font-bold text-white flex items-center justify-center gap-2">
              Zyvora
              <span className="w-2 h-2 rounded-full bg-accent mt-2" />
            </Link>
            <p className="mt-6 text-white/80 text-lg leading-relaxed font-light">
              Welcome back to your curated premium shopping experience.
            </p>
          </motion.div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
          {/* Subtle mobile background decoration */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 lg:hidden" />
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-black/[0.03] border border-border/60"
          >
            <Link to="/" className="lg:hidden text-2xl font-display font-bold text-primary flex items-center gap-1.5 mb-10">
              Zyvora
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1" />
            </Link>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted mt-2 mb-8 font-light">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary block">Password</span>
                  <Link to="#" className="text-xs text-muted hover:text-accent transition-colors">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light group-focus-within:text-accent transition-colors duration-200" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`
                      w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm text-primary placeholder:text-muted-light
                      transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent hover:border-border-dark
                      ${errors.password ? 'border-error' : 'border-border'}
                    `}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-error" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  fullWidth
                  size="xl"
                  variant="glow"
                  loading={login.isPending}
                >
                  Sign In
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted mt-8">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:text-accent transition-colors"
              >
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
