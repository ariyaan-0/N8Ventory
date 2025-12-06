import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Package, ShoppingCart } from 'lucide-react';
import { cn } from './ui';

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded transition",
        location.pathname === to ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-600"
      )}
    >
      <Icon size={20} />
      <span>{children}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold">N8Ventory</div>
          <div className="flex items-center space-x-6">
            <NavLink to="/" icon={Package}>Inventory</NavLink>
            <NavLink to="/orders" icon={ShoppingCart}>Orders</NavLink>
            <div className="flex items-center space-x-4 ml-6 border-l border-blue-500 pl-6">
              <span className="text-sm opacity-90">{user?.name}</span>
              <button onClick={logout} className="p-2 hover:bg-blue-700 rounded-full transition" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
