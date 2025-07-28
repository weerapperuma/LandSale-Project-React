import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAuth } from './features/auth/authSlice'
import type { AppDispatch } from './app/store'
import AppRoutes from './routes/AppRoutes'
import NavBar from './components/NavBar'

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
    </>
  )
}

export default App
