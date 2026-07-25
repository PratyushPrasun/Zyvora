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
import SearchableSelect from '@/components/ui/SearchableSelect';
import { useProduct, useUpdateProduct, useCategories } from '@/hooks/useProducts';

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
  const { data: fetchedCategories = [] } = useCategories();
  const updateProduct = useUpdateProduct();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  // Combine categories and current product category if not present
  const currentCategory = data?.product?.category;
  const categoriesList = currentCategory && !fetchedCategories.includes(currentCategory)
    ? [...fetchedCategories, currentCategory]
    : fetchedCategories;

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [
      ...prev,
      ...selected.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
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
    if (data?.product?.__v !== undefined) {
      fd.append('__v', data.product.__v);
    }
    fd.append('existingImages', JSON.stringify(existingImages));
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
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Edit Product
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5 border-b border-slate-200/60 pb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h3>
              <Input
                label="Product Title"
                {...register('title')}
                error={errors.title?.message}
              />

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 resize-none hover:border-slate-300 text-slate-900"
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-500" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-5 border-b border-slate-200/60 pb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Pricing & Inventory</h3>
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

            <div className="space-y-5 border-b border-slate-200/60 pb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Organization</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      label="Category"
                      placeholder="Select category..."
                      options={categoriesList}
                      value={field.value || ''}
                      onChange={field.onChange}
                      error={errors.category?.message}
                    />
                  )}
                />
                <Input label="Brand" {...register('brand')} />
              </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="pt-2 pb-6 border-b border-slate-200/60">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Current Images</h3>
                  <p className="text-xs text-slate-500">Hover over an image to remove it. First image is the main display photo.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((img, i) => (
                    <div
                      key={img.public_id || i}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group shadow-xs bg-slate-50"
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors transform scale-75 group-hover:scale-100 duration-200 shadow-md"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload Additional Images</h3>
                <p className="text-xs text-slate-500">Upload up to 5 total images for this product.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {previews.map((preview, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group shadow-xs"
                  >
                    <img src={preview} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors transform scale-75 group-hover:scale-100 duration-200 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {existingImages.length + files.length < 5 && (
                  <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-emerald-600 gap-1">
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

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/60">
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
