import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
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
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => registerUser.mutate(data);

  return (
    <>
      <Helmet>
        <title>Create Account — Zyvora</title>
      </Helmet>

      <div className="min-h-screen flex bg-surface">
        {/* Left — Brand/Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop" 
              alt="Premium lifestyle fashion" 
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
              Create your account and discover premium curated products designed for you.
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
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                {...register('email')}
                error={errors.email?.message}
              />

              <div className="space-y-1">
                <span className="text-sm font-medium text-primary block mb-1">Password</span>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light group-focus-within:text-accent transition-colors duration-200" />
                  <input
                    type="password"
                    placeholder="Min. 6 characters"
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
                  loading={registerUser.isPending}
                >
                  Create Account
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted mt-8">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-accent transition-colors"
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
