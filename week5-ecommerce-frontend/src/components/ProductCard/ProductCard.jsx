import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlist, toggleComparison } from '../../store/productSlice'
import { formatPrice } from '../../utils/format'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { wishlist, comparison } = useSelector((state) => state.products)

  const inWishlist = wishlist.includes(product.id)
  const inComparison = comparison.includes(product.id)

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product.id))
  }

  const handleToggleComparison = () => {
    dispatch(toggleComparison(product.id))
  }

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-image"
        />
      </Link>
      <div className="product-body">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
        <p className="product-rating">
          ⭐ {product.rating} ({product.ratingCount} reviews)
        </p>
        <div className="product-actions">
          <button className="btn primary" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button
            className={`btn secondary ${inWishlist ? 'active' : ''}`}
            onClick={handleToggleWishlist}
          >
            {inWishlist ? 'Wishlisted' : 'Wishlist'}
          </button>
          <button
            className={`btn secondary ${inComparison ? 'active' : ''}`}
            onClick={handleToggleComparison}
          >
            {inComparison ? 'In Compare' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
