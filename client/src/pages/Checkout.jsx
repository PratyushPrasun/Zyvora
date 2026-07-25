import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Plus, CheckCircle, ShieldCheck, Check } from 'lucide-react';
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
  const [activeStep, setActiveStep] = useState(1);

  const items = cart?.items || [];
  const addresses = addressData?.addresses || [];

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      if (def) setSelectedAddress(def._id);
    }
  }, [addresses, selectedAddress]);

  // Determine active step based on selections
  useEffect(() => {
    if (!selectedAddress) {
      setActiveStep(1);
    } else if (selectedAddress && !paymentMethod) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  }, [selectedAddress, paymentMethod]);

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
        theme: { color: '#22c55e' }, // Zyvora Green Accent
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

  // Step indicator UI
  const steps = [
    { num: 1, label: 'Address' },
    { num: 2, label: 'Payment' },
    { num: 3, label: 'Review' }
  ];

  return (
    <>
      <Helmet>
        <title>Secure Checkout — Zyvora</title>
      </Helmet>

      <div className="bg-surface min-h-screen pb-20">
        <div className="page-header">
          <div className="page-header-glow" />
          <Container className="page-header-content">
            <Breadcrumb
              items={[
                { label: 'Bag', href: '/cart' },
                { label: 'Checkout' },
              ]}
            />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mt-6">
              <h1 className="page-header-title !mt-0">
                Secure Checkout
              </h1>
              
              {/* Step Indicator */}
              <div className="flex items-center w-full md:max-w-md">
                {steps.map((step, idx) => (
                  <div key={step.num} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-2 relative">
                      <div className={`step-circle ${
                        activeStep === step.num ? 'step-circle-active' :
                        activeStep > step.num ? 'step-circle-completed' : 'step-circle-pending'
                      }`}>
                        {activeStep > step.num ? <Check className="w-5 h-5" /> : step.num}
                      </div>
                      <span className={`absolute -bottom-6 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider ${
                        activeStep >= step.num ? 'text-primary' : 'text-muted-light'
                      }`}>{step.label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="step-line">
                        <div className="step-line-fill" style={{ width: activeStep > step.num ? '100%' : '0%' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Address */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-section p-8"
              >
                <div className="flex items-center justify-between mb-6 border-b border-border/60 pb-4">
                  <h2 className="section-heading">
                    <div className="section-heading-icon">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    1. Shipping Address
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
                        className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
                          selectedAddress === addr._id
                            ? 'border-accent bg-accent/[0.02] shadow-md shadow-accent/5 -translate-y-0.5'
                            : 'border-border/60 hover:border-accent/40 hover:bg-surface hover:-translate-y-0.5'
                        }`}
                      >
                        {selectedAddress === addr._id && (
                          <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl -z-10" />
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={selectedAddress === addr._id ? 'accent' : 'default'} dot={selectedAddress === addr._id}>{addr.addressType}</Badge>
                          {selectedAddress === addr._id ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle className="w-5 h-5 text-accent" />
                            </motion.div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-accent/40 transition-colors" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary mb-1">
                          {addr.fullName}
                        </p>
                        <p className="text-sm text-muted mb-1 leading-relaxed line-clamp-2 font-light">
                          {addr.addressLine1}, {addr.city}, {addr.state}{' '}
                          {addr.pincode}
                        </p>
                        <p className="text-sm text-muted font-mono">{addr.phone}</p>
                      </button>
                    ))}
                  </div>
                )}
                
                {addresses.length > 0 && (
                   <div className="mt-6 flex justify-end">
                     <Button variant="ghost" size="sm" onClick={() => navigate('/account/addresses')} className="text-accent hover:text-accent-dark">
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
                className={`card-section p-8 transition-opacity duration-300 ${!selectedAddress ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <h2 className="section-heading border-b border-border/60 pb-4 mb-6">
                  <div className="section-heading-icon">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  2. Payment Method
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
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                        paymentMethod === method.id
                          ? 'border-accent bg-accent/[0.02] shadow-md shadow-accent/5 -translate-y-0.5'
                          : 'border-border/60 hover:border-accent/40 hover:bg-surface hover:-translate-y-0.5'
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl -z-10" />
                      )}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${paymentMethod === method.id ? 'bg-accent/10' : 'bg-surface-dark group-hover:bg-accent/5'}`}>
                        <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-accent' : 'text-muted'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-primary mb-1">
                          {method.label}
                        </p>
                        <p className="text-xs text-muted leading-relaxed font-light">{method.desc}</p>
                      </div>
                      {paymentMethod === method.id ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-1" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border mt-1 shrink-0 group-hover:border-accent/40 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CartSummary items={items} />

                  {/* Items preview */}
                  <div className="bg-white rounded-3xl border border-border/60 p-6 mt-6 shadow-sm">
                    <h4 className="text-sm font-semibold text-primary pb-3 border-b border-border/60">
                      Order Items ({items.length})
                    </h4>
                    <div className="max-h-64 overflow-y-auto pr-2 mt-4 space-y-4 custom-scrollbar">
                      {items.map((item) => (
                        <div key={item.product?._id} className="flex items-center gap-4 group">
                          <div className="w-14 h-14 rounded-2xl bg-surface border border-border/40 overflow-hidden shrink-0">
                            <img
                              src={
                                item.product?.images?.[0]?.url ||
                                'https://placehold.co/40x40/f5f5f5/a3a3a3'
                              }
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-primary line-clamp-1 font-medium">
                              {item.product?.title}
                            </p>
                            <p className="text-xs text-muted mt-0.5 font-mono bg-surface inline-block px-1.5 rounded">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      fullWidth
                      size="xl"
                      variant="glow"
                      onClick={handlePlaceOrder}
                      loading={processing}
                      disabled={!selectedAddress}
                      className="h-14 rounded-2xl text-base"
                    >
                      {paymentMethod === 'COD'
                        ? 'Confirm & Place Order'
                        : 'Pay & Place Order'}
                    </Button>
                    
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-success font-medium bg-success/10 py-2 rounded-xl border border-success/20">
                      <ShieldCheck className="w-4 h-4" />
                      Secure encrypted checkout
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Checkout;
