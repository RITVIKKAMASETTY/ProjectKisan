import { NavLink } from 'react-router-dom';
import {useUser} from "../features/auth/useUser.js"
export default function SideBar({ isOpen }) {
  const { user } = useUser();

  const farmerLinks = [
    { to: '/farmer/dashboard', label: 'Dashboard' },
    { to: '/farmer/cropland', label: 'Crop Planner' },
    { to: '/farmer/monitor', label: 'Crop Monitor' },
    { to: '/farmer/profile', label: 'Profile' },
  ];

  const buyerLinks = [
    { to: '/buyer/dashboard', label: 'Dashboard' },
    { to: '/buyer/marketplace', label: 'Marketplace' },
  ];

  return (
    <div className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
      <h2 className="text-2xl font-semibold text-center">Menu</h2>
      <nav>
        {user?.role === 'farmer' ? (
          farmerLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `block py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-blue-500' : 'hover:bg-blue-600'}`}
            >
              {link.label}
            </NavLink>
          ))
        ) : (
          buyerLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `block py-2.5 px-4 rounded transition duration-200 ${isActive ? 'bg-blue-500' : 'hover:bg-blue-600'}`}
            >
              {link.label}
            </NavLink>
          ))
        )}
      </nav>
    </div>
  );
}