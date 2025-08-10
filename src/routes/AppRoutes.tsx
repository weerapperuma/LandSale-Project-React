import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import CreateLand from "../pages/CreateLand.tsx";
import MyListings from "../pages/MyListings.tsx";
import AdminDashboard from "../pages/AdminDashboard";
import Wishlist from "../pages/Wishlist.tsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/createland" element={<CreateLand/>} />
            <Route path="/mylistings" element={<MyListings/>}/>
            <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
            <Route path="/wishlist" element={<Wishlist/>}/>
            {/* <Route path="*" element={<NotFound/>} /> */}
        </Routes>
    )
}

export default AppRoutes;