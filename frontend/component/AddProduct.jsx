import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: { number: '${label} is not a valid number!' },
  number: { range: '${label} must be between ${min} and ${max}' },
};

const AddProduct = ({ navigateTo }) => {
  
    

  const onFinish = async (values) => {
    console.log('Form Values:', values);
    try {
      // Sending the form values as JSON
      const response = await axios.post(
        'http://localhost:5000/api/products/add-product',
        {
          name: values.name,
          description: values.description,
          price: values.price,
          size: values.size,
          images: values.images, // Pass the image URL
        },
        {
          headers: {
            'Content-Type': 'application/json', // Set the correct Content-Type
            id: localStorage.getItem("id"),
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Include the authorization token
          },
        }
      );
  
      // Display success message and log the response
      message.success('Product added successfully!');
      if (navigateTo) {
        navigateTo('2');
      } else {
        console.error('navigateTo function not available.');
      }
      console.log(response.data);
    } catch (error) {
      // Handle errors and show an error message
      console.error("Error adding product:", error.response?.data || error.message);
      message.error('Failed to add product. Please try again.');
    }
  };
  
  return (
    <Form
      {...layout}
      name="add-product"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', min: 0 }]}>
        <InputNumber />
      </Form.Item>

      

      <Form.Item name="size" label="Size" rules={[{ required: true }]}>
        <Input placeholder="E.g., S, M, L, XL" />
      </Form.Item>

      <Form.Item name="images" label="Image URL" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Add Product
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddProduct;
