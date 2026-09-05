import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import Price from '@/components/ui/Price';
import { Link } from 'react-router-dom';

const CartItem = ({ item, compact = false }) => {
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const product = item?.product;
  const productId = typeof product === 'object' ? product?._id : product;

  if (!item || !product || !productId) {
    return null;
  }

  const image =
    product?.images?.find((img) => img.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Item';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex gap-4 sm:gap-5 group"
    >
      <Link
        to={`/products/${productId}`}
        className={`${compact ? 'w-16 h-16' : 'w-24 h-24 sm:w-28 sm:h-28'} shrink-0 rounded-2xl overflow-hidden bg-surface border border-border/40`}
      >
        <img
          src={image}
          alt={product?.title || 'Product'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${productId}`}>
          <h4 className={`font-medium text-primary line-clamp-1 hover:text-accent transition-colors duration-200 ${compact ? 'text-sm' : 'text-base'}`}>
            {product?.title || 'Product'}
          </h4>
        </Link>
        {!compact && product?.category && (
          <p className="text-xs text-muted mt-0.5">{product.category}</p>
        )}
        <Price amount={product?.price || 0} size="sm" className="mt-1.5" />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-0.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                if (!productId) return;
                item.quantity > 1
                  ? updateCart.mutate({ productId, quantity: item.quantity - 1 })
                  : removeFromCart.mutate(productId);
              }}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent/5 hover:border-accent/30 hover:text-accent transition-all duration-200"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </motion.button>
            <span className="w-10 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                if (!productId) return;
                updateCart.mutate({ productId, quantity: item.quantity + 1 });
              }}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent/5 hover:border-accent/30 hover:text-accent transition-all duration-200"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (!productId) return;
              removeFromCart.mutate(productId);
            }}
            className="p-2 text-muted hover:text-error transition-all duration-200 rounded-xl hover:bg-error/5"
            aria-label="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
