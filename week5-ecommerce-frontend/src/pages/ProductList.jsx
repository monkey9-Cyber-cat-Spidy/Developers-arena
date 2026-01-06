import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  loadProducts,
  selectAllProducts,
  selectFilteredProducts,
  setFilters,
  clearFilters,
  setSortBy,
} from '../store/productSlice'
import ProductCard from '../components/ProductCard/ProductCard'
import { Loader } from '../components/common/Modal'

const ProductList = () => {
  const dispatch = useDispatch()
  const allProducts = useSelector(selectAllProducts)
  const products = useSelector(selectFilteredProducts)
  const { filters, sortBy, status, error } = useSelector(
    (state) => state.products,
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadProducts())
    }
  }, [dispatch, status])

  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category))
    return ['all', ...Array.from(set)]
  }, [allProducts])

  const handleFilterChange = (field, value) => {
    dispatch(
      setFilters({
        [field]: value,
      }),
    )
  }

  const handleSortChange = (event) => {
    dispatch(setSortBy(event.target.value))
  }

  return (
    <div className="page">
      <div className="section-header">
        <h2>Product Catalog</h2>
      </div>
      <div className="catalog-layout">
        <aside className="filters">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>
              Category
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All' : category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="filter-group">
            <label>
              Minimum Rating
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
              >
                <option value={0}>All</option>
                <option value={3}>3+ stars</option>
                <option value={4}>4+ stars</option>
              </select>
            </label>
          </div>

          <button className="btn secondary full-width" onClick={() => dispatch(clearFilters())}>
            Clear Filters
          </button>
        </aside>

        <section className="catalog-main">
          <div className="catalog-toolbar">
            <span>{products.length} products</span>
            <label>
              Sort by
              <select value={sortBy} onChange={handleSortChange}>
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </label>
          </div>

          {status === 'loading' && (
            <div className="center">
              <Loader />
            </div>
          )}

          {status === 'failed' && <p className="error">{error}</p>}

          {status === 'succeeded' && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ProductList
