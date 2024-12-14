import React, { useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';


const UpdateProduct = () => {
  const { id } = useParams(); 
  const [form] = Form.useForm(); 
  const navigate = useNavigate();
  


  // Fetch and set product details in the form
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/get-productbyid/${id}`);
        console.log(response.data); // Log the response to verify the data structure
        form.setFieldsValue(response.data.data); // Adjust according to the structure of the API response
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        message.error('Failed to load product details.');
      }
    };

    fetchProductDetails();
  }, [id, form]); // Dependency array to fetch when `id` or `form` changes

  // Handle form submission
  const onFinish = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/products/update-product/${id}`, values, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      message.success('Product updated successfully!');
      navigate("/all-products")

    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Failed to update product.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="w-2/3 mx-auto ">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Product Name</span>}
            rules={[{ required: true, message: 'Product name is required' }]}
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
            name="price"
            label={<span className="font-semibold text-gray-700">Price</span>}
            rules={[{ required: true, type: 'number', min: 0, message: 'Price must be a positive number' }]}
          >
            <InputNumber className="w-full border-gray-300 rounded-lg focus:ring focus:ring-blue-500" />
          </Form.Item>

          <Form.Item
            name="size"
            label={<span className="font-semibold text-gray-700">Size</span>}
            rules={[{ required: true, message: 'Size is required' }]}
          >
            <Input
              placeholder="E.g., S, M, L, XL"
              className="border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="images"
            label={<span className="font-semibold text-gray-700">Image URLs</span>}
            rules={[{ required: true, message: 'Image URLs are required' }]}
          >
            <Input
              placeholder="Comma-separated URLs"
              className="border-gray-300 rounded-lg focus:ring focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
              Update Product
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProduct;
