import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import Rating from '@/components/ui/Rating';
import Price from '@/components/ui/Price';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuthContext();
  const addToCart = useAddToCart();

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://placehold.co/400x400/f4f4f5/a1a1aa?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    addToCart.mutate({ productId: product._id, quantity: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
    >
      <Link to={`/products/${product._id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-surface aspect-square mb-4">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/60 px-4 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Actions */}
          {product.stock > 0 && isAuthenticated && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-accent text-white shadow-lg shadow-accent/25 flex items-center justify-center"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute top-3 left-3 text-xs font-medium bg-primary text-white px-3 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>

        <div className="space-y-1.5 px-0.5">
          <p className="text-[11px] text-muted uppercase tracking-[0.12em] font-medium">
            {product.brand || product.category}
          </p>
          <h3 className="font-medium text-primary line-clamp-1 group-hover:text-accent transition-colors duration-300">
            {product.title}
          </h3>
          <Rating value={product.averageRating} count={product.totalReviews} size="sm" />
          <Price amount={product.price} />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
