import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import { ArrowLeft, Truck, CheckCircle, Package, Clock, XCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

const Orders = ({ cart = [] }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState({})

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/orders')
        setOrders(response.data.orders || [])

        // Fetch product details for each order
        const productIds = [...new Set(response.data.orders.map(order => order.productId))]
        await fetchProductDetails(productIds)

        setLoading(false)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(err.message || 'Failed to fetch orders')
        setLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  // Fetch product details for orders
  const fetchProductDetails = async (productIds) => {
    try {
      const productDetails = {}
      for (const id of productIds) {
        try {
          const response = await axios.get(`/products/${id}`)
          productDetails[id] = response.data
        } catch (err) {
          console.error(`Error fetching product ${id}:`, err)
          productDetails[id] = { name: 'Unknown Product', imageUrl: '' }
        }
      }
      setProducts(productDetails)
    } catch (err) {
      console.error('Error fetching product details:', err)
    }
  }

  // Helper function to get status badge color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" /> }
      case 'ACCEPTED':
        return { color: 'bg-blue-100 text-blue-800', icon: <Package className="h-4 w-4" /> }
      case 'IN_TRANSIT':
        return { color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-4 w-4" /> }
      case 'DELIVERED':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" /> }
      case 'CANCELLED':
        return { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" /> }
      case 'REJECTED':
        return { color: 'bg-gray-100 text-gray-800', icon: <AlertCircle className="h-4 w-4" /> }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-4 w-4" /> }
    }
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add Header at the top */}
      <Header cart={cart} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button */}
        <button
          className="flex items-center px-4 py-2 mb-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </button>

        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">View your order history and track current orders.</p>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg shadow">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-gray-500">You haven't placed any orders yet. Start shopping to make your first order!</p>
              <button
                className="mt-4 btn btn-primary"
                onClick={() => navigate('/')}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-6 bg-white rounded-lg shadow">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="flex space-x-4">
                      {/* Product image */}
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                        <img
                          src={products[order.productId]?.imageUrl || 'https://via.placeholder.com/150'}
                          alt={products[order.productId]?.name || 'Product'}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Order details */}
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {products[order.productId]?.name || 'Product Name'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Order #{order.id.substring(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {order.quantity}
                        </p>
                        <div className="mt-1">
                          <span className="text-primary-600 font-semibold">
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order status and date */}
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                        {getStatusInfo(order.status).icon}
                        <span className="ml-1">{order.status.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordered on: {formatDate(order.createdAt)}
                      </p>
                      {order.estimatedDeliveryTime && (
                        <p className="text-sm text-gray-500">
                          Estimated delivery: {formatDate(order.estimatedDeliveryTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
