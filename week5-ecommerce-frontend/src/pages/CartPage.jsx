import { Link } from 'react-router-dom'
import Cart from '../components/Cart/Cart'

const CartPage = () => (
  <div className="page">
    <Cart />
    <div className="cart-footer">
      <Link to="/checkout" className="btn primary">
        Proceed to Checkout
      </Link>
    </div>
  </div>
)

export default CartPage
