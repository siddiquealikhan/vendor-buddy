import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Package, 
  TrendingUp, 
  Users, 
  Shield, 
  Smartphone, 
  Globe,
  ArrowRight,
  CheckCircle,
  ShoppingCart,
  Search
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'

const Home = ({ cart, setCart }) => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  const features = [
    {
      icon: Package,
      title: 'Smart Sourcing',
      description: 'Find the best raw materials from verified suppliers across India'
    },
    {
      icon: TrendingUp,
      title: 'Price Trends',
      description: 'Track price fluctuations and make informed purchasing decisions'
    },
    {
      icon: Users,
      title: 'Vendor Network',
      description: 'Connect with thousands of street food vendors and suppliers'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Verified suppliers and quality-checked products'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Optimized for mobile devices - order on the go'
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Available in English and Hindi for better accessibility'
    }
  ]

  const stats = [
    { label: 'Active Vendors', value: '10,000+' },
    { label: 'Verified Suppliers', value: '5,000+' },
    { label: 'Products Available', value: '50,000+' },
    { label: 'Cities Covered', value: '100+' }
  ]

  const [cartOpen, setCartOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('http://localhost:8080/api/products?page=0&size=100')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        // Defensive: ensure products is always an array
        if (Array.isArray(data)) {
          setProducts(data)
        } else if (Array.isArray(data.products)) {
          setProducts(data.products)
        } else if (Array.isArray(data.content)) {
          setProducts(data.content)
        } else {
          setProducts([])
        }
      } catch (err) {
        setError(err.message)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
  }, [searchQuery, products])

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        showNotification(`${product.name} added to cart`)
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      showNotification(`${product.name} added to cart`)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Add Header when user is logged in */}
      {user && <Header cart={cart} />}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out">
          {notification}
        </div>
      )}

      {/* Remove duplicate navigation - we're using Header component instead when logged in */}
      {!user && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Vendor-Buddy</h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Cart icon for logged out users */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 group"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-900 group-hover:text-primary-600 transition-colors" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                      {cart.reduce((sum, item) => sum + (item.qty || 1), 0)}
                    </span>
                  )}
                </button>
                {/* Only show login/register when not logged in */}
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      {!user && (
        <div className="relative bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Smart Raw Material Sourcing for{' '}
                <span className="text-primary-600">Street Food Vendors</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect with verified suppliers, track price trends, and optimize your business with India's leading platform for street food vendors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                  Start Sourcing Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Products</h2>
            <p className="text-lg text-gray-600">Browse and add to your cart instantly</p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 rounded-md border focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span>Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="card p-4 flex flex-col">
                  <img
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="font-bold text-lg mb-1">{product.name}</div>
                    <div className="text-gray-500 text-sm mb-2">
                      by {product.supplierId || "Vendor-Buddy"}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-primary-600 text-lg">₹{product.unitPrice || product.price}</span>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Vendor-Buddy?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to streamline your raw material sourcing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-primary-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of vendors who trust Vendor-Buddy for their sourcing needs
            </p>
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vendor-Buddy</h3>
              <p className="text-gray-400">
                Smart raw material sourcing platform for street food vendors across India.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Vendors</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Find Suppliers</li>
                <li>Track Prices</li>
                <li>Place Orders</li>
                <li>View History</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>List Products</li>
                <li>Manage Orders</li>
                <li>View Analytics</li>
                <li>Grow Business</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Vendor-Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home