import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, message, Popconfirm } from 'antd';

const API_URL = 'http://localhost:5000/api/products/get-all-product';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data.data);
    } catch (error) {
      console.error(error.message);
      message.error('Failed to fetch products.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/delete-product/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id)); // Update state after deletion
      message.success('Product deleted successfully!');
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error('Failed to delete product. Please try again.');
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Image",
      dataIndex: "images", // Assumes there's an 'image' field in each category
      render: (image) => (
        <img
          src={image}
          alt="category"
          style={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => navigate(`/update-product/${record._id}`)}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
       <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Table columns={columns} dataSource={products} rowKey="_id" />
  );
};

export default ProductList;
