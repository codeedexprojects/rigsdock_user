
import { Route, Routes } from 'react-router-dom'
import './App.css'
import ProductDetails from './Pages/ProductDetails'
import Login from './Pages/Login'
import Checkout from './Pages/Checkout'
import Wishlist from './Pages/Wishlist'
import Cart from './Pages/Cart'
import Home from './Pages/Home'
import Seller from './Pages/Seller'
import Shop from './Pages/Shop'
import About from './Pages/About'
import Register from './Pages/Register'
import UserAccount from './Pages/UserAccount'
import Otp from './Pages/Otp'
import 'react-toastify/dist/ReactToastify.css';
import Blog from './Pages/Blog'
import Orderconformation from './Pages/Orderconformation'
import PaymentStatus from './Pages/PaymentStatus'
import CategoryProducts from './Pages/CategoryProducts'
import ScrollTop from './Components/ScrollTop'
import AddReview from './Pages/AddReview'
import ReturnOrder from './Pages/ReturnOrder'



function App() {

  return (
    <>
    <ScrollTop/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/product-details/:id' element={<ProductDetails/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/checkout' element={<Checkout/>}/>
      <Route path='/wishlist' element={<Wishlist/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/seller' element={<Seller/>}/>
      <Route path='/shop' element={<Shop/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/user' element={<UserAccount/>}/>
      <Route path='/otp-login' element={<Otp/>}/>
      <Route path='/blog' element={<Blog/>}/>
      <Route path='/order-confirmed' element={<Orderconformation/>}/>
      <Route path='/payment-status' element={<PaymentStatus/>}/>
      <Route path="/category/:mainCatId/:catId/:subCatId" element={<CategoryProducts/>}/>
 <Route path="/add-review" element={<AddReview />} />
 <Route path="/return-order" element={<ReturnOrder />} />
     </Routes>
    {/* <Footer/> */}
     
    </>
  )
}

export default App
