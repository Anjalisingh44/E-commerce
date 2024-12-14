import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const Dashboard = () => {

  const [salesData, setSalesData] = useState([
    { month: 'January', sales: 4000 },
    { month: 'February', sales: 5000 },
    { month: 'March', sales: 6000 },
    { month: 'April', sales: 7000 },
    { month: 'May', sales: 8000 },
  ]);

 


  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer Name', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  ];

  return (
    <div className=" bg-gray-100 p-8">
      {/* Header */}
      <div className="bg-white shadow p-0.5 rounded-lg mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-11 mb-7">
        <div style={{background:"linear-gradient(to right, #2563eb, #1e40af)"}} className=" text-black p-6 rounded-lg shadow-lg  mr-2">

        
          <h2 className="text-lg font-medium">Total Sales</h2>
          <p className="text-4xl font-extrabold mt-2">$15,000</p>
        </div>
        <div style={{background:"linear-gradient(to right, #16a34a, #15803d)"}} className=" text-black p-6 rounded-lg shadow-lg mr-2">
          <h2 className="text-lg font-medium">Total Orders</h2>
          <p className="text-4xl font-extrabold mt-2">200</p>
        </div>
        <div  style={{background:"linear-gradient(to right, #7c3aed, #6d28d9)"}} className=" text-black p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium">Total Products</h2>
          <p className="text-4xl font-extrabold mt-2">500</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sales Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="month" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip contentStyle={{ backgroundColor: '#f9f9f9', borderColor: '#ddd' }} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    
      
    </div>
  );
};

export default Dashboard;
