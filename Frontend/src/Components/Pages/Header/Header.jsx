import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiMenu, BiX } from 'react-icons/bi';
import logo from '../../../assets/images/logo.png';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../../../config';

const navLinks = [
  { path: '/home', display: 'Home' },
  { path: '/create', display: 'Create new Blog' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        Cookies.remove('jwt');
        localStorage.removeItem('username');
        navigate('/login');
      } else {
        const result = await response.json();
        console.error('Logout failed:', result.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className="header flex items-center justify-center">
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="Logo" style={{ width: '110px', height: 'auto' }} />
          </div>
          {username && (
            <div className="navigation hidden md:flex justify-end flex-grow">
              <ul className="menu flex items-start gap-[2.7rem]">
                {navLinks.map((link, index) => (
                  <li key={index} className="-ml-2"> 
                    <NavLink
                      to={link.path}
                      activeClassName="text-blue-600 font-bold"
                      className="text-black-500 text-base leading-7 font-medium hover:text-blue-600 whitespace-nowrap"
                    >
                      {link.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="bg-blue-700 hover:bg-blue-800 py-4 px-7 text-white font-[600] h-[35px] flex items-center justify-center rounded-[50px] ml-5">
              {username ? 'Logout' : 'Login'}
            </button>
            <span className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <BiX className="w-6 h-6 cursor-pointer" /> : <BiMenu className="w-6 h-6 cursor-pointer" />}
            </span>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="mobile-menu fixed inset-0 bg-white z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <img src={logo} alt="Logo" style={{ width: '80px', height: 'auto' }} />
            <span className="cursor-pointer" onClick={toggleMenu}>
              <BiX className="w-6 h-6 text-black" />
            </span>
          </div>
          <ul className="flex flex-col items-center gap-4 mt-8">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  activeClassName="text-blue-600 font-bold"
                  className="text-black-500 text-base leading-7 font-medium hover:text-blue-600"
                  onClick={toggleMenu}
                >
                  {link.display}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
