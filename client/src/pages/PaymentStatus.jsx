import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const PaymentStatus = () => {
  const [params] = useSearchParams();
  const status = params.get('status');
  const orderId = params.get('orderId');
  const success = status === 'success';

  return (
    <>
      <Helmet>
        <title>{success ? 'Order Confirmed' : 'Payment Failed'} — Zyvora</title>
      </Helmet>

      <div className="min-h-[85vh] flex items-center justify-center bg-surface relative overflow-hidden">
        {/* Decorative background glows */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none ${success ? 'bg-success' : 'bg-error'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] pointer-events-none" />

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-lg mx-auto bg-white rounded-3xl p-10 sm:p-12 text-center shadow-xl shadow-black/[0.03] border border-border/60 relative overflow-hidden"
          >
            {/* Success/Error Indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
              className={`w-24 h-24 rounded-2xl mx-auto flex items-center justify-center mb-8 relative ${
                success ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
              }`}
            >
              {success ? (
                <>
                  <CheckCircle className="w-12 h-12 relative z-10" />
                  <div className="absolute inset-0 bg-success/20 rounded-2xl animate-ping" style={{ animationDuration: '3s' }} />
                </>
              ) : (
                <XCircle className="w-12 h-12" />
              )}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mb-4 tracking-tight">
              {success ? 'Order Confirmed!' : 'Payment Failed'}
            </h1>
            
            <p className="text-muted mb-8 text-lg font-light leading-relaxed">
              {success
                ? 'Thank you for your purchase. We are preparing your premium order for shipping.'
                : 'Something went wrong with your payment. No charges were made. Please try again.'}
            </p>

            {success && orderId && (
              <div className="bg-surface-dark rounded-2xl p-4 mb-8 border border-border/40 inline-block min-w-[250px]">
                <p className="text-sm text-muted-light mb-1">Order Reference</p>
                <p className="font-mono font-semibold text-primary tracking-wider text-lg">{orderId.slice(-8).toUpperCase()}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {success && orderId ? (
                <Link to={`/account/orders/${orderId}`} className="w-full sm:w-auto">
                  <Button size="xl" variant="glow" fullWidth>
                    <Package className="w-5 h-5" />
                    Track Order
                  </Button>
                </Link>
              ) : (
                <Link to="/checkout" className="w-full sm:w-auto">
                  <Button size="xl" variant="danger" fullWidth>Try Again</Button>
                </Link>
              )}
              <Link to="/shop" className="w-full sm:w-auto">
                <Button variant={success ? "outline" : "ghost"} size="xl" fullWidth>
                  Continue Shopping
                </Button>
              </Link>
            </div>
            
            {success && (
              <div className="mt-8 pt-6 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-muted font-medium">
                <ShieldCheck className="w-4 h-4 text-success" />
                Secure payment processed
              </div>
            )}
          </motion.div>
        </Container>
      </div>
    </>
  );
};

export default PaymentStatus;
