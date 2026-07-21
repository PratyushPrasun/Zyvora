import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, Trash2, Star, Edit2, CheckCircle } from 'lucide-react';
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { country: 'India', addressType: 'Home' },
  });

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

  return (
    <>
      <Helmet>
        <title>Addresses — Zyvora</title>
      </Helmet>

      <div className="pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
            My Addresses
          </h1>
          <Button size="md" variant="glow" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add Address
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-56 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/60 p-12 shadow-sm text-center">
            <EmptyState
              icon={MapPin}
              title="No addresses saved"
              description="Add a shipping address to get started."
              action={openAdd}
              actionLabel="Add Address"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-white rounded-3xl border p-6 sm:p-8 transition-all duration-300 relative overflow-hidden group ${
                  addr.isDefault
                    ? 'border-accent shadow-sm shadow-accent/5'
                    : 'border-border/60 hover:border-accent/40 shadow-sm'
                }`}
              >
                {addr.isDefault && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -z-10" />
                )}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Badge variant={addr.isDefault ? 'accent' : 'default'}>
                      {addr.addressType}
                    </Badge>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-success">
                        <CheckCircle className="w-3.5 h-3.5" /> Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(addr)}
                      className="w-8 h-8 rounded-xl bg-surface-dark flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                      aria-label="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAddress.mutate(addr._id)}
                      className="w-8 h-8 rounded-xl bg-surface-dark flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-muted space-y-1.5 leading-relaxed bg-surface/50 p-5 rounded-2xl mb-4">
                  <p className="font-semibold text-primary text-base mb-1">{addr.fullName}</p>
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="pt-2 mt-2 border-t border-border/40">{addr.phone}</p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault.mutate(addr._id)}
                    className="text-sm font-medium text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
                  >
                    <Star className="w-4 h-4" /> Set as default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modal.open}
          onClose={() => setModal({ open: false, edit: null })}
          title={modal.edit ? 'Edit Address' : 'Add New Address'}
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                {...register('fullName')}
                error={errors.fullName?.message}
              />
              <Input
                label="Phone Number"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>
            <Input
              label="Address Line 1"
              {...register('addressLine1')}
              error={errors.addressLine1?.message}
            />
            <Input
              label="Address Line 2 (Optional)"
              {...register('addressLine2')}
            />
            <Input label="Landmark (Optional)" {...register('landmark')} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State"
                {...register('state')}
                error={errors.state?.message}
              />
              <Input
                label="Pincode"
                {...register('pincode')}
                error={errors.pincode?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                Address Type
              </label>
              <div className="flex gap-4">
                {['Home', 'Office', 'Other'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      value={type}
                      {...register('addressType')}
                      className="w-4 h-4 text-accent border-border focus:ring-accent/20 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-muted group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t border-border/60">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setModal({ open: false, edit: null })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="glow"
                loading={addAddress.isPending || updateAddress.isPending}
              >
                {modal.edit ? 'Update' : 'Save'} Address
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Addresses;
