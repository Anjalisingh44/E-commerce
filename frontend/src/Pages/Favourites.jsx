import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Popconfirm, message } from "antd";
import { wishlistActions } from "../store/wishlist"; // Import actions
import axios from "axios";

const Favourites = () => {
  const dispatch = useDispatch();
  const { wishlistItems = [] } = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });
      const wishlist = response.data.data;
      dispatch(wishlistActions.setWishlist(wishlist)); // Store wishlist in Redux
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      message.error("Failed to fetch wishlist items.");
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    // Optimistically remove the item from the wishlist state
    dispatch(wishlistActions.removeFromWishlist(productId));
  
    try {
      // Making a DELETE request to remove the item from the wishlist by productId
      const response = await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${productId}`, // URL with productId
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Bearer token for authorization
            "Content-Type": "application/json", // Content type header
          },
        }
      );
  
      if (response.status === 200) {
        // Success: Show success message
        message.success("Item removed from wishlist!");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
      message.error("Failed to remove item from wishlist.");
  
      // If the request fails, refetch the wishlist to restore the state
      fetchWishlist();
    }
  };
  
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      render: (images) => <img src={images[0]} alt="Product" style={{ width: 100, height: 100 }} />, // Assuming images is an array
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => `$${price.toFixed(2)}`, // Format price
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to remove this item from your favourites?"
          onConfirm={() => handleRemoveFromWishlist(record.productId)} // Trigger remove on confirm
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Remove</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">My Favorites</h1>
      <Table
        columns={columns}
        dataSource={wishlistItems} // Populate table with wishlist items
        rowKey="productId" // Ensure each row is uniquely identified by productId
        pagination={{ pageSize: 5 }} // Set pagination
      />
    </div>
  );
};

export default Favourites;
