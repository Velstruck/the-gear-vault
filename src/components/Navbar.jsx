import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoweb from '../assets/logoweb.png'
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold text-foreground hover:text-foreground/80 transition-colors">
            <img src={logoweb} className='w-[200px] rounded-lg hover:border' />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.openSuggestionModal()}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Suggest Product
          </button>
          {user ? (
            <>
              <Link
                to="/admin/add-product"
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                Add Product
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 