import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAuth } from './features/auth/authSlice'
import type { AppDispatch } from './app/store'
import AppRoutes from './routes/AppRoutes'
import NavBar from './components/NavBar'
import { ToastContainer } from 'react-toastify';

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Initialize authentication state from localStorage
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <>
      <NavBar/>
      <div className="App">
        <AppRoutes/>
      </div>
        <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}

export default App
