import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table, Button, message, Popconfirm } from 'antd';

const API_URL = 'http://localhost:5000/api/category/get-all-categories';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data.data);
    } catch (error) {
      console.error(error.message);
      message.error('Failed to fetch categories.');
    }
  };

  // Handle delete category action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/category/delete-category/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          id: localStorage.getItem("id"),

        },
      });
      setCategories(categories.filter((category) => category._id !== id)); // Update state after deletion
      message.success('Category deleted successfully!');
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error('Failed to delete category. Please try again.');
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Image",
      dataIndex: "image", // Assumes there's an 'image' field in each category
      render: (image) => (
        <img
          src={image}
          alt="category"
          style={{ width: 100, height: 100 }}
        />
      ),
    },
    {
      title: "Category Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => navigate(`/update-category/${record._id}`)}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
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

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Table columns={columns} dataSource={categories} rowKey="_id" />
  );
};

export default CategoryList;
