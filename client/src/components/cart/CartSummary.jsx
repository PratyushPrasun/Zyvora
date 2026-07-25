import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';

const CartSummary = ({ items = [], compact = false }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shippingCharge = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shippingCharge;
  const freeShippingProgress = Math.min((subtotal / 1000) * 100, 100);

  const format = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(val);

  if (compact) {
    return (
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>{format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span className={shippingCharge === 0 ? 'text-accent font-medium' : ''}>{shippingCharge === 0 ? 'Free' : format(shippingCharge)}</span>
        </div>
        <div className="flex justify-between font-semibold text-primary pt-2 border-t border-border/60">
          <span>Total</span>
          <span>{format(total)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-border/60 p-6 shadow-sm">
      <h3 className="font-display font-semibold text-lg text-primary mb-5">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal ({items.length} items)</span>
          <span className="font-medium text-primary">{format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span className={shippingCharge === 0 ? 'text-accent font-medium' : 'font-medium text-primary'}>
            {shippingCharge === 0 ? 'Free' : format(shippingCharge)}
          </span>
        </div>

        {/* Free shipping progress */}
        {subtotal < 1000 && subtotal > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2"
          >
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-3.5 h-3.5 text-accent" />
              <p className="text-xs text-accent font-medium">
                Add {format(1000 - subtotal)} more for free shipping
              </p>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${freeShippingProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        <div className="flex justify-between items-center font-semibold text-primary text-lg pt-4 mt-2 border-t border-border/60">
          <span>Total</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1, color: '#22c55e' }}
            animate={{ scale: 1, color: '#0a0a0a' }}
            transition={{ duration: 0.4 }}
            className="font-bold"
          >
            {format(total)}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
