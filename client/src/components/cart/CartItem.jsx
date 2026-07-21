import { Minus, Plus, Trash2 } from 'lucide-react';
import { useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import Price from '@/components/ui/Price';
import { Link } from 'react-router-dom';

const CartItem = ({ item, compact = false }) => {
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const product = item.product;
  const productId = product?._id || product;

  const image =
    product?.images?.find((img) => img.isPrimary)?.url ||
    product?.images?.[0]?.url ||
    'https://placehold.co/80x80/f4f4f5/a1a1aa?text=Item';

  return (
    <div className="flex gap-4">
      <Link
        to={`/products/${productId}`}
        className={`${compact ? 'w-16 h-16' : 'w-24 h-24'} shrink-0 rounded-xl overflow-hidden bg-surface`}
      >
        <img
          src={image}
          alt={product?.title || 'Product'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${productId}`}>
          <h4 className={`font-medium text-primary line-clamp-1 hover:text-accent transition-colors duration-200 ${compact ? 'text-sm' : ''}`}>
            {product?.title || 'Product'}
          </h4>
        </Link>
        {!compact && product?.category && (
          <p className="text-xs text-muted mt-0.5">{product.category}</p>
        )}
        <Price amount={product?.price || 0} size="sm" className="mt-1" />

        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                item.quantity > 1
                  ? updateCart.mutate({ productId, quantity: item.quantity - 1 })
                  : removeFromCart.mutate(productId)
              }
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-accent/5 hover:border-accent/30 transition-all duration-200"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateCart.mutate({ productId, quantity: item.quantity + 1 })
              }
              className="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-accent/5 hover:border-accent/30 transition-all duration-200"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => removeFromCart.mutate(productId)}
            className="p-1.5 text-muted hover:text-error transition-all duration-200 rounded-lg hover:bg-error/5"
            aria-label="Remove from cart"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
