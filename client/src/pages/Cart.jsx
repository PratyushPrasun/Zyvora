import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useCart } from '@/hooks/useCart';

const Cart = () => {
  const { data: cart, isLoading } = useCart();
  const items = cart?.items || [];

  return (
    <>
      <Helmet>
        <title>Shopping Bag — Zyvora</title>
      </Helmet>

      <div className="bg-surface min-h-screen pb-16">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-glow" />
          <Container className="page-header-content">
            <Breadcrumb items={[{ label: 'Shopping Bag' }]} />
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="page-header-title"
            >
              Shopping Bag
            </motion.h1>
            {!isLoading && items.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="page-header-subtitle"
              >
                You have {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
              </motion.p>
            )}
          </Container>
        </div>

        <Container className="py-12">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader size="lg" />
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="card-premium p-12 text-center max-w-3xl mx-auto mt-8"
            >
              <EmptyState
                icon={ShoppingBag}
                title="Your bag is empty"
                description="Discover our curated collection and add items to your bag."
                action={() => (window.location.href = '/shop')}
                actionLabel="Start Shopping"
              />
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="card-premium p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 border-b border-border/60 pb-4">
                    <h2 className="text-xl font-display font-semibold text-primary">
                      Order Items
                    </h2>
                    <Link to="/shop" className="text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                      Add more items
                    </Link>
                  </div>
                  
                  <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.product?._id || item._id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: -20 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <CartItem item={item} />
                          {index < items.length - 1 && (
                            <div className="h-px bg-border/40 mt-6" />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CartSummary items={items} />
                    <div className="mt-6 space-y-3">
                      <Link to="/checkout" className="block">
                        <Button fullWidth size="xl" variant="glow" className="group h-14 rounded-2xl text-base">
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/shop" className="block">
                        <Button variant="outline" fullWidth size="lg" className="rounded-2xl bg-white border-border/80">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Trust badges underneath summary */}
                    <div className="mt-8 pt-6 border-t border-border/60 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 object-contain" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" className="h-4 object-contain" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default Cart;
