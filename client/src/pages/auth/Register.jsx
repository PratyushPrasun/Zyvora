import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRegister } from '@/hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Register = () => {
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => registerUser.mutate(data);
  
  // Watch password for strength indicator
  const password = useWatch({ control, name: 'password', defaultValue: '' });
  
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'None', color: 'bg-surface-dark' };
    if (password.length < 6) return { score: 1, label: 'Weak', color: 'bg-error' };
    if (password.length < 8 || !/\d/.test(password)) return { score: 2, label: 'Fair', color: 'bg-warning' };
    if (!/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) return { score: 3, label: 'Good', color: 'bg-accent-light' };
    return { score: 4, label: 'Strong', color: 'bg-accent' };
  };

  const strength = getPasswordStrength();

  return (
    <>
      <Helmet>
        <title>Create Account — Zyvora</title>
      </Helmet>

      <div className="min-h-screen flex bg-surface relative overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-float-delayed pointer-events-none" />

        {/* Left — Brand/Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop" 
              alt="Premium lifestyle fashion" 
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
              Create your account and discover premium curated products designed for you.
            </p>
          </motion.div>
        </div>

        {/* Right — Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-xl shadow-black/[0.03] border border-border/60"
          >
            <Link to="/" className="lg:hidden text-3xl font-display font-bold text-primary flex items-center gap-1.5 mb-10">
              Zyvora
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
            </Link>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
              Create Account
            </h1>
            <p className="text-muted mt-2 mb-8 font-light">
              Join Zyvora for an exclusive shopping experience
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                icon={User}
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="space-y-1">
                <span className="text-sm font-medium text-primary block mb-1">Password</span>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  icon={Lock}
                  {...register('password')}
                  error={errors.password?.message}
                />
                
                {/* Password Strength Indicator */}
                {password.length > 0 && !errors.password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2"
                  >
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div 
                          key={step} 
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            step <= strength.score ? strength.color : 'bg-surface-dark'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className={`text-[11px] font-medium transition-colors text-right ${
                      strength.score < 2 ? 'text-error' : strength.score < 4 ? 'text-warning' : 'text-accent'
                    }`}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  size="xl"
                  variant="glow"
                  loading={registerUser.isPending}
                  className="h-14 rounded-xl text-base"
                >
                  Create Account
                </Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted font-medium bg-surface/50 rounded-lg py-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  Your data is protected securely
                </div>
              </div>
            </form>

            <p className="text-center text-sm text-muted mt-8">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-accent transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Register;
