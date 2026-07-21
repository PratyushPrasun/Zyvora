import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ShoppingBag, Minus, Plus, Package, Truck, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Price from '@/components/ui/Price';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ReviewCard from '@/components/product/ReviewCard';
import ReviewForm from '@/components/product/ReviewForm';
import ProductGrid from '@/components/product/ProductGrid';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useReviews, useAddReview, useDeleteReview } from '@/hooks/useReviews';
import { useAuthContext } from '@/contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useProduct(id);
  const { isAuthenticated, user } = useAuthContext();
  const addToCart = useAddToCart();
  const addReview = useAddReview(id);
  const deleteReview = useDeleteReview(id);
  const { data: reviewsData, isLoading: isReviewsLoading } = useReviews(id);
  const [quantity, setQuantity] = useState(1);
  const infoRef = useRef(null);

  const product = data?.product;

  // Related products (same category)
  const { data: relatedData } = useProducts(
    product ? { category: product.category, limit: 4 } : {}
  );
  const relatedProducts =
    relatedData?.products?.filter((p) => p._id !== id)?.slice(0, 4) || [];

  useEffect(() => {
    if (!isLoading && product && infoRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.info-item', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }, infoRef);
      return () => ctx.revert();
    }
  }, [isLoading, product]);

  if (isLoading) return <Loader size="lg" />;
  if (isError || !product)
    return (
      <Container className="py-20">
        <ErrorState onRetry={refetch} />
      </Container>
    );

  const reviews = reviewsData?.reviews || [];

  const handleAddToCart = () => {
    addToCart.mutate({ productId: product._id, quantity });
  };

  const handleSubmitReview = (reviewData, onSuccess) => {
    addReview.mutate(reviewData, {
      onSuccess: () => onSuccess?.(),
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.title} — Zyvora</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
      </Helmet>

      <div className="bg-surface min-h-screen pb-16">
        {/* Subtle top gradient */}
        <div className="h-40 bg-gradient-to-b from-white to-surface w-full absolute top-0 left-0 right-0 z-0" />
        
        <Container className="pt-8 relative z-10">
          <Breadcrumb
            items={[
              { label: 'Shop', href: '/shop' },
              { label: product.category, href: `/shop?category=${product.category}` },
              { label: product.title },
            ]}
          />

          {/* Product Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <ProductImageGallery images={product.images} />
            </motion.div>

            {/* Info */}
            <div ref={infoRef} className="space-y-6 lg:py-6">
              <div className="info-item">
                <div className="flex items-center gap-3 mb-2">
                  {product.brand && (
                    <p className="text-xs text-muted uppercase tracking-[0.2em] font-semibold bg-white px-3 py-1 rounded-lg border border-border/60">
                      {product.brand}
                    </p>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="text-xs text-warning bg-warning/10 font-medium px-3 py-1 rounded-lg">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight leading-tight mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <Rating
                    value={product.averageRating}
                    count={product.totalReviews}
                    showValue
                  />
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-sm text-muted cursor-pointer hover:text-accent transition-colors" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>
                    Read Reviews
                  </span>
                </div>
              </div>

              <div className="info-item border-y border-border/60 py-6 my-6 bg-white/50 rounded-2xl px-6">
                <Price amount={product.price} size="xl" />
              </div>

              <p className="info-item text-muted leading-relaxed text-base lg:text-lg font-light">
                {product.description}
              </p>

              <div className="info-item pt-4">
                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-2 text-sm font-medium text-success">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      In Stock & Ready to Ship
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-sm font-medium text-error">
                      <span className="w-2 h-2 rounded-full bg-error" />
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Quantity + Add to Cart */}
                {product.stock > 0 && isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-border/80 bg-white rounded-xl h-14 w-full sm:w-auto">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-14 h-full flex items-center justify-center hover:bg-surface-dark transition-colors rounded-l-xl text-muted hover:text-primary"
                        aria-label="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 sm:w-14 h-full flex items-center justify-center text-base font-medium border-x border-border/60">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-14 h-full flex items-center justify-center hover:bg-surface-dark transition-colors rounded-r-xl text-muted hover:text-primary"
                        aria-label="Increase"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <Button
                      size="xl"
                      variant="glow"
                      onClick={handleAddToCart}
                      loading={addToCart.isPending}
                      className="flex-1"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Add to Bag
                    </Button>
                  </div>
                )}

                {!isAuthenticated && (
                  <Button variant="accent" size="xl" fullWidth onClick={() => window.location.href = '/login'}>
                    Sign in to Purchase
                  </Button>
                )}
              </div>

              {/* Info Strips */}
              <div className="info-item space-y-4 pt-6 mt-6">
                {[
                  { icon: Truck, title: 'Free Premium Delivery', text: 'On orders above ₹1,000' },
                  { icon: Shield, title: 'Secure Payment', text: 'Checkout safely with Razorpay' },
                  { icon: Package, title: 'Quality Assured', text: 'Premium curated products' },
                ].map((info) => (
                  <div key={info.title} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border/40 hover:border-accent/20 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary">{info.title}</h4>
                      <p className="text-xs text-muted mt-0.5">{info.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mt-24 pt-16 border-t border-border/60">
            <h2 className="text-3xl font-display font-bold text-primary mb-10 text-center">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Review Form */}
              <div className="lg:col-span-1">
                {isAuthenticated ? (
                  <div className="bg-white rounded-2xl p-6 border border-border/60 shadow-sm">
                    <h3 className="font-semibold text-primary mb-4 text-lg">Write a Review</h3>
                    <ReviewForm
                      onSubmit={handleSubmitReview}
                      loading={addReview.isPending}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 border border-border/60 text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Shield className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-primary mb-2">Join the conversation</h3>
                    <p className="text-sm text-muted mb-6">
                      Sign in to share your experience with other customers.
                    </p>
                    <Button onClick={() => window.location.href = '/login'} variant="outline">
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {isReviewsLoading ? (
                  <div className="bg-white rounded-2xl p-6 border border-border/60 space-y-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse space-y-3 border-b border-border/60 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-dark" />
                          <div className="space-y-1.5">
                            <div className="h-3.5 w-24 bg-surface-dark rounded" />
                            <div className="h-3 w-20 bg-surface-dark rounded" />
                          </div>
                        </div>
                        <div className="h-3 w-full bg-surface-dark rounded" />
                        <div className="h-3 w-3/4 bg-surface-dark rounded" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 border border-border/60 text-center flex flex-col items-center justify-center h-full">
                    <span className="text-4xl mb-4">✨</span>
                    <h3 className="font-semibold text-primary mb-2">No reviews yet</h3>
                    <p className="text-muted text-sm max-w-sm mx-auto">
                      Be the first to review this product and help others make an informed decision.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 border border-border/60">
                    {reviews.map((review) => (
                      <ReviewCard
                        key={review._id}
                        review={review}
                        isOwner={user?._id === review.user?._id || user?.id === review.user?._id}
                        onDelete={() => deleteReview.mutate()}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-border/60">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-display font-bold text-primary">
                    You May Also Like
                  </h2>
                  <p className="text-muted mt-2">More from this collection</p>
                </div>
              </div>
              <ProductGrid products={relatedProducts} columns={4} />
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default ProductDetail;
