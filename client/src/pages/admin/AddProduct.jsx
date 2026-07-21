import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, ImagePlus, ArrowLeft } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCreateProduct } from '@/hooks/useProducts';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.string().min(1, 'Price is required'),
  stock: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  brand: z.string().optional(),
});

const AddProduct = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock || '0');
    formData.append('category', data.category);
    formData.append('brand', data.brand || '');
    files.forEach((file) => formData.append('images', file));

    createProduct.mutate(formData, {
      onSuccess: () => navigate('/admin/products'),
    });
  };

  return (
    <>
      <Helmet>
        <title>Add Product — Admin — Zyvora</title>
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
            Add New Product
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5 border-b border-border/40 pb-8">
              <h3 className="text-lg font-semibold text-primary mb-4">Basic Information</h3>
              <Input
                label="Product Title"
                placeholder="e.g. Premium Leather Wallet"
                {...register('title')}
                error={errors.title?.message}
              />

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the product details, features, and care instructions..."
                  {...register('description')}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300 resize-none hover:border-border-dark"
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
                  placeholder="999"
                  {...register('price')}
                  error={errors.price?.message}
                />
                <Input
                  label="Initial Stock"
                  type="number"
                  placeholder="0"
                  {...register('stock')}
                />
              </div>
            </div>

            <div className="space-y-5 border-b border-border/40 pb-8">
              <h3 className="text-lg font-semibold text-primary mb-4">Organization</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Category"
                  placeholder="e.g. Accessories"
                  {...register('category')}
                  error={errors.category?.message}
                />
                <Input
                  label="Brand (Optional)"
                  placeholder="e.g. Zyvora"
                  {...register('brand')}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">Product Images</h3>
                <p className="text-sm text-muted">Upload up to 5 high-quality images. The first image will be the cover.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {previews.map((preview, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/60 group shadow-sm"
                  >
                    <img
                      src={preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
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
              <Button type="submit" variant="glow" size="lg" loading={createProduct.isPending}>
                <Upload className="w-4 h-4" />
                Publish Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
