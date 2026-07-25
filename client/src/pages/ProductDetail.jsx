import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingBag, Minus, Plus, Package, Truck, Shield, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Price from '@/components/ui/Price';
import Rating from '@/components/ui/Rating';
import Button from '@/components/ui/Button';
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

gsap.registerPlugin(ScrollTrigger);

const TABS = ['Description', 'Details', 'Shipping & Returns'];

const ProductDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useProduct(id);
  const { isAuthenticated, user } = useAuthContext();
  const addToCart = useAddToCart();
  const addReview = useAddReview(id);
  const deleteReview = useDeleteReview(id);
  const { data: reviewsData, isLoading: isReviewsLoading } = useReviews(id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [showStickyAdd, setShowStickyAdd] = useState(false);
  
  const infoRef = useRef(null);
  const relatedRef = useRef(null);
  const addBtnRef = useRef(null);

  const product = data?.product;

  // Related products (same category)
  const { data: relatedData } = useProducts(
    product ? { category: product.category, limit: 4 } : {}
  );
  const relatedProducts =
    relatedData?.products?.filter((p) => p._id !== id)?.slice(0, 4) || [];

  // GSAP Animations
  useEffect(() => {
    if (!isLoading && product && infoRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.info-item', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
      }, infoRef);
      return () => ctx.revert();
    }
  }, [isLoading, product]);

  // Scroll reveal for related products
  useEffect(() => {
    if (relatedProducts.length > 0 && relatedRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.related-title', {
          scrollTrigger: {
            trigger: relatedRef.current,
            start: 'top 80%',
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }, relatedRef);
      return () => ctx.revert();
    }
  }, [relatedProducts]);

  // Sticky add to cart on mobile scroll
  useEffect(() => {
    const handleScroll = () => {
      if (addBtnRef.current) {
        const btnRect = addBtnRef.current.getBoundingClientRect();
        // Show sticky bar when the original button scrolls out of view upwards
        setShowStickyAdd(btnRect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="h-64 bg-gradient-to-b from-white to-surface w-full absolute top-0 left-0 right-0 z-0 pointer-events-none" />
        
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductImageGallery images={product.images} />
            </motion.div>

            {/* Info */}
            <div ref={infoRef} className="space-y-6 lg:py-6">
              <div className="info-item">
                <div className="flex items-center gap-3 mb-3">
                  {product.brand && (
                    <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold bg-white px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
                      {product.brand}
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="text-[10px] text-warning-dark bg-warning/15 font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-warning/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                      Only {product.stock} left
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight leading-[1.1] mb-5">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl inline-flex border border-border/40 shadow-sm">
                  <Rating
                    value={product.averageRating}
                    count={product.totalReviews}
                    showValue
                  />
                  <div className="w-px h-4 bg-border/60" />
                  <button 
                    className="text-sm font-medium text-muted hover:text-accent transition-colors" 
                    onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Read Reviews
                  </button>
                </div>
              </div>

              <div className="info-item card-premium px-6 py-6 my-8">
                <Price amount={product.price} size="xl" />
                <p className="text-xs text-muted-light mt-2 uppercase tracking-wider">Inclusive of all taxes</p>
              </div>

              {/* Action Area */}
              <div className="info-item">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-2 text-sm font-semibold text-accent-dark mb-4 bg-accent/5 inline-flex px-3 py-1.5 rounded-lg border border-accent/10">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    In Stock & Ready to Ship
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-medium text-error mb-4">
                    <span className="w-2 h-2 rounded-full bg-error" />
                    Out of Stock
                  </span>
                )}

                {product.stock > 0 && isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4" ref={addBtnRef}>
                    <div className="flex items-center bg-surface-dark border border-border/80 rounded-2xl h-14 w-full sm:w-auto p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-full flex items-center justify-center bg-white rounded-xl shadow-sm text-primary hover:text-accent hover:border-accent/30 transition-all border border-transparent"
                        aria-label="Decrease"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 sm:w-14 h-full flex items-center justify-center text-base font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-full flex items-center justify-center bg-white rounded-xl shadow-sm text-primary hover:text-accent hover:border-accent/30 transition-all border border-transparent"
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
                      className="flex-1 rounded-2xl"
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Add to Bag
                    </Button>
                  </div>
                )}

                {!isAuthenticated && (
                  <Button variant="accent" size="xl" fullWidth onClick={() => window.location.href = '/login'} className="rounded-2xl">
                    Sign in to Purchase
                  </Button>
                )}
              </div>

              {/* Info Strips */}
              <div className="info-item grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 mt-6">
                {[
                  { icon: Truck, title: 'Free Premium Delivery', text: 'On orders above ₹1,000' },
                  { icon: Shield, title: 'Secure Payment', text: 'Checkout safely with Razorpay' },
                  { icon: Package, title: 'Quality Assured', text: 'Premium curated products' },
                  { icon: CheckCircle2, title: 'Authentic', text: '100% Genuine guarantee' },
                ].map((info) => (
                  <div key={info.title} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-border/40 hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                    <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-primary group-hover:text-accent-dark transition-colors">{info.title}</h4>
                      <p className="text-[11px] text-muted mt-0.5">{info.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-20 lg:mt-32">
            <div className="flex items-center justify-center gap-8 border-b border-border/60 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-4 px-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab ? 'text-primary' : 'text-muted hover:text-primary'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            
            <div className="py-10 max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'Description' && (
                    <div className="prose prose-sm sm:prose-base prose-p:text-muted prose-p:leading-relaxed prose-p:font-light max-w-none text-center">
                      <p>{product.description}</p>
                    </div>
                  )}
                  {activeTab === 'Details' && (
                    <div className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex justify-between py-3 border-b border-border/40">
                          <span className="text-muted text-sm">Brand</span>
                          <span className="font-medium text-primary text-sm">{product.brand || 'Zyvora'}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border/40">
                          <span className="text-muted text-sm">Category</span>
                          <span className="font-medium text-primary text-sm">{product.category}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border/40">
                          <span className="text-muted text-sm">Product ID</span>
                          <span className="font-mono font-medium text-primary text-sm">{product._id.slice(-6)}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border/40">
                          <span className="text-muted text-sm">Authenticity</span>
                          <span className="font-medium text-success text-sm flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'Shipping & Returns' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm">
                        <Truck className="w-8 h-8 text-accent mb-4" />
                        <h4 className="font-semibold text-primary mb-2">Shipping Information</h4>
                        <p className="text-sm text-muted leading-relaxed font-light mb-4">
                          Free standard shipping on all orders over ₹1,000. Express delivery options available at checkout.
                        </p>
                        <ul className="text-sm text-muted space-y-2">
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border-dark" /> Standard: 3-5 business days</li>
                          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-border-dark" /> Express: 1-2 business days</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded-3xl border border-border/60 p-8 shadow-sm">
                        <Package className="w-8 h-8 text-accent mb-4" />
                        <h4 className="font-semibold text-primary mb-2">Return Policy</h4>
                        <p className="text-sm text-muted leading-relaxed font-light mb-4">
                          We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached.
                        </p>
                        <span className="text-xs font-semibold text-accent-dark bg-accent/10 px-3 py-1 rounded-full">Easy 14-day Returns</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mt-10 pt-16 border-t border-border/60">
            <h2 className="text-3xl font-display font-bold text-primary mb-12 text-center">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Review Form & Summary */}
              <div className="lg:col-span-1 space-y-6">
                {/* Summary Card */}
                <div className="bg-white rounded-3xl p-8 border border-border/60 shadow-sm text-center">
                  <h3 className="text-5xl font-display font-bold text-primary mb-2">{product.averageRating.toFixed(1)}</h3>
                  <div className="flex justify-center mb-2">
                    <Rating value={product.averageRating} count={0} size="lg" />
                  </div>
                  <p className="text-sm text-muted">Based on {product.totalReviews} reviews</p>
                </div>

                {isAuthenticated ? (
                  <div className="bg-white rounded-3xl p-8 border border-border/60 shadow-sm">
                    <h3 className="font-semibold text-primary mb-6 text-lg">Write a Review</h3>
                    <ReviewForm
                      onSubmit={handleSubmitReview}
                      loading={addReview.isPending}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-border/60 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 rotate-12">
                      <Shield className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-primary mb-2">Join the conversation</h3>
                    <p className="text-sm text-muted mb-8">
                      Sign in to share your experience with other customers.
                    </p>
                    <Button onClick={() => window.location.href = '/login'} variant="outline" fullWidth>
                      Sign In
                    </Button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2">
                {isReviewsLoading ? (
                  <div className="bg-white rounded-3xl p-8 border border-border/60 space-y-6">
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
                  <div className="bg-white rounded-3xl p-12 border border-border/60 text-center flex flex-col items-center justify-center h-full shadow-sm">
                    <span className="text-5xl mb-6">✨</span>
                    <h3 className="font-semibold text-primary mb-2 text-lg">No reviews yet</h3>
                    <p className="text-muted text-sm max-w-sm mx-auto">
                      Be the first to review this product and help others make an informed decision.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-2 sm:p-8 border border-border/60 shadow-sm">
                    <div className="px-4 sm:px-0">
                      {reviews.map((review) => (
                        <ReviewCard
                          key={review._id}
                          review={review}
                          isOwner={user?._id === review.user?._id || user?.id === review.user?._id}
                          onDelete={() => deleteReview.mutate()}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div ref={relatedRef} className="mt-32 pt-16 border-t border-border/60">
              <div className="related-title text-center mb-12">
                <h2 className="text-3xl font-display font-bold text-primary">
                  You May Also Like
                </h2>
                <p className="text-muted mt-3 font-light">More from this collection</p>
              </div>
              <ProductGrid products={relatedProducts} columns={4} />
            </div>
          )}
        </Container>
      </div>

      {/* Sticky Mobile Add to Cart */}
      <AnimatePresence>
        {showStickyAdd && isAuthenticated && product.stock > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border/60 z-40 sm:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
          >
            <Button
              size="lg"
              variant="glow"
              fullWidth
              onClick={handleAddToCart}
              loading={addToCart.isPending}
              className="rounded-2xl h-14"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Add to Bag — <Price amount={product.price * quantity} className="ml-1 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductDetail;
