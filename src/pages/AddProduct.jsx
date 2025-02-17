import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account } from '../services/appwrite';
import AdminForm from '../components/AdminForm';
import { ArrowLeftFromLine } from 'lucide-react';

export default function AddProduct() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await account.get();
      setLoading(false);
    } catch (err) {
      console.error('Auth check failed:', err);
      navigate('/admin/login');
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
      <AdminForm />
    </div>
  );
} 