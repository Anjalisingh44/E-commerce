import React, { useState } from 'react';
import {
  
  MenuUnfoldOutlined,
  MenuFoldOutlined
  
  
} from '@ant-design/icons'
import { FaListUl,  FaPlusCircle, FaTags, FaThList, FaTachometerAlt, FaCartPlus } from 'react-icons/fa';
import { Button, Layout, Menu, theme } from 'antd';
import AddProduct from '../../component/AddProduct'; // Import your components here
import ProductList from '../../component/ProductList';
import AddCategory from '../../component/AddCategory';
import CategoryList from '../../component/CategoryList';
import Dashboard from '../../component/Dashboard';
import AdminOrder from '../../component/AdminOrder';
 


const { Header, Sider, Content } = Layout;

const AdminProfile = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Function to handle menu item clicks
  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update selected key on menu item click
  };
  const navigateTo = (key) => {
    setSelectedKey(key); 
    
  };

  // Render content based on selected key
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Dashboard />;
      case '2':
        return <ProductList  />; // Replace with your ProductList component
      case '3':
        return <AddProduct navigateTo={navigateTo} />;
        case '4' :
          return <AddCategory  navigateTo={navigateTo}/>;
          case '5' :
            return <CategoryList/>
            case '6':
              return <AdminOrder/>// Render Add Product component
      default:
        return null; 
    }
  };
  const getHeading = () => {
    switch (selectedKey) {
      case '3':
        return 'Product Form'; // Heading for Add Product form
      case '4':
        return 'Category Form'; // Heading for Add Category form
      default:
        return ''; // No heading by default
    }
  };


  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: '#ffffff' }}>
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} // Highlight selected menu item
          className='bg-white'
          style={{
            color: 'black',
            marginTop: "50px",
          }}
          onClick={handleMenuClick} // Use handleMenuClick to update selected key
          items={[
            {
              key: '1',
              icon: <FaTachometerAlt/>,
              label: 'Dashboard',
              },
            {
              key: '2',
              icon: <FaListUl />,
              label: 'Product List',
            },
            {
              key: '3',
              icon: <FaPlusCircle/>,
              label: 'Add Product',
            },
            {
              key: '4',
              icon: <FaTags />,
              label: 'Add Category',
            },
            {
            key: '5',
            icon: <FaThList/>,
            label: 'Category List',
            },
            {
            key: '6',
            icon: <FaCartPlus/>,
            label: 'All orders',
            },


           
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '4px 6px',
            padding: 28,
            minHeight: 1000,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <h1 className='flex items-center justify-center mb-7 text-3xl'>{getHeading()}</h1>
          {renderContent()} {/* Render the content based on the selected key */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminProfile;
