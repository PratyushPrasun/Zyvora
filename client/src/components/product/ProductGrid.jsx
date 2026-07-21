import ProductCard from './ProductCard';
import Skeleton from '@/components/ui/Skeleton';

const ProductGrid = ({ products = [], loading, columns = 4 }) => {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className={`grid ${colClasses[columns]} gap-5 sm:gap-7`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <Skeleton.Card key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${colClasses[columns]} gap-5 sm:gap-7`}>
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
