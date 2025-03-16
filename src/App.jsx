import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './components/UserProfile/cart';
import Loading from './Loading';
import PrivateRoute from './PrivateRoute';

const LazyNavbar = React.lazy(() => import('./components/Home/Navbar'));
const LazyHome = React.lazy(() => import('./components/Home/Home'));
const Login = React.lazy(() => import('./components/Login/Login'));
const Signup = React.lazy(() => import('./components/Login/Signup'));
const ForgotPassword = React.lazy(() => import('./components/Login/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/Login/ResetPassword'));
const Search1 = React.lazy(() => import('./components/search/Search1'));
const UserProfile = React.lazy(() => import('./components/UserProfile/UserProfile'));
const Dine = React.lazy(() => import('./components/Home/Dine'));
const PaymentGateway = React.lazy(() => import('./components/UserProfile/PaymentGatway'));
const OrderStatus = React.lazy(() => import('./components/UserProfile/OrderStatus'));
const NotLogin  = React.lazy(()=> import('./components/NotLogin'));

const App = () => {
  useEffect(() => {
    setTimeout(() => {}, [1000]);
    if (!sessionStorage.getItem('hasRefreshed')) {
      sessionStorage.setItem('hasRefreshed', 'true');
      window.location.reload();
    }
  }, []);

  return (
    <Router>
      <React.Suspense fallback={<Loading />}><LazyNavbar /></React.Suspense>
      <Routes>
        <Route path='/' element={<React.Suspense fallback={<Loading />}><LazyHome /></React.Suspense>} />
        <Route path="/home" element={<React.Suspense fallback={<Loading />}><LazyHome /></React.Suspense>} />
        <Route path="/login" element={<React.Suspense fallback={<Loading />}><Login /></React.Suspense>} />
        <Route path="/signup" element={<React.Suspense fallback={<Loading />}><Signup /></React.Suspense>} />
        <Route path="/search" element={<React.Suspense fallback={<Loading />}><Search1 /></React.Suspense>} />
        <Route path="/forgot-password" element={<React.Suspense fallback={<Loading />}><ForgotPassword /></React.Suspense>} />
        <Route path="/resetpassword/:token" element={<React.Suspense fallback={<Loading />}><ResetPassword /></React.Suspense>} />
        
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/payment-gateway" element={<PrivateRoute><React.Suspense fallback={<Loading />}><PaymentGateway /></React.Suspense></PrivateRoute>} />
        <Route path="/order-status" element={<PrivateRoute><React.Suspense fallback={<Loading />}><OrderStatus /></React.Suspense></PrivateRoute>} />
        <Route path="/profile/*" element={<PrivateRoute><React.Suspense fallback={<Loading />}><UserProfile /></React.Suspense></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><React.Suspense fallback={<Loading />}><UserProfile /></React.Suspense></PrivateRoute>} />
        <Route path="/dine" element={<PrivateRoute><React.Suspense fallback={<Loading />}><Dine /></React.Suspense></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;