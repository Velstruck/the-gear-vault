import { useState } from 'react';
import { createProduct, uploadImage } from '../services/appwrite';

export default function AdminForm() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null,
    imageUrl: '',
    amazonUrl: '',
    flipkartUrl: '',
    otherUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let finalImageUrl = formData.imageUrl;

      // If a file is selected, upload it first
      if (formData.image) {
        const uploadResult = await uploadImage(formData.image);
        finalImageUrl = uploadResult.$id; // Use the file ID from Appwrite
      }

      // Create the product with all data
      await createProduct({
        name: formData.name,
        category: formData.category,
        image: finalImageUrl,
        amazonUrl: formData.amazonUrl || null,
        flipkartUrl: formData.flipkartUrl || null,
        otherUrl: formData.otherUrl || null,
      });

      setSuccess(true);
      setFormData({
        name: '',
        category: '',
        image: null,
        imageUrl: '',
        amazonUrl: '',
        flipkartUrl: '',
        otherUrl: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Product added successfully!
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
            Product Image *
          </label>
          <div className="space-y-2">
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

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || (!formData.image && !formData.imageUrl)}
            className="w-full btn btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 