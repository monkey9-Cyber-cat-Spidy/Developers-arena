import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartCount } from '../../store/cartSlice'
import {
  selectSearchSuggestions,
  setSearchQuery,
} from '../../store/productSlice'
import { login, logout } from '../../store/userSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector(selectCartCount)
  const suggestions = useSelector(selectSearchSuggestions)
  const searchQuery = useSelector((state) => state.products.searchQuery)
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearchChange = (event) => {
    const value = event.target.value
    dispatch(setSearchQuery(value))
    setShowSuggestions(!!value)

    if (value && window.location.pathname !== '/products') {
      navigate('/products')
    }
  }

  const handleSelectSuggestion = (productId) => {
    setShowSuggestions(false)
    dispatch(setSearchQuery(''))
    navigate(`/products/${productId}`)
  }

  const handleAuthClick = () => {
    if (isAuthenticated) {
      dispatch(logout())
    } else {
      // Simple simulated login
      dispatch(login({ email: 'demo@example.com' }))
    }
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo-area">
          <Link to="/" className="brand">
            DevStore
          </Link>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>
        </nav>

        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(!!searchQuery)}
              onBlur={() => {
                // small delay to allow click
                setTimeout(() => setShowSuggestions(false), 150)
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="search-suggestions">
                {suggestions.map((product) => (
                  <li
                    key={product.id}
                    onMouseDown={() => handleSelectSuggestion(product.id)}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button className="auth-btn" onClick={handleAuthClick}>
            {isAuthenticated ? `Logout (${user?.name})` : 'Login'}
          </button>

          <Link to="/cart" className="cart-link">
            <span>Cart</span>
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
