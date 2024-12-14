import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, message, Button, Select } from 'antd';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setStatus("loading");

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          message.error("You must be logged in as an admin.");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/order/Adminorders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.orders);
        setStatus("succeeded");
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
        setStatus("failed");
        message.error('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Runs once on component mount

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: 'orderId',
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'username',
      render: (user) => (user && user.username ? user.username : 'No username available'),
    },
    
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => `$${text.toFixed(2)}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          defaultValue={status}
          style={{ width: 120 }}
          onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
        >
          <Option value="pending">Pending</Option>
          <Option value="shipped">Shipped</Option>
          <Option value="delivered">Delivered</Option>
        </Select>
      ),
    },
    
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.put(
        `http://localhost:5000/api/order/orders/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the status in local state after successful update
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      message.success('Order status updated successfully');
    } catch (err) {
      message.error('Failed to update order status');
    }
  };
  
  if (loading) return <p>Loading orders...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AdminOrder;
