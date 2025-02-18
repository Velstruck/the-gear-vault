import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserCircle, LogOut, PlusCircle } from 'lucide-react';
import logoweb from '../assets/logoweb.png';
import { Lightbulb } from 'lucide-react';
import adminpng from '../assets/admin.png';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar p-4 border-b border-border">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-foreground transition-colors">
          <img src={logoweb} className='w-50 h-10 rounded-lg ' alt="Logo" />
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.openSuggestionModal()}
            className="px-3 py-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex gap-1"
          >
            <Lightbulb/>
          </button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <UserCircle className="w-8 h-8 text-foreground cursor-pointer hover:text-foreground/80" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/add-product" className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Add Product
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-red-600">
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/admin/login"
              className="px-3 py-2 rounded-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors flex gap-1"
            >
              <img src={adminpng} className='w-7 h-7'/> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
