import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import Profile from '../pages/Profile';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/profile" element={<Profile/>} />
            {/* <Route path="*" element={<NotFound/>} /> */}
        </Routes>
    )
}

export default AppRoutes;