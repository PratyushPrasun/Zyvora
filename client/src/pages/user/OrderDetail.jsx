import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Package, MapPin, CreditCard, Clock, ChevronRight, Download, CheckCircle, Truck } from 'lucide-react';
import { useOrderById } from '@/hooks/useOrders';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import { useDownloadInvoice } from '@/hooks/useInvoice';

const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useOrderById(id);
  const downloadInvoice = useDownloadInvoice();
  const order = data?.order;

  if (isLoading) return <div className="py-32 flex justify-center"><Loader size="lg" /></div>;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const currentStep = statusSteps.indexOf(order.orderStatus);

  const format = (val) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(val);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
  };

  return (
    <>
      <Helmet>
        <title>Order #{order._id.slice(-8).toUpperCase()} — Zyvora</title>
      </Helmet>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 pb-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted mb-2 font-medium">
              <Link to="/account/orders" className="hover:text-primary transition-colors">Orders</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-primary font-mono bg-surface px-2 py-0.5 rounded">{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
              Order Details
            </h1>
            <p className="text-muted mt-2 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge
              variant={
                order.orderStatus === 'Delivered'
                  ? 'success'
                  : order.orderStatus === 'Cancelled'
                  ? 'error'
                  : 'accent'
              }
              dot
              size="lg"
            >
              {order.orderStatus}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadInvoice.mutate(id)}
              loading={downloadInvoice.isPending}
              disabled={downloadInvoice.isPending}
              className="bg-surface"
            >
              <Download className="w-4 h-4 mr-2" />
              Invoice
            </Button>
          </div>
        </motion.div>

        {/* Progress Stepper */}
        {order.orderStatus !== 'Cancelled' && (
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-border/60 p-8 sm:p-12 shadow-sm overflow-x-auto custom-scrollbar relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-10 text-center flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-accent" /> Tracking Status
            </h3>
            
            <div className="flex items-center justify-between min-w-[600px] relative">
              {/* Background Line */}
              <div className="absolute top-6 left-0 right-0 h-1.5 bg-surface-dark rounded-full -z-10" />
              
              {/* Active Progress Line */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                className="absolute top-6 left-0 h-1.5 bg-accent rounded-full -z-10 shadow-[0_0_10px_rgba(34,197,94,0.4)]" 
              />

              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10 w-24">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 * i }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 border-4 border-white ${
                      i <= currentStep
                        ? 'bg-accent text-white shadow-lg shadow-accent/30'
                        : 'bg-surface-dark text-muted-light'
                    }`}
                  >
                    {i < currentStep ? <CheckCircle className="w-6 h-6" /> : i + 1}
                  </motion.div>
                  <span className={`text-xs mt-4 font-semibold uppercase tracking-wider text-center ${i <= currentStep ? 'text-primary' : 'text-muted-light'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-display font-semibold text-primary mb-6 flex items-center gap-3 border-b border-border/60 pb-5">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-accent" />
                </div>
                Items Ordered
              </h3>
              
              <div className="space-y-6">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-5 sm:items-center p-4 rounded-2xl border border-border/40 hover:border-accent/20 hover:bg-surface/30 transition-colors group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface overflow-hidden shrink-0 border border-border/60">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-light">
                           <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-primary mb-1 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm font-mono text-muted bg-surface-dark inline-block px-2 py-0.5 rounded">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-lg font-bold text-primary">
                        {format(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted mt-1 font-medium">{format(item.price)} each</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals Summary */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm">
              <div className="space-y-4 text-sm font-medium max-w-sm ml-auto">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="text-primary">{format(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span className={order.shippingCharge === 0 ? "text-accent font-bold" : "text-primary"}>
                    {order.shippingCharge === 0 ? 'Free' : format(order.shippingCharge)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/60">
                  <span className="text-base font-bold text-primary">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">{format(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            
            {/* Shipping Address */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm hover:border-accent/30 transition-colors">
              <h3 className="text-lg font-display font-semibold text-primary mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                Delivery Address
              </h3>
              <div className="text-sm text-muted space-y-1.5 leading-relaxed bg-surface p-5 rounded-2xl border border-border/40">
                <p className="font-semibold text-primary text-base mb-2">{order.shippingAddress?.fullName}</p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.pincode}
                </p>
                <p className="pt-3 mt-3 border-t border-border/60 font-mono text-xs">{order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-3xl border border-border/60 p-6 sm:p-8 shadow-sm hover:border-accent/30 transition-colors">
              <h3 className="text-lg font-display font-semibold text-primary mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-accent" />
                </div>
                Payment Method
              </h3>
              <div className="space-y-4 text-sm bg-surface p-5 rounded-2xl border border-border/40">
                <div className="flex justify-between items-center pb-4 border-b border-border/60">
                  <span className="text-muted font-medium">Method</span>
                  <span className="font-bold text-primary flex items-center gap-2">
                    {order.paymentMethod === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted font-medium">Status</span>
                  <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'} dot>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default OrderDetail;
