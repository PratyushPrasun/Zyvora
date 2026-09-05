import Drawer from '@/components/ui/Drawer';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useCart } from '@/hooks/useCart';
import EmptyState from '@/components/ui/EmptyState';
import { ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const { data: cart } = useCart();
  const navigate = useNavigate();
  const items = (cart?.items || []).filter((item) => item?.product);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Shopping Bag">
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet."
          action={() => {
            onClose();
            navigate('/shop');
          }}
          actionLabel="Start Shopping"
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-4 overflow-y-auto">
            {items.map((item) => (
              <CartItem
                key={item.product?._id || item._id}
                item={item}
                compact
              />
            ))}
          </div>
          <div className="border-t border-border/60 pt-4 mt-4 space-y-3">
            <CartSummary items={items} compact />
            <Button fullWidth onClick={handleCheckout} variant="accent">
              Proceed to Checkout
            </Button>
            <Button variant="ghost" fullWidth onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CartDrawer;
