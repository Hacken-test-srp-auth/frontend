import React from "react";
import { Link } from "react-router-dom";
import useBoundStore from "../store/useStore";
import { logOut } from "../services/auth";

export const Header: React.FC = () => {
  const { isLoggedIn, setLoggedIn } = useBoundStore();
  const onLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await logOut(refreshToken);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setLoggedIn(false);
    }
  };
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          My App
        </Link>
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
                    onClick={onLogout}
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
