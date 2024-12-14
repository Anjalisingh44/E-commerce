import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../Navbar.css";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import { authAction } from "../src/store/auth";
import axios from 'axios';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const role = useSelector((state) => state.auth.role);
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const links = [
    { title: "Home", link: "/" },
    { title: "All products", link: "/all-products" },
    { title: "Profile", link: "/admin-Profile" },

    { icon: <IoCartOutline className="text-sky-600 text-2xl " />, link: "/cart" },
  ];

  const handleSearch = async (e) => {
    e.preventDefault(); 

    try {
      const response = await axios.get(
        `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}`
      );

      if (response.data.length === 0) {
        setNoResults(true);
        setSearchResults([]);
      } else {
        setNoResults(false);
        setSearchResults(response.data); // Store the results in state
      }

      // Navigate to the search results page
      navigate(`/fill?search=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      setNoResults(true);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    dispatch(authAction.logout());
    localStorage.clear();
    navigate("/signin");
  };

  const filteredLinks = links.filter((item) => {
    if (!isSignedIn && (item.link === "/cart" || item.title === "Profile")) {
      return false;
    }
    if (isSignedIn && role === "admin" && item.link === "/cart") {
      return false;
    }
    if (isSignedIn && role === "user" && item.title === "Profile") {
      return false;
    }
    

    return true;
  });

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img className="logo-img" src="src\logo.png" alt="logo" />
        <h1 className="logo-text">Websites</h1>
      </Link>

      {(role === "user" || !isSignedIn) && (
        <form className="flex items-center" onSubmit={handleSearch}>
          <button type="submit" className="search-button">
            <IoSearchOutline className="text-xl" />
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
      )}

      <div className="navbar-links">
        <div className="links-container">
          {filteredLinks.map((item) => (
            <Link key={item.link} to={item.link} className="navbar-link">
              {item.icon || item.title}
            </Link>
          ))}

          {/* Admin Profile Dropdown */}
          {isSignedIn && role === "admin" && (
            <div className="relative">
              <button
                onClick={() => setIsAdminDropdownOpen((prev) => !prev)}
                className="dropdown-button"
              >
                <CgProfile className="text-gray-700 text-3xl" />
              </button>
              {isAdminDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout} className="logout-button">
                    <AiOutlineLogout className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Profile Dropdown */}
          {isSignedIn && role === "user" && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="dropdown-button"
              >
                <CgProfile className="text-gray-700 text-3xl" />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/favourites" className="dropdown-link">
                    Favorites
                  </Link>
                  <Link to="/account-settings" className="dropdown-link">
                    Account Settings
                  </Link>
                  <Link to="/order-summary" className="dropdown-link">
                    Order History
                  </Link>
                  <button onClick={handleLogout} className="logout-button">
                    <AiOutlineLogout className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SignIn / SignUp buttons */}
        {!isSignedIn && (
          <div className="auth-buttons">
            <Link to="/SignIn" className="auth-link sign-in">
              SignIn
            </Link>
            <Link to="/SignUp" className="auth-link sign-up">
              SignUp
            </Link>
          </div>
        )}
      </div>

    
    </nav>
  );
};

export default Navbar;
