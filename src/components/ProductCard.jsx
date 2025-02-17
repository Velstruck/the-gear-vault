import PropTypes from 'prop-types';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { databases } from '../services/appwrite';
import { DATABASE_ID, PRODUCTS_COLLECTION_ID } from '../services/appwrite';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

// Store Icons 
const STORE_ICONS = {
  amazon: (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <path fill="#FF9900" d="M39.6,39c-4.2,3.1-10.5,5-15.6,5c-7.3,0-13.8-2.9-18.8-7.4c-0.4-0.4,0-0.8,0.4-0.6c5.4,3.1,11.5,4.9,18.3,4.9c4.6,0,10.4-1,15.1-3C39.7,37.7,40.3,38.5,39.6,39z M41.1,36.9c-0.5-0.7-3.5-0.3-4.8-0.2c-0.4,0-0.5-0.3-0.1-0.6c2.3-1.7,6.2-1.2,6.6-0.6c0.4,0.6-0.1,4.5-2.3,6.3c-0.3,0.3-0.7,0.1-0.5-0.2C40.5,40.4,41.6,37.6,41.1,36.9z" />
      <path fill="#000000" d="M36.9,29.8c-1-1.3-2-2.4-2-4.9v-8.3c0-3.5,0-6.6-2.5-9c-2-1.9-5.3-2.6-7.9-2.6C19,5,14.2,7.2,13,13.4c-0.1,0.7,0.4,1,0.8,1.1l5.1,0.6c0.5,0,0.8-0.5,0.9-1c0.4-2.1,2.1-3.1,4.1-3.1c1.1,0,3.2,0.6,3.2,3v3c-3.2,0-6.6,0-9.4,1.2c-3.3,1.4-5.6,4.3-5.6,8.6c0,5.5,3.4,8.2,7.8,8.2c3.7,0,5.9-0.9,8.8-3.8c0.9,1.4,1.3,2.2,3,3.7c0.4,0.2,0.9,0.2,1.2-0.1l0,0c1-0.9,2.9-2.6,4-3.5C37.4,30.9,37.3,30.3,36.9,29.8z M27,22.1L27,22.1c0,2-0.1,6.9-5,6.9c-3,0-3-3-3-3c0-4.5,4.2-5,8-5V22.1z" />
    </svg>
  ),
  flipkart: (
    <svg
      className="w-5 h-5 flex-shrink-0"
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#2874F0" d="M11,44h26c2.2,0,4-1.8,4-4V8c0-2.2-1.8-4-4-4H11C8.8,4,7,5.8,7,8v32C7,42.2,8.8,44,11,44z" />
      <path fill="#FFF" d="M31.2,21.2c0,0-1.8-2.3-4.3-2.3h-2.3v-4.1c0-0.6-0.5-1.2-1.2-1.2h-3.5c-0.6,0-1.2,0.5-1.2,1.2v13.6c0,0.6,0.5,1.2,1.2,1.2h3.5c0.6,0,1.2-0.5,1.2-1.2v-4.1h2.3c1.4,0,2.7,0.7,3.5,1.8l2.3,3.4c0.3,0.4,0.8,0.7,1.3,0.7h4.1c0.9,0,1.3-1,0.7-1.7L31.2,21.2z" />
      <path fill="#FFF" d="M15.7,28.9V15.3c0-0.6-0.5-1.2-1.2-1.2h-3.5c-0.6,0-1.2,0.5-1.2,1.2v13.6c0,0.6,0.5,1.2,1.2,1.2h3.5C15.2,30.1,15.7,29.6,15.7,28.9z" />
    </svg>
  ),
  other: (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="#ff8a65" />
      <path fill="#fff" d="M19.757,26.828l7.071-7.071l1.414,1.414l-7.071,7.071L19.757,26.828z" />
      <path fill="#fff" d="M24.707,16.222c-0.503,0.503-2.325,2.325-2.828,2.828l1.414,1.414 c0.546-0.546,2.283-2.283,2.828-2.828c1.172-1.172,3.071-1.172,4.243,0s1.172,3.071,0,4.243c-0.546,0.546-2.283,2.283-2.828,2.828 l1.414,1.414c0.503-0.503,2.325-2.325,2.828-2.828c1.952-1.952,1.952-5.119,0-7.071S26.659,14.27,24.707,16.222z M23.293,31.778 c0.503-0.503,2.325-2.325,2.828-2.828l-1.414-1.414c-0.546,0.546-2.283,2.283-2.828,2.828c-1.172,1.172-3.071,1.172-4.243,0 s-1.172-3.071,0-4.243c0.546-0.546,2.283-2.283,2.828-2.828l-1.414-1.414c-0.503,0.503-2.325,2.325-2.828,2.828 c-1.952,1.952-1.952,5.119,0,7.071S21.341,33.73,23.293,31.778z" />
    </svg>
  ),
};

export default function ProductCard({ product, onDelete }) {
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parent] = useAutoAnimate();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.classList.add('animate-fade-in');
    }
  }, []);

  const handleDelete = async () => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        product.$id
      );
      onDelete(product.$id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Card ref={cardRef} className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Admin Controls */}
      {user && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5 text-foreground" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-card rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1" ref={parent}>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/admin/edit-product/${product.$id}`}
                        className={`${active ? 'bg-muted' : ''
                          } flex items-center px-4 py-2 text-sm text-foreground`}
                      >
                        Edit
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className={`${active ? 'bg-muted' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-destructive`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product Details */}
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-1">{product.name}</CardTitle>
        <CardDescription className="mb-4">{product.category}</CardDescription>
        <div className="flex flex-wrap gap-2" ref={parent}>
          {product.amazonUrl && (
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-lg focus:z-10 focus:ring-2 focus:outline-none bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white border-orange-500 hover:border-orange-600"
            >
              {STORE_ICONS.amazon}
              <span className="ml-2">Amazon</span>
            </a>
          )}
          {product.flipkartUrl && (
            <a
              href={product.flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-lg focus:ring-2 focus:outline-none bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-blue-600 hover:border-blue-700"
            >
              {STORE_ICONS.flipkart}
              <span className="ml-2">Flipkart</span>
            </a>
          )}
          {product.otherUrl && (
            <a
              href={product.otherUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium border rounded-lg focus:z-10 focus:ring-2 focus:outline-none bg-gradient-to-r from-teal-500 to-lime-400 hover:from-teal-600 hover:to-lime-500 text-white border-teal-500 hover:border-teal-600"
            >
              {STORE_ICONS.other}
              <span className="ml-2">Other Store</span>
            </a>
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="max-w-md w-full mx-4 animate-fade-in">
            <CardHeader>
              <CardTitle>Delete Product</CardTitle>
              <CardDescription>
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    $id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    amazonUrl: PropTypes.string,
    flipkartUrl: PropTypes.string,
    otherUrl: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}; 