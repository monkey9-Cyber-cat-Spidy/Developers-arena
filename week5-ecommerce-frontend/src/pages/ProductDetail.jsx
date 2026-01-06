import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { addToCart } from '../store/cartSlice'
import {
  loadProducts,
  toggleWishlist,
  toggleComparison,
} from '../store/productSlice'
import { Rating } from '../components/common/Modal'
import { formatPrice } from '../utils/format'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { items, wishlist, comparison, status } = useSelector(
    (state) => state.products,
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts())
    }
  }, [dispatch, status])

  const product = items.find((p) => p.id === id)

  if (!product) {
    if (status === 'loading' || status === 'idle') {
      return (
        <div className="page center">
          <p>Loading product...</p>
        </div>
      )
    }

    return (
      <div className="page center">
        <p>Product not found.</p>
      </div>
    )
  }

  const inWishlist = wishlist.includes(product.id)
  const inComparison = comparison.includes(product.id)

  return (
    <div className="page product-detail-page">
      <div className="product-detail-layout">
        <div className="product-gallery">
          <img
            src={product.image}
            alt={product.name}
            className="product-detail-image"
          />
        </div>
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <Rating value={product.rating} count={product.ratingCount} />
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="detail-actions">
            <button
              className="btn primary"
              onClick={() => dispatch(addToCart(product))}
            >
              Add to Cart
            </button>
            <button
              className={`btn secondary ${inWishlist ? 'active' : ''}`}
              onClick={() => dispatch(toggleWishlist(product.id))}
            >
              {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button
              className={`btn secondary ${inComparison ? 'active' : ''}`}
              onClick={() => dispatch(toggleComparison(product.id))}
            >
              {inComparison ? 'In Comparison' : 'Compare'}
            </button>
          </div>

          <section className="product-meta">
            <h3>Details</h3>
            <ul>
              <li>
                <strong>Category:</strong> {product.category}
              </li>
              <li>
                <strong>Tags:</strong> {product.tags?.join(', ')}
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
