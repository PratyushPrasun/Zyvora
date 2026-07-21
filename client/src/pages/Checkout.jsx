import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import EmptyState from '@/components/ui/EmptyState';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { useCreateOrder } from '@/hooks/useOrders';
import { useCreatePaymentOrder, useVerifyPayment } from '@/hooks/usePayments';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: addressData, isLoading: addressLoading } = useAddresses();
  const createOrder = useCreateOrder();
  const createPaymentOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [processing, setProcessing] = useState(false);

  const items = cart?.items || [];
  const addresses = addressData?.addresses || [];

  // Auto-select default address
  if (!selectedAddress && addresses.length > 0) {
    const def = addresses.find((a) => a.isDefault) || addresses[0];
    if (def) setSelectedAddress(def._id);
  }

  const handleCOD = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    setProcessing(true);
    createOrder.mutate(
      { addressId: selectedAddress, paymentMethod: 'COD' },
      {
        onSuccess: (res) => {
          navigate(`/payment-status?status=success&orderId=${res.data.order._id}`);
        },
        onSettled: () => setProcessing(false),
      }
    );
  };

  const handleOnlinePayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    setProcessing(true);
    try {
      const { data } = await createPaymentOrder.mutateAsync({
        addressId: selectedAddress,
      });

      if (!window.Razorpay) {
        toast.error('Payment gateway failed to load. Please refresh the page and try again.');
        setProcessing(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: 'Zyvora',
        description: 'Premium Order Payment',
        order_id: data.razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment.mutateAsync({
              addressId: selectedAddress,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful! Order placed.');
            navigate(
              `/payment-status?status=success&orderId=${verifyRes.data.order._id}`
            );
          } catch {
            navigate('/payment-status?status=failed');
          } finally {
            setProcessing(false);
          }
        },
        prefill: {},
        theme: { color: '#10b981' }, // Zyvora Green Accent
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Online payment error:', error);
      toast.error(error?.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'COD') handleCOD();
    else handleOnlinePayment();
  };

  if (cartLoading || addressLoading) return <div className="min-h-screen flex items-center justify-center bg-surface"><Loader size="lg" /></div>;

  if (items.length === 0) {
    return (
      <Container className="py-20">
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before checkout."
          action={() => navigate('/shop')}
          actionLabel="Browse Products"
        />
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout — Zyvora</title>
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        <div className="bg-white border-b border-border/60 pb-8 pt-8">
          <Container>
            <Breadcrumb
              items={[
                { label: 'Bag', href: '/cart' },
                { label: 'Checkout' },
              ]}
            />
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary mt-6 tracking-tight">
              Secure Checkout
            </h1>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-display font-semibold text-primary flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    Shipping Address
                  </h2>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-10 bg-surface rounded-2xl border border-dashed border-border">
                    <p className="text-sm text-muted mb-4">
                      No saved addresses found
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/account/addresses')}
                    >
                      <Plus className="w-4 h-4" /> Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
                          selectedAddress === addr._id
                            ? 'border-accent bg-accent/[0.02] shadow-sm shadow-accent/10'
                            : 'border-border/60 hover:border-accent/30 hover:bg-surface'
                        }`}
                      >
                        {selectedAddress === addr._id && (
                          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full -z-10" />
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={selectedAddress === addr._id ? 'accent' : 'default'}>{addr.addressType}</Badge>
                          {selectedAddress === addr._id && (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary mb-1">
                          {addr.fullName}
                        </p>
                        <p className="text-sm text-muted mb-1 leading-relaxed line-clamp-2">
                          {addr.addressLine1}, {addr.city}, {addr.state}{' '}
                          {addr.pincode}
                        </p>
                        <p className="text-sm text-muted">{addr.phone}</p>
                      </button>
                    ))}
                  </div>
                )}
                
                {addresses.length > 0 && (
                   <div className="mt-6 flex justify-end">
                     <Button variant="ghost" size="sm" onClick={() => navigate('/account/addresses')}>
                       Manage Addresses
                     </Button>
                   </div>
                )}
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm"
              >
                <h2 className="text-xl font-display font-semibold text-primary mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'COD',
                      label: 'Cash on Delivery',
                      icon: Truck,
                      desc: 'Pay when you receive your order',
                    },
                    {
                      id: 'ONLINE',
                      label: 'Online Payment',
                      icon: CreditCard,
                      desc: 'UPI, Cards, Net Banking (Razorpay)',
                    },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                        paymentMethod === method.id
                          ? 'border-accent bg-accent/[0.02] shadow-sm shadow-accent/10'
                          : 'border-border/60 hover:border-accent/30 hover:bg-surface'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-bl-full -z-10" />
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${paymentMethod === method.id ? 'bg-accent/10' : 'bg-surface-dark'}`}>
                        <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-accent' : 'text-muted'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary mb-1">
                          {method.label}
                        </p>
                        <p className="text-xs text-muted leading-relaxed">{method.desc}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary items={items} />

                {/* Items preview */}
                <div className="bg-white rounded-3xl border border-border/60 p-6 mt-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-semibold text-primary pb-3 border-b border-border/60">
                    Order Items ({items.length})
                  </h4>
                  <div className="max-h-64 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.product?._id} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-surface overflow-hidden shrink-0">
                          <img
                            src={
                              item.product?.images?.[0]?.url ||
                              'https://placehold.co/40x40/f5f5f5/a3a3a3'
                            }
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary line-clamp-1 font-medium">
                            {item.product?.title}
                          </p>
                          <p className="text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    fullWidth
                    size="xl"
                    variant="glow"
                    onClick={handlePlaceOrder}
                    loading={processing}
                    disabled={!selectedAddress}
                  >
                    {paymentMethod === 'COD'
                      ? 'Confirm & Place Order'
                      : 'Pay & Place Order'}
                  </Button>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    Secure encrypted checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Checkout;
