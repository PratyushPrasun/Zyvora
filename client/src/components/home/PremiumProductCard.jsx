import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import Price from '@/components/ui/Price';
import { useAddToCart } from '@/hooks/useCart';
import { useAuthContext } from '@/contexts/AuthContext';

const PremiumProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated } = useAuthContext();
  const addToCart = useAddToCart();

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://placehold.co/600x800/f4f4f5/a1a1aa?text=No+Image';

  const secondaryImage = 
    product.images?.[1]?.url || primaryImage; // Fallback to primary if no secondary

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return; // In a real app we might redirect to login or show modal
    addToCart.mutate({ productId: product._id, quantity: 1 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group"
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden bg-[#f8f8f8] aspect-[3/4] mb-5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-shadow duration-500 rounded-[1rem]">
          {/* Default Image */}
          <img
            src={primaryImage}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
            loading="lazy"
          />
          
          {/* Hover Image */}
          <img
            src={secondaryImage}
            alt={`${product.title} alternate view`}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-accent text-white px-3 py-1.5 rounded-full shadow-sm">
                Few Left
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-sm">
                Sold Out
              </span>
            )}
            <button 
              className="ml-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist logic here
              }}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Actions Overlay */}
          {product.stock > 0 && isAuthenticated && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.21,0.47,0.32,0.98] z-10">
              <button
                className="w-full bg-primary/95 backdrop-blur-md text-white py-3.5 rounded-xl text-sm font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-accent transition-colors shadow-lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        <div className="space-y-1.5 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">
            {product.brand || product.category}
          </p>
          <h3 className="font-display font-medium text-lg text-primary line-clamp-1 group-hover:text-accent transition-colors duration-300">
            {product.title}
          </h3>
          <div className="flex justify-center items-center mt-2">
            <Price amount={product.price} className="text-primary font-medium" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PremiumProductCard;
