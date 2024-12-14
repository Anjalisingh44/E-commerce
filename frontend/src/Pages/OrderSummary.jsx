import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message } from 'antd';

const OrderSummary = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  
  const userId = localStorage.getItem("id"); // Retrieve userId from localStorage

  useEffect(() => {
    const fetchOrders = async () => {
      setStatus("loading");
      try {
        if (!userId) {
          throw new Error("User ID is missing.");
        }

        // Make an Axios request to fetch the orders for the specific user
        const response = await axios.get(`http://localhost:5000/api/order/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming JWT token stored in localStorage
            "Content-Type": "application/json",
          },
        });
        setOrders(response.data.orders);
        setStatus("succeeded");
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
        setStatus("failed");
        message.error('Failed to fetch orders.');
      }
    };

    fetchOrders();
  }, [userId]); // Fetch orders on component mount or when userId changes

  const columns = [
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <ul>
          {record.items.map((item) => (
            <li key={item._id || item.productId}>
              <strong>{item.productId.name}</strong> - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
      ),
    },
   
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let statusColor;
        switch (status) {
          case "pending":
            statusColor = "bg-yellow-500"; // Yellow for Pending
            break;
          case "shipped":
            statusColor = "bg-blue-500"; // Blue for Shipped
            break;
          case "delivered":
            statusColor = "bg-green-500"; // Green for Delivered
            break;
          default:
            statusColor = "bg-gray-500"; // Default gray color for unknown status
        }
        return <span className={`text-white py-1 px-3 rounded-full ${statusColor}`}>{status}</span>;
      },
    },

    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => `$${text}`, // Format as currency
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    
  ];

  if (status === "loading") {
    return <p>Loading orders...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='h-screen'>
      <h2 className='flex justify-center p-5 font-extrabold'>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="_id" 
          pagination={false} 
        />
      )}
    </div>
  );
};

export default OrderSummary;
