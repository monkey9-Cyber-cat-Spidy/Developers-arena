import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadProducts, selectAllProducts } from '../store/productSlice'
import ProductCard from '../components/ProductCard/ProductCard'

const Home = () => {
  const dispatch = useDispatch()
  const products = useSelector(selectAllProducts)
  const status = useSelector((state) => state.products.status)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts())
    }
  }, [dispatch, status])

  const featured = products.slice(0, 4)

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Advanced E-commerce Frontend</h1>
          <p>
            Browse our curated selection of modern tech products with a fully
            responsive, interactive shopping experience.
          </p>
          <Link to="/products" className="btn primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/products" className="link">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
