import { CiFolderOn, CiBoxList, CiGrid41 } from 'react-icons/ci';
import { PiUsersLight } from 'react-icons/pi';
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Get current path

  // Function to check if the current path is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-56 bg-white shadow-md fixed top-0 left-0 z-40">
      <ul className="p-4 mt-12">
        <Link to="/dashboard">
          <li className={`mb-4 p-2 rounded flex items-center ${isActive('/dashboard') ? 'bg-purple-600 text-white' : 'hover:bg-purple-600 text-gray-800 hover:text-white'}`}>
            <CiGrid41 className={`inline-block mr-2 ${isActive('/dashboard') ? 'text-white' : 'text-inherit'}`} /> 
            <span className={`inline-block text-sm ${isActive('/dashboard') ? 'text-white' : 'text-inherit'}`}>Dashboard</span>
          </li>
        </Link>
        <Link to="/projects">
          <li className={`mb-4 p-2 rounded flex items-center ${isActive('/projects') ? 'bg-purple-600 text-white' : 'hover:bg-purple-600 text-gray-800 hover:text-white'}`}>
            <CiFolderOn className={`inline-block mr-2 ${isActive('/projects') ? 'text-white' : 'text-inherit'}`} /> 
            <span className={`inline-block text-sm ${isActive('/projects') ? 'text-white' : 'text-inherit'}`}>Projects</span>
          </li>
        </Link>
        <Link to="/teams">
          <li className={`mb-4 p-2 rounded flex items-center ${isActive('/teams') ? 'bg-purple-600 text-white' : 'hover:bg-purple-600 text-gray-800 hover:text-white'}`}>
            <PiUsersLight className={`inline-block mr-2 ${isActive('/teams') ? 'text-white' : 'text-inherit'}`} /> 
            <span className={`inline-block text-sm ${isActive('/teams') ? 'text-white' : 'text-inherit'}`}>Teams</span>
          </li>
        </Link>
        <Link to="/tasks">
          <li className={`p-2 rounded flex items-center ${isActive('/tasks') ? 'bg-purple-600 text-white' : 'hover:bg-purple-600 text-gray-800 hover:text-white'}`}>
            <CiBoxList className={`inline-block mr-2 ${isActive('/tasks') ? 'text-white' : 'text-inherit'}`} /> 
            <span className={`inline-block text-sm ${isActive('/tasks') ? 'text-white' : 'text-inherit'}`}>Tasks</span>
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
