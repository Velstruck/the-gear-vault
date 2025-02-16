import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SuggestionForm from './components/SuggestionForm';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  // Add the openSuggestionModal function to the window object
  window.openSuggestionModal = () => setIsSuggestionModalOpen(true);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          
          <main className="pb-16"> {/* Added padding to account for theme toggle */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />
            </Routes>
          </main>

          <SuggestionForm
            isOpen={isSuggestionModalOpen}
            onClose={() => setIsSuggestionModalOpen(false)}
          />
          <ThemeToggle />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 