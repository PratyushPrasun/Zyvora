import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuthContext } from '@/contexts/AuthContext';
import { User, Mail, Calendar, Edit2, Shield, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';

const Profile = () => {
  const { user } = useAuthContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <>
      <Helmet>
        <title>Profile — Zyvora</title>
      </Helmet>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
            Personal Information
          </h1>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white rounded-3xl border border-border/60 p-6 sm:p-10 shadow-sm"
        >
          {/* Avatar Section */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 pb-10 border-b border-border/60 text-center sm:text-left">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent to-accent-light rounded-3xl blur-md opacity-40 animate-pulse" />
              <div className="relative w-24 h-24 rounded-3xl bg-white flex items-center justify-center border-2 border-accent/20 shadow-sm">
                <span className="text-4xl font-display font-bold text-accent">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="pt-2">
              <h2 className="text-2xl font-semibold text-primary mb-2">{user?.name}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="text-xs font-semibold text-accent-dark uppercase tracking-wider bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> {user?.role} Account
                </span>
                <span className="text-xs font-medium text-muted bg-surface-dark px-3 py-1.5 rounded-lg border border-border/80">
                  ID: {user?._id?.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="sm:ml-auto pt-2">
              <Button variant="outline" size="sm" className="sm:hidden w-full">
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>
            </div>
          </motion.div>

          {/* Fields */}
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-2xl bg-surface border border-border/40 hover:border-accent/30 hover:shadow-md hover:shadow-black/[0.02] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-border/60 group-hover:border-accent/20 group-hover:bg-accent/5 transition-colors">
                <User className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-base font-semibold text-primary">{user?.name}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-2xl bg-surface border border-border/40 hover:border-accent/30 hover:shadow-md hover:shadow-black/[0.02] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-border/60 group-hover:border-accent/20 group-hover:bg-accent/5 transition-colors">
                <Mail className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-base font-semibold text-primary">{user?.email}</p>
              </div>
              <div className="hidden sm:block">
                <span className="text-xs text-success font-medium bg-success/10 px-2.5 py-1 rounded-md">Verified</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-2xl bg-surface border border-border/40 hover:border-accent/30 hover:shadow-md hover:shadow-black/[0.02] hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-border/60 group-hover:border-accent/20 group-hover:bg-accent/5 transition-colors">
                <Calendar className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1">Member Since</p>
                <p className="text-base font-semibold text-primary">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Profile;
