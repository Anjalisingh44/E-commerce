import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const UpdateCategory = () => {
  const { id } = useParams(); // Get category ID from URL
  const [form] = Form.useForm(); // Ant Design form instance

  // Fetch and set category details in the form
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/category/get-category-by-id/${id}`);
        console.log(response.data); // Log the response to verify the data structure
        form.setFieldsValue(response.data.data); // Adjust according to the structure of the API response
      } catch (error) {
        console.error("Failed to fetch category details:", error);
        message.error("Failed to load category details.");
      }
    };

    fetchCategoryDetails();
  }, [id, form]); // Dependency array to fetch when `id` or `form` changes

  // Handle form submission
  const onFinish = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/category/update-category/${id}`, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      message.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-screen bg-white p-6">
      <div className="w-2/3 mx-auto ">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Category</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Category Name</span>}
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input className="border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Description</span>}
            rules={[{ required: true, message: 'Description is required' }]}
          >
            <Input.TextArea className="border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </Form.Item>

          <Form.Item
            name="image"
            label={<span className="font-semibold text-gray-700">Image URL</span>}
            rules={[{ required: true, message: 'Image URL is required' }]}
          >
            <Input
              placeholder="URL for category image"
              className="border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Update Category
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCategory;
