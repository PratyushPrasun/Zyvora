import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, MapPin, CreditCard, Clock, ChevronRight } from 'lucide-react';
import { useOrderById } from '@/hooks/useOrders';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';

const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useOrderById(id);
  const order = data?.order;

  if (isLoading) return <div className="py-20 flex justify-center"><Loader size="lg" /></div>;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const currentStep = statusSteps.indexOf(order.orderStatus);

  const format = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <>
      <Helmet>
        <title>Order #{order._id.slice(-8).toUpperCase()} — Zyvora</title>
      </Helmet>

      <div className="space-y-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted mb-1">
              <span className="hover:text-primary cursor-pointer transition-colors">Orders</span>
              <ChevronRight className="w-3 h-3" />
              <span>{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
              Order Details
            </h1>
          </div>
          <Badge
            variant={
              order.orderStatus === 'Delivered'
                ? 'success'
                : order.orderStatus === 'Cancelled'
                ? 'error'
                : 'accent'
            }
          >
            {order.orderStatus}
          </Badge>
        </div>

        {/* Progress Stepper */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-10 shadow-sm overflow-x-auto custom-scrollbar">
            <div className="flex items-center justify-between min-w-[500px]">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center relative">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-500 z-10 ${
                        i <= currentStep
                          ? 'bg-accent text-white shadow-sm shadow-accent/20'
                          : 'bg-surface-dark text-muted'
                      }`}
                    >
                      {i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs mt-3 font-medium absolute top-10 whitespace-nowrap ${i <= currentStep ? 'text-primary' : 'text-muted'}`}>
                      {step}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className="flex-1 h-1 mx-2 bg-surface-dark rounded-full overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-in-out" 
                        style={{ width: i < currentStep ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-display font-semibold text-primary mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-accent" />
              </div>
              Items Ordered
            </h3>
            
            <div className="space-y-6">
              {order.items?.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 sm:items-center pb-6 border-b border-border/60 last:border-0 last:pb-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface overflow-hidden shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-primary mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-lg font-bold text-primary">
                      {format(item.price * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted mt-1">{format(item.price)} each</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-8 pt-6 border-t border-border/60 space-y-3 text-sm">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span>{format(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping</span>
                <span className={order.shippingCharge === 0 ? "text-accent font-medium" : ""}>
                  {order.shippingCharge === 0 ? 'Free' : format(order.shippingCharge)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg pt-4 border-t border-border/60">
                <span className="font-medium text-primary">Total Amount</span>
                <span className="font-bold text-primary">{format(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-display font-semibold text-primary mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                Order Info
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted">Order ID</span>
                  <span className="font-mono text-xs font-medium text-primary bg-surface-dark px-2 py-1 rounded-md">{order._id.slice(-12).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Placed On</span>
                  <span className="font-medium text-primary">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Shipping Address */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-display font-semibold text-primary mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                Delivery
              </h3>
              <div className="text-sm text-muted space-y-1.5 leading-relaxed bg-surface p-4 rounded-2xl">
                <p className="font-semibold text-primary">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.pincode}
                </p>
                <p className="pt-2 mt-2 border-t border-border/60">{order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-display font-semibold text-primary mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                Payment
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center pb-4 border-b border-border/40">
                  <span className="text-muted">Method</span>
                  <span className="font-semibold text-primary">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Status</span>
                  <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
