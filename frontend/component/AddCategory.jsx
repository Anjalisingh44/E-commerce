import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
};

const AddCategory = ({ navigateTo }) => {
  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/category/add-category', values, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          id: localStorage.getItem("id"),
           // Assuming token is stored in local storage
        },
      });
      message.success('Category added successfully!');
      if (navigateTo) {
        navigateTo('5');
      } else {
        console.error('navigateTo function not available.');
      }
      // Log the response data (newly created category)
    } catch (error) {
      console.error("Error adding category:", error);
      message.error('Failed to add category. Please try again.');
    }
  };

  return (
    <Form
      {...layout}
      name="add-category"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      validateMessages={validateMessages}
    >
      <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="image" label="Image URL" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Add Category
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCategory;
