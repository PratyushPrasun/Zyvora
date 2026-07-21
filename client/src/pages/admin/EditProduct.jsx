import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, X, ImagePlus, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().min(0, 'Price is required'),
  stock: z.coerce.number().min(0).optional(),
  category: z.string().min(2, 'Category is required'),
  brand: z.string().optional(),
});

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (data?.product) {
      const p = data.product;
      reset({
        title: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: p.category,
        brand: p.brand,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExistingImages(p.images || []);
    }
  }, [data, reset]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeNewFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = (formData) => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) fd.append(key, val);
    });
    files.forEach((file) => fd.append('images', file));

    updateProduct.mutate(
      { id, formData: fd },
      { onSuccess: () => navigate('/admin/products') }
    );
  };

  if (isLoading) return <div className="p-12 flex justify-center"><Loader size="lg" /></div>;

  return (
    <>
      <Helmet>
        <title>Edit Product — Admin — Zyvora</title>
      </Helmet>

      <div className="max-w-3xl pb-12">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/admin/products')}
            className="w-10 h-10 rounded-xl bg-white border border-border/60 flex items-center justify-center text-muted hover:text-primary hover:border-border transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-display font-bold text-primary tracking-tight">
            Edit Product
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5 border-b border-border/40 pb-8">
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              <Input
                label="Product Title"
                {...register('title')}
                error={errors.title?.message}
              />

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300 resize-none hover:border-border-dark"
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-error" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5 border-b border-border/40 pb-8">
              <h3 className="text-lg font-semibold text-primary mb-4">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Price (₹)"
                  type="number"
                  {...register('price')}
                  error={errors.price?.message}
                />
                <Input label="Stock" type="number" {...register('stock')} />
              </div>
            </div>

            <div className="space-y-5 border-b border-border/40 pb-8">
              <h3 className="text-lg font-semibold text-primary mb-4">Organization</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Category"
                  {...register('category')}
                  error={errors.category?.message}
                />
                <Input label="Brand" {...register('brand')} />
              </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="pt-2 pb-6 border-b border-border/40">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary mb-1">Current Images</h3>
                  <p className="text-sm text-muted">These images are currently live on the product page.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((img, i) => (
                    <div
                      key={i}
                      className="w-24 h-24 rounded-2xl overflow-hidden border border-border/60 shadow-sm"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-warning mt-4 bg-warning/10 inline-block px-3 py-2 rounded-lg border border-warning/20">
                  Note: Uploading new images below will replace all existing ones.
                </p>
              </div>
            )}

            {/* New Images */}
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Upload New Images</h3>
                <p className="text-sm text-muted">Upload up to 5 high-quality images. The first image will be the cover.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {previews.map((preview, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/60 group shadow-sm"
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:bg-error-dark transition-colors transform scale-75 group-hover:scale-100 duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {files.length < 5 && (
                  <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-border hover:border-accent hover:bg-accent/[0.02] flex flex-col items-center justify-center cursor-pointer transition-colors text-muted hover:text-accent gap-1">
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border/60">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/admin/products')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="glow" size="lg" loading={updateProduct.isPending}>
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
