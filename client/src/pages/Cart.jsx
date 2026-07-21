import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
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

      <div className="bg-surface min-h-screen">
        <div className="bg-white border-b border-border/60 pb-8 pt-8">
          <Container>
            <Breadcrumb items={[{ label: 'Shopping Bag' }]} />
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-6 tracking-tight">
              Shopping Bag
            </h1>
          </Container>
        </div>

        <Container className="py-12">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <Loader size="lg" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-border/60 text-center">
              <EmptyState
                icon={ShoppingBag}
                title="Your bag is empty"
                description="Discover our curated collection and add items to your bag."
                action={() => (window.location.href = '/shop')}
                actionLabel="Start Shopping"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border/60">
                  <h2 className="text-xl font-display font-semibold text-primary mb-6 border-b border-border/60 pb-4">
                    Items ({items.length})
                  </h2>
                  <div className="space-y-6">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product?._id || item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CartItem item={item} />
                        {index < items.length - 1 && (
                          <div className="h-px bg-border/60 mt-6" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <CartSummary items={items} />
                  <div className="mt-6 space-y-3">
                    <Link to="/checkout" className="block">
                      <Button fullWidth size="xl" variant="glow" className="group">
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/shop" className="block">
                      <Button variant="outline" fullWidth size="lg">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
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
