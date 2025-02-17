import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { databases, storage } from '../services/appwrite';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID, BUCKET_ID } from '../services/appwrite';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftFromLine } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null,
    imageUrl: '',
    amazonUrl: '',
    flipkartUrl: '',
    otherUrl: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchProduct();
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const product = await databases.getDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id
      );
      setFormData({
        name: product.name,
        category: product.category,
        imageUrl: product.image,
        amazonUrl: product.amazonUrl || '',
        flipkartUrl: product.flipkartUrl || '',
        otherUrl: product.otherUrl || '',
      });
    } catch (error) {
      setError('Failed to fetch product details.');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;

      // If a new file is selected, upload it
      if (formData.image) {
        const uploadResult = await storage.createFile(
          BUCKET_ID,
          'unique()',
          formData.image
        );
        finalImageUrl = uploadResult.$id;
      }

      // Update the product
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        id,
        {
          name: formData.name,
          category: formData.category,
          image: finalImageUrl,
          amazonUrl: formData.amazonUrl || null,
          flipkartUrl: formData.flipkartUrl || null,
          otherUrl: formData.otherUrl || null,
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imageUrl: '', // Clear URL if file is selected
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link to='/' className="text-foreground hover:text-foreground/80 transition-colors" about='Back'>
        <ArrowLeftFromLine />
      </Link>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            Product updated successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-500 mb-1">
              Category *
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Product Image
            </label>
            <div className="space-y-2">
              {formData.imageUrl && (
                <div className="w-32 h-32 mb-2">
                  <img
                    src={formData.imageUrl}
                    alt="Current product"
                    className="object-cover w-full h-full rounded"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              <div className="- or -">
                <span className="text-gray-500">OR</span>
              </div>
              <input
                type="url"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value, image: null }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="amazonUrl" className="block text-sm font-medium text-gray-500 mb-1">
              Amazon URL
            </label>
            <input
              type="url"
              id="amazonUrl"
              value={formData.amazonUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, amazonUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="flipkartUrl" className="block text-sm font-medium text-gray-500 mb-1">
              Flipkart URL
            </label>
            <input
              type="url"
              id="flipkartUrl"
              value={formData.flipkartUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, flipkartUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="otherUrl" className="block text-sm font-medium text-gray-500 mb-1">
              Other Store URL
            </label>
            <input
              type="url"
              id="otherUrl"
              value={formData.otherUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, otherUrl: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 