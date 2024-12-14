import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { cartActions } from "../store/cart";
import { wishlistActions } from "../store/wishlist";

const ViewProductDetail = () => {
    const { role } = useSelector(state => state.auth);
    const isSignedIn = useSelector((state) => state.auth.isSignedIn);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [rating, setRating] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/get-productbyid/${id}`);
                setProduct(response.data.data);
            } catch (error) {
                console.error("Failed to fetch product details", error);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = async () => {
        if (!isSignedIn) {
            alert("Please sign in first");
            navigate('/signin');
            return;
        }

        if (product) {
            try {
                const response = await axios.post(`http://localhost:5000/api/cart/add/${id}`, 
                    { quantity }, 
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
    };

    const handleFavourite = async (productId) => {
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
                } else {
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

    const handleRating = (value) => {
        setRating(value);
        // Optionally send this rating to the server
    };
    

    if (!product) return <p>Loading...</p>;
    const buyproduct = async () => {
        if (isSignedIn && role=== "user") {
            navigate("/cart")

    }
}

    return (    
        <div className="h-screen ml-80 mt-16">
            <div className="flex">
                <img className='w-96 h-[500px] rounded-lg' src={product.images} alt={product.name} />
                <div className="bg-gray-76 p-5 pl-11 w-full">
                    <h2 className="text-xl font-sans font-bold mb-3">Product Name: {product.name}</h2>
                    <p className="mb-3"><strong className="text-red-500">Price: ${product.price}</strong></p>
                    <p className="mb-3"><strong>Category: {product.category}</strong></p>
                    <p className="mb-3 w-80">{product.description}</p>
                    <div>
                        <label className="mr-3" htmlFor="quantity">Quantity:</label>
                        <input
                            className="mb-3 bg-none p-1 bg-slate-200"
                            id="quantity"
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>
                    {/* Rating Section */}
                    <div className="flex items-center mb-5">
                        <span className="mr-3">Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                onClick={() => handleRating(star)}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
                                fill={star <= rating ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.02 6.215a1 1 0 00.95.69h6.518c.969 0 1.371 1.24.588 1.81l-5.293 3.843a1 1 0 00-.364 1.118l2.02 6.215c.3.921-.755 1.688-1.54 1.118l-5.293-3.843a1 1 0 00-1.176 0l-5.293 3.843c-.784.57-1.84-.197-1.54-1.118l2.02-6.215a1 1 0 00-.364-1.118L2.49 11.642c-.783-.57-.38-1.81.588-1.81h6.518a1 1 0 00.95-.69l2.02-6.215z"
                                />
                            </svg>
                        ))}
                    </div>
                    <div className='mt-5'>
                        <button onClick={() => handleFavourite(product._id)} className='w-60 bg-red-500 text-white py-2 px-6 ml-9 rounded-lg hover:bg-blue-600'>
                            Add To Favourites
                        </button>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <div>
                            <button onClick={addToCartHandler} className='w-40 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'>
                                Add To Cart
                            </button>
                        </div>
                        <div>
                            <button onClick={buyproduct} className='w-40 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600'>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="mt-5 text-2xl font-bold">Detailed information</h1>
                <p className="text-xl text-balance mt-3">Description: {product.description}</p>
            </div>
        </div>
    );
};

export default ViewProductDetail;
