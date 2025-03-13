import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './components/UserProfile/cart';
import Loading from './Loading';

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
const email = localStorage.getItem("userEmail");

const App = () => {
  useEffect(() => {
    setTimeout(()=>{
    },[1000])
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
        <Route path="/resetpassword/:token" e lement={<React.Suspense fallback={<Loading />}><ResetPassword /></React.Suspense>} />
        {email && <>
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment-gatway" element={<React.Suspense fallback={<Loading />}><PaymentGateway /></React.Suspense>} />
        <Route path="/order-status" element={<React.Suspense fallback={<Loading />}><OrderStatus /></React.Suspense>} />
        <Route path="/profile/*" element={<React.Suspense fallback={<Loading />}><UserProfile /></React.Suspense>} />
        <Route path="/profile" element={<React.Suspense fallback={<Loading />}><UserProfile /></React.Suspense>} />
        <Route path="/dine" element={<React.Suspense fallback={<Loading />}><Dine /></React.Suspense>} />
        </>
      }
      </Routes>
    </Router>
  );
};

export default App;