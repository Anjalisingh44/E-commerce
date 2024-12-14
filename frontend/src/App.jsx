import React, { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { Routes,Route } from 'react-router-dom'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import Home from './Pages/Home'
import Footer from '../component/Footer'
import AllProduct from './Pages/AllProduct'
import UserProfile from './Pages/UserProfile'
import AdminProfile from './Pages/AdminProfile'
import Navbar from '../component/Navbar'
import UpdateProduct from '../component/UpdateProduct';
import { authAction} from './store/auth';
import { useNavigate } from 'react-router-dom';


import PrivateRoute from '../component/PrivateRoute';
import UpdateCategory from '../component/UpdateCategory';
import ViewProductDetail from './Pages/ViewProductDetail';
import Cart from './Pages/Cart';

import Favourites from './Pages/Favourites';
import AccountSettings from './Pages/AccountSettings';
import Dashboard from '../component/Dashboard';
import OrderSummary from './Pages/OrderSummary';
import Searchpage from './Pages/Searchpage';

import Eswaaa from './Pages/Eswaaa';
import PaymentSuccess from './Pages/PaymentSuccess';
import PaymentFailure from './Pages/PaymentFailure';






const App = () => {

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const role = useSelector((state) => state.auth.role);
  
  const dispatch = useDispatch();
  useEffect(() =>{
    if(
      localStorage.getItem("id") &&
      localStorage.getItem("accessToken") && 
      localStorage.getItem("role")
    ){
      dispatch(authAction.Signin());
      dispatch(authAction.changeRole(localStorage.getItem("role")));
    }
  },[dispatch])

  return (
    <div>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-Products" element={<AllProduct />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path='/signin' element={<Signin/>} />
      
        <Route path='/product/:id' element={<ViewProductDetail/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-summary" element={< OrderSummary/>} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/favourites" element={<Favourites/>} />
        <Route path="/account-settings" element={<AccountSettings/>} />
        <Route path="/fill" element={<Searchpage/>} />
        <Route path="/esewa-component" element={<Eswaaa/>} />
        <Route path="/success" element={<PaymentSuccess/>} />
        <Route path="/failure" element={<PaymentFailure/>} />
        
        
        
        
        

         <Route
          path="/admin-profile"
          element={
            <PrivateRoute isSignedIn={isSignedIn} role={role} allowedRole="admin">
              <AdminProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-product/:id"
          element={
            <PrivateRoute isSignedIn={isSignedIn} role={role} allowedRole="admin">
              <UpdateProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-category/:id"
          element={
            <PrivateRoute isSignedIn={isSignedIn} role={role} allowedRole="admin">
              <UpdateCategory />
            </PrivateRoute>
          }
        />
        <Route
        path="/dashboard"
        element={
          <PrivateRoute isSignedIn={isSignedIn} role={role} allowedRole="admin
          ">
            <Dashboard/>
          </PrivateRoute>
        }
        />
 
       
        
      
      </Routes>
      

      <Footer/>
    </div>
  )
}

export default App