import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../src/store/cart";
import { useParams } from "react-router-dom";
import { wishlistActions } from "../src/store/wishlist";




const RecentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    const { role } = useSelector(state => state.auth);
    const isSignedIn = useSelector((state) => state.auth.isSignedIn);
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);

    
    const dispatch = useDispatch();
  


  useEffect(() => {
    // Fetch recent products from the API
    const fetchRecentProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/get-recent-product"
        ); // Update URL as needed
        setProducts(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recent products:", error);
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  const handleAddToCart = async (id) => {
    if (!isSignedIn) {
      alert("Please sign in first");
      navigate('/signin');
      return;
  }

  
      try {
          const response = await axios.post(`http://localhost:5000/api/cart/add/${id}`, 
              { quantity:1 }, 
              {
                  headers: {
                      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                      id: localStorage.getItem("id"),
                      'Content-Type': "application/json",
                  },
              }
          );

          const { items, totalPrice } = response.data.cart;
          dispatch(cartActions.setCartItems({
              cartItems: items || [],
              totalPrice: totalPrice || 0,
          }));

          if (role === "user") {
              navigate("/cart");
          }
      } catch (error) {
          console.error("Error adding to cart:", error);
      }
  }

  

  const handlefavourite = async (productId) => {
    if (isSignedIn) {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/wishlist/add",
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        'Content-Type': "application/json",
                    },
                }
            );

            // Log the response for debugging
            console.log("Wishlist Response:", response.data);

            // Check if wishlistItem exists in the response
            if (response.data.wishlistItem) {
                const { wishlistItem } = response.data;

                dispatch(
                    wishlistActions.addWishlistItem({
                        productId: wishlistItem.id,
                        name: wishlistItem.name,
                        price: wishlistItem.price,
                    })
                );

               
            } else if (response.data.message === 'Product is already in wishlist') {
                alert("Product is already in your favorites.");
            } else{
                alert("Product added to favorites successfully!");
            }
        } catch (error) {
            console.error("Failed to add product to favorites", error);
            alert("Something went wrong. Please try again.");
        }
    } else {
        alert("Please sign in first to add to favorites.");
        navigate("/signin");
    }
};

  const handleViewDetail = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-wrap p-5 " style={{ gap: "3rem" }}>
      {products.map((product) => (
        <div
          key={product._id}
         className="w-full  bg-white shadow-lg rounded-lg p-4 transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          {/* Wrap the image in a div with an onClick handler */}
          <div
            onClick={() => handleViewDetail(product._id)}
            className="cursor-pointer h-40 w-full overflow-hidden"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-40 object-cover mb-4"
            />
          </div>
          <button
            onClick={() => handlefavourite(product._id)}
          style={{fontSize:"28px",padding:"4px"}}
          >
            <AiOutlineHeart />
          </button>
          <div className="p-1 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
          </div>
          <p className="text-lg font-semibold text-blue-500 mt-1">
            ${product.price}
          </p>
          <div className="mt-3">
          
            <button
    onClick={() => handleAddToCart(product._id)}
    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
  >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentProducts;
