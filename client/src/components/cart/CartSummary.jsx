const CartSummary = ({ items = [], compact = false }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const shippingCharge = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shippingCharge;

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
    <div className="bg-surface rounded-2xl p-6 space-y-3">
      <h3 className="font-display font-semibold text-lg">Order Summary</h3>
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal ({items.length} items)</span>
          <span>{format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span className={shippingCharge === 0 ? 'text-accent font-medium' : ''}>
            {shippingCharge === 0 ? 'Free' : format(shippingCharge)}
          </span>
        </div>
        {subtotal < 1000 && subtotal > 0 && (
          <p className="text-xs text-accent flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-accent animate-pulse" />
            Add {format(1000 - subtotal)} more for free shipping
          </p>
        )}
        <div className="flex justify-between font-semibold text-primary text-base pt-3 border-t border-border/60">
          <span>Total</span>
          <span>{format(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
