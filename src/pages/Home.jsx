import { useState, useEffect } from 'react';
import { getProducts } from '../services/appwrite';
import ProductCard from '../components/ProductCard';
import { ProductSkeletonGrid } from '../components/ProductSkeleton';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parent] = useAutoAnimate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError('Failed to load products. Please refresh the page.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setProducts(products.filter(product => product.$id !== deletedId));
  };

  if (loading) {
    return (
      <div className="container py-8 animate-fade-in">
        <ProductSkeletonGrid />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {products.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No products available yet.</p>
          <p className="mt-2">Check back soon or suggest a product!</p>
        </div>
      ) : (
        <div ref={parent} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard 
              key={product.$id} 
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
} 