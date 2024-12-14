import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get the search query from the URL
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?search=${encodeURIComponent(searchQuery)}`
        );

        if (response.data.length === 0) {
          setNoResults(true);
          setSearchResults([]);
        } else {
          setNoResults(false);
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error.message);
        setNoResults(true);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen p-5">
      <h1 className="text-3xl font-bold mb-5">Search Results</h1>

      {noResults ? (
        <p>No products found for "{searchQuery}"</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-40 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-lg font-bold mt-2">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
