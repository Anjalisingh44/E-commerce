import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { cartActions } from "../store/cart";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Radio, Popconfirm } from "antd";
import { useNavigate } from 'react-router-dom';
import { orderActions } from "../store/order";



const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const navigate = useNavigate();
  



  useEffect(() => {
    console.log("useEffect fired - fetching cart data");
    productadded();
  }, [dispatch]);

  const productadded = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/cart/get_cart", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      

      const { items, totalPrice } = response.data.cart;

      // Dispatch to update the Redux store
      dispatch(
        cartActions.setCartItems({
          cartItems: items || [], // The cart items are inside 'cart.items'
          totalPrice: totalPrice || 0, // Total price is also in 'cart.totalPrice'
        })
      );

    } catch (error) {
      console.log("Error fetching cart data: ", error);
    }
  };
  




  const handleDelete = async (productId) => {
    try {
      // API call to remove the product from the cart
      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      // Extract updated cart data from response
      const { items, totalPrice } = response.data.cart;
  
      // Update Redux store
      dispatch(
        cartActions.setCartItems({
          cartItems: items || [],
          totalPrice: totalPrice || 0,
        })
      );
      await productadded();
  
      console.log("Item removed from cart successfully");
    } catch (error) {
      console.error("Error removing item from cart: ", error);
    }
  };
  const handleCheckout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      if (!accessToken) {
        console.error("No access token found. Please log in.");
        return;
      }
  
      const normalizedPaymentMethod = paymentMethod === "cash on delivery" ? "Cash on Delivery" : paymentMethod;
      // Map the items to send only necessary data
      const requestPayload = {
        items: cartItems.map(item => ({
          productId: item.productId, // Ensure this matches the server expectation
          quantity: item.quantity,
        })),
        paymentMethod:normalizedPaymentMethod,
      };
  
      console.log("Checkout payload:", requestPayload);
  
      const response = await axios.post(
        "http://localhost:5000/api/order/orders",
        requestPayload,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    
  
      // Handle response
      const { message, order } = response.data;
  
      console.log("Order successfully placed:", message);
  
      // Dispatch the order to Redux store
      dispatch(orderActions.addOrder({
        orderId: order.id,
        items: order.items,
        totalPrice: order.totalPrice,
        status: order.status,
        paymentMethod: order.paymentMethod,
        userId: order.userId,
      }));
  
      // Clear the cart after the order is successfully placed
      dispatch(cartActions.clearCart());
      localStorage.removeItem('cartData');

     
    dispatch(cartActions.clearCart());
      localStorage.removeItem('cartData');

      
        // Delay navigation to order-summary if payment is cash on delivery
        setTimeout(() => {
            navigate("/order-summary", { state: { order } });
        }, 200);
    




   } catch (error) {
      console.error("Error during checkout:", error);
  
      // Optional: Display a user-friendly error message
      if (error.response) {
        console.error("Server responded with:", error.response.data.message);
      } else {
        console.error("Network or other error:", error.message);
      }
    }
  };
  useEffect(() => {
    if (cartItems.length === 0) {
      // Cart has been cleared, you can proceed with navigation or other actions
      console.log('Cart has been cleared');
    }
  }, [cartItems]);  // Listen for changes in cartItems
  
 

  const columns = [
    {
      title: "Product",
      children: [
        {
          dataIndex: ["productId", "images"], // Nested property for images
          render: (images) => (
            <img
              src={images}
              alt="Product"
              className=" h-32 w-50 object-cover  ml-3" // Use Tailwind for consistent size and object fit
            />
          ),
        },
        {
          dataIndex: ["productId", "name"],
          render: (name, record) => (
            <div className="flex flex-col ml-8">
              <p className="text-lg font-bold">{name}</p>
              <p className="text-green-500 font-bold">Price: ${record.productId.price}</p>
              <p className="w-2/3 text-sm">{record.productId.description}</p>
            </div>
          ),
        },
      ],
      width: '40%',
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (quantity) => (
        <div className="">{quantity}</div> // Align quantity to the center
      ),
      width: '15%',
    },
    {
      title: "Total Price",
      render: (_, record) => (
        <div className="text-red-400">${record.quantity * record.productId.price}</div> // Align total price to the center
      ),
      width: '20%',
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => handleDelete(record.productId?._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
      width: '25%',
    },
  ];
 

  return (
    <div className=''>
      <h2 className="m-5 text-center font-bold text-xl">Your cart</h2>
      <Table columns={columns} dataSource={cartItems} rowKey="_id" />
      <div className="flex justify-end mt-2 ">
        <div className="bg-p-4 rounded-lg shadow-md w-1/4 p-5 items-center bg-white">
        <h1 className='font-semibold text-lg mb-2'>Cart Total</h1>
          <h3 className="font-semibold text-lg mb-2">Total Price:</h3>
          <h3 className="font-bold text-xl text-green-500 mb-4">${totalPrice}</h3>
          <h3 className="font-semibold text-lg mb-2">Select Payment Method:</h3>
          <Radio.Group
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
            className="mb-4"
          >
            <Radio value="Online">Online</Radio>
            <Radio value="Cash on Delivery">Cash on Delivery</Radio>
          </Radio.Group>
          <Button  onClick={handleCheckout}
          disabled={cartItems.length === 0} className="bg-blue-500 text-white hover:bg-blue-700 rounded-full py-2 px-4">
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
