import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const fetch = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products/get-all-product");
      console.log(response.data.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className='bg-gray-100 px-4 py-6 h-screen'>
      <h4 className='text-lg font-semibold text-gray-600 mb-4'>All Products</h4>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 '>
        {products.map((product) => (
          <div
            key={product._id}
            className='bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-90 '
          >
            {/* Product Image */}
            <img
              src={product.images} // Assuming the product has an imageUrl field
              alt={product.name}
              className='w-full  h-36  object-cover mb-3 rounded-md'
            />

            {/* Product Details */}
            <h5 className='text-sm font-semibold text-gray-700'>{product.name}</h5>
            <p className='text-xs text-gray-500 mt-1'>{product.description}</p>
            <p className='text-sm font-semibold text-gray-800 mt-1'>${product.price}</p>

            {/* Add to Cart or View Details Button */}
            <div className='mt-3 '>
              <button
                onClick={() => handleViewDetails(product._id)}
                className='w-full bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-xs '
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
