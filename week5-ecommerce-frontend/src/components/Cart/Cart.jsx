import { useDispatch, useSelector } from 'react-redux'
import {
  removeFromCart,
  updateQuantity,
  selectCartItems,
  selectCartSubtotal,
} from '../../store/cartSlice'
import { formatPrice } from '../../utils/format'

const SHIPPING_FLAT_RATE = 5.99
const TAX_RATE = 0.08

const Cart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const subtotal = useSelector(selectCartSubtotal)

  const tax = subtotal * TAX_RATE
  const total = subtotal + SHIPPING_FLAT_RATE + tax

  const handleQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Shopping Cart</h2>
        <p className="empty-cart">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="price">{formatPrice(item.price)}</p>
              </div>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="remove-btn"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{formatPrice(SHIPPING_FLAT_RATE)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
