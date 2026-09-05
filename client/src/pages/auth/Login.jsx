import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const login = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

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

      <div className="min-h-screen flex bg-surface relative overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-float-delayed pointer-events-none" />

        {/* Left — Brand/Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Premium lifestyle" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 text-center max-w-md p-12 glass-panel rounded-[2rem] border border-white/10"
          >
            <Link to="/" className="text-5xl font-display font-bold text-white flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-opacity">
              Zyvora
              <span className="w-2 h-2 rounded-full bg-accent mt-2" />
            </Link>
            <p className="text-white/80 text-lg leading-relaxed font-light">
              Welcome back to your curated premium shopping experience.
            </p>
          </motion.div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-black/[0.03] border border-border/60"
          >
            <Link to="/" className="lg:hidden text-3xl font-display font-bold text-primary flex items-center gap-1.5 mb-10">
              Zyvora
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
            </Link>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted mt-2 mb-8 font-light">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-primary block">Password</span>
                  <Link to="#" className="text-[13px] text-muted hover:text-accent transition-colors font-medium">Forgot password?</Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-3 group"
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    rememberMe ? 'bg-accent border-accent text-white' : 'border-border-dark bg-white group-hover:border-accent/50'
                  }`}>
                    {rememberMe && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm text-muted group-hover:text-primary transition-colors select-none">Keep me signed in</span>
                </button>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  size="xl"
                  variant="glow"
                  loading={login.isPending}
                  className="h-14 rounded-xl text-base"
                >
                  Sign In
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted mt-8">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-semibold hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
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
