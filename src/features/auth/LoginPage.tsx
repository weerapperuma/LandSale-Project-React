import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from './authSlice'
import type { AppDispatch, RootState } from '../../app/store'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { user, loading, error } = useSelector((state: RootState) => state.auth)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
