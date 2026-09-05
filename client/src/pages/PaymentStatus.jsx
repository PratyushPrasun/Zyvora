import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Package, Download, ShieldCheck, ArrowRight, RefreshCcw, Truck } from 'lucide-react';
import { useEffect } from 'react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useDownloadInvoice } from '@/hooks/useInvoice';

const PaymentStatus = () => {
  const [params] = useSearchParams();
  const status = params.get('status');
  const orderId = params.get('orderId');
  const success = status === 'success';
  const downloadInvoice = useDownloadInvoice();

  // Trigger confetti animation for success
  useEffect(() => {
    if (success) {
      const createConfetti = () => {
        const colors = ['#22c55e', '#4ade80', '#16a34a', '#facc15', '#60a5fa'];
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.classList.add('confetti-particle');
          confetti.style.left = `${Math.random() * 100}vw`;
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.animationDelay = `${Math.random() * 2}s`;
          document.body.appendChild(confetti);
          
          setTimeout(() => {
            confetti.remove();
          }, 3000);
        }
      };
      createConfetti();
    }
  }, [success]);

  return (
    <>
      <Helmet>
        <title>{success ? 'Order Confirmed' : 'Payment Failed'} — Zyvora</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden py-16">
        {/* Decorative background glows */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none ${success ? 'bg-success' : 'bg-error'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] pointer-events-none" />

        <Container className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-black/[0.03] border border-border/60 relative overflow-hidden"
          >
            {/* Success/Error Indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className={`w-28 h-28 rounded-3xl mx-auto flex items-center justify-center mb-8 relative ${
                success ? 'bg-success/10 text-success shadow-inner shadow-success/20' : 'bg-error/10 text-error shadow-inner shadow-error/20'
              }`}
            >
              {success ? (
                <>
                  <CheckCircle className="w-14 h-14 relative z-10" />
                  <div className="absolute inset-0 bg-success/20 rounded-3xl animate-ping" style={{ animationDuration: '3s' }} />
                </>
              ) : (
                <XCircle className="w-14 h-14" />
              )}
            </motion.div>

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4 tracking-tight">
                {success ? 'Order Confirmed!' : 'Payment Failed'}
              </h1>
              
              <p className="text-muted mb-10 text-lg font-light leading-relaxed max-w-md mx-auto">
                {success
                  ? 'Thank you for your purchase. We are preparing your premium order for shipping.'
                  : 'We couldn\'t process your payment. Your account was not charged. Please try again with a different payment method.'}
              </p>
            </div>

            {success && orderId ? (
              <div className="space-y-8">
                <div className="bg-surface-dark rounded-2xl p-6 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted mb-1">Order Reference</p>
                    <p className="font-mono font-bold text-primary text-xl tracking-wider">{orderId.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="h-px w-full sm:h-12 sm:w-px bg-border/80 hidden sm:block" />
                  <div className="text-right">
                    <p className="text-sm text-muted mb-1">Estimated Delivery</p>
                    <p className="font-medium text-primary">3-5 Business Days</p>
                  </div>
                </div>

                {/* Timeline preview placeholder */}
                <div className="px-4">
                  <div className="flex justify-between relative">
                    <div className="absolute top-3 left-6 right-6 h-1 bg-surface-dark rounded-full -z-10 overflow-hidden">
                      <div className="h-full bg-accent w-1/4 rounded-full" />
                    </div>
                    {[
                      { icon: CheckCircle, label: 'Placed', active: true },
                      { icon: Package, label: 'Processing', active: false },
                      { icon: Truck, label: 'Shipped', active: false },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? 'bg-accent text-white shadow-sm shadow-accent/20' : 'bg-surface-dark text-muted-light'}`}>
                          <step.icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-semibold uppercase tracking-wider ${step.active ? 'text-primary' : 'text-muted-light'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to={`/account/orders/${orderId}`} className="flex-1">
                    <Button size="xl" variant="glow" fullWidth className="h-14 rounded-2xl">
                      <Package className="w-5 h-5 mr-2" />
                      Track Order
                    </Button>
                  </Link>
                  <Button
                    size="xl"
                    variant="outline"
                    className="flex-1 h-14 rounded-2xl bg-white"
                    onClick={() => downloadInvoice.mutate(orderId)}
                    loading={downloadInvoice.isPending}
                    disabled={downloadInvoice.isPending}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Invoice
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/checkout" className="flex-1">
                  <Button size="xl" variant="glow" fullWidth className="h-14 rounded-2xl bg-primary hover:bg-primary-light border-primary hover:border-primary">
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                </Link>
                <Link to="/shop" className="flex-1">
                  <Button variant="outline" size="xl" fullWidth className="h-14 rounded-2xl bg-white border-border/80">
                    Cancel & Return
                  </Button>
                </Link>
              </div>
            )}
            
            {success && (
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-muted font-medium bg-surface/50 rounded-xl py-3">
                <ShieldCheck className="w-4 h-4 text-success" />
                Your order is confirmed and encrypted securely.
              </div>
            )}
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default PaymentStatus;
