import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Trash2, Star, Edit2, CheckCircle, Home, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/hooks/useAddresses';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';

const schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
  country: z.string().default('India'),
  addressType: z.enum(['Home', 'Office', 'Other']).default('Home'),
});

const Addresses = () => {
  const { data, isLoading, isError, refetch } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [modal, setModal] = useState({ open: false, edit: null });

  const addresses = data?.addresses || [];

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: 'India', addressType: 'Home' },
  });

  const addressTypeWatch = watch('addressType');

  const openAdd = () => {
    reset({ country: 'India', addressType: 'Home' });
    setModal({ open: true, edit: null });
  };

  const openEdit = (addr) => {
    reset(addr);
    setModal({ open: true, edit: addr });
  };

  const onSubmit = (formData) => {
    if (modal.edit) {
      updateAddress.mutate(
        { id: modal.edit._id, data: formData },
        { onSuccess: () => setModal({ open: false, edit: null }) }
      );
    } else {
      addAddress.mutate(formData, {
        onSuccess: () => setModal({ open: false, edit: null }),
      });
    }
  };

  const getIconForType = (type) => {
    if (type === 'Home') return <Home className="w-4 h-4" />;
    if (type === 'Office') return <Briefcase className="w-4 h-4" />;
    return <MapPin className="w-4 h-4" />;
  };

  return (
    <>
      <Helmet>
        <title>Addresses — Zyvora</title>
      </Helmet>

      <div className="pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
              Saved Addresses
            </h1>
            <p className="text-muted mt-1 text-sm">Manage where we deliver your premium orders</p>
          </div>
          <Button size="lg" variant="glow" onClick={openAdd} className="rounded-2xl">
            <Plus className="w-5 h-5 mr-2" /> Add New Address
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : addresses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-border/60 p-12 shadow-sm text-center min-h-[400px] flex items-center justify-center"
          >
            <EmptyState
              icon={MapPin}
              title="No addresses saved"
              description="Add a shipping address to speed up your checkout process."
              action={openAdd}
              actionLabel="Add Address"
            />
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {addresses.map((addr) => (
                <motion.div
                  layout
                  key={addr._id}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 20 },
                    show: { opacity: 1, scale: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-3xl border p-6 sm:p-8 transition-all duration-300 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 ${
                    addr.isDefault
                      ? 'border-accent shadow-md shadow-accent/10'
                      : 'border-border/60 hover:border-accent/40'
                  }`}
                >
                  {addr.isDefault && (
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl -z-10" />
                  )}
                  
                  <div className="flex items-start justify-between mb-6 border-b border-border/40 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${addr.isDefault ? 'bg-accent/10 text-accent' : 'bg-surface border border-border/80 text-muted'}`}>
                        {getIconForType(addr.addressType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-primary">{addr.addressType}</h3>
                          {addr.isDefault && (
                            <Badge variant="accent" size="sm" dot>Default</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(addr)}
                        className="w-8 h-8 rounded-xl bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all duration-300 shadow-sm"
                        aria-label="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAddress.mutate(addr._id)}
                        className="w-8 h-8 rounded-xl bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-error hover:border-error hover:bg-error/5 transition-all duration-300 shadow-sm"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-muted space-y-2 leading-relaxed pl-13">
                    <p className="font-semibold text-primary text-base">{addr.fullName}</p>
                    <p className="font-light">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="font-light">{addr.addressLine2}</p>}
                    <p className="font-light">
                      {addr.city}, {addr.state} <span className="font-mono bg-surface-dark px-1.5 rounded">{addr.pincode}</span>
                    </p>
                    <p className="pt-3 mt-3 border-t border-border/40 font-mono text-xs">{addr.phone}</p>
                  </div>

                  {!addr.isDefault && (
                    <div className="mt-6 pl-13">
                      <button
                        onClick={() => setDefault.mutate(addr._id)}
                        className="text-sm font-semibold text-muted hover:text-accent flex items-center gap-1.5 transition-colors group/btn bg-surface px-4 py-2 rounded-xl border border-border/60 hover:border-accent/30"
                      >
                        <Star className="w-4 h-4 text-muted group-hover/btn:text-accent group-hover/btn:fill-accent transition-all duration-300" /> 
                        Set as Default
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, edit: null })}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <MapPin className="w-5 h-5" />
              </div>
              {modal.edit ? 'Edit Address' : 'Add New Address'}
            </div>
          }
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            
            {/* Address Type Selector */}
            <div className="bg-surface p-2 rounded-2xl flex gap-2 mb-6">
              {['Home', 'Office', 'Other'].map((type) => (
                <label key={type} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value={type}
                    {...register('addressType')}
                    className="hidden"
                  />
                  <div className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    addressTypeWatch === type 
                      ? 'bg-white text-primary shadow-sm border border-border/60' 
                      : 'text-muted hover:text-primary hover:bg-white/50'
                  }`}>
                    {getIconForType(type)}
                    {type}
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
              <Input
                label="Phone Number"
                placeholder="10-digit number"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>

            <div className="space-y-5">
              <Input
                label="Address Line 1"
                placeholder="Flat / House No / Building"
                {...register('addressLine1')}
                error={errors.addressLine1?.message}
              />
              <Input
                label="Address Line 2 (Optional)"
                placeholder="Area / Sector / Locality"
                {...register('addressLine2')}
              />
              <Input 
                label="Landmark (Optional)" 
                placeholder="E.g. Near Apollo Hospital"
                {...register('landmark')} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="City"
                placeholder="City"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State"
                placeholder="State"
                {...register('state')}
                error={errors.state?.message}
              />
              <Input
                label="Pincode"
                placeholder="6 Digits"
                {...register('pincode')}
                error={errors.pincode?.message}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 mt-4 border-t border-border/60">
              <Button
                variant="outline"
                type="button"
                size="lg"
                onClick={() => setModal({ open: false, edit: null })}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                size="lg"
                loading={addAddress.isPending || updateAddress.isPending}
                className="w-full sm:w-auto min-w-[150px]"
              >
                {modal.edit ? 'Save Changes' : 'Add Address'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Addresses;
