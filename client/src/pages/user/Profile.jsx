import { Helmet } from 'react-helmet-async';
import { useAuthContext } from '@/contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthContext();

  return (
    <>
      <Helmet>
        <title>Profile — Zyvora</title>
      </Helmet>

      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-8 tracking-tight">
          My Profile
        </h1>

        <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-10 shadow-sm">
          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-border/60">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
              <span className="text-3xl font-display font-bold text-accent">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary mb-1">{user?.name}</h2>
              <p className="text-sm text-accent font-medium uppercase tracking-wider bg-accent/5 inline-block px-3 py-1 rounded-lg">
                {user?.role} Account
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border/40 hover:border-accent/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm shadow-black/[0.02]">
                <User className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-0.5">Full Name</p>
                <p className="text-base font-semibold text-primary">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border/40 hover:border-accent/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm shadow-black/[0.02]">
                <Mail className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-0.5">Email Address</p>
                <p className="text-base font-semibold text-primary">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border/40 hover:border-accent/20 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm shadow-black/[0.02]">
                <Calendar className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted uppercase tracking-wider mb-0.5">Member Since</p>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
