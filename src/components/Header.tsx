import React from 'react';
import { Link } from 'react-router-dom';
import useBoundStore from '../store/useStore';


export const Header: React.FC = () => {

  const { isLoggedIn, setLoggedIn } = useBoundStore()

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          My App
        </Link>
        <button onClick={()=>setLoggedIn(!isLoggedIn)}>toggle login</button>
        <nav>
          <ul className="flex space-x-4 items-center">
            {isLoggedIn && (
              <>
                <li>
                  <Link to="/profile" className="hover:text-blue-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};