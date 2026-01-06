import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProducts } from '../services/api'

export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async () => {
    const products = await getProducts()
    return products
  },
)

const initialState = {
  items: [],
  filters: {
    category: 'all',
    priceRange: [0, 1000],
    minRating: 0,
  },
  sortBy: 'popularity',
  searchQuery: '',
  wishlist: [],
  comparison: [],
  status: 'idle',
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = initialState.filters
    },
    setSortBy(state, action) {
      state.sortBy = action.payload
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    toggleWishlist(state, action) {
      const id = action.payload
      if (state.wishlist.includes(id)) {
        state.wishlist = state.wishlist.filter((x) => x !== id)
      } else {
        state.wishlist.push(id)
      }
    },
    toggleComparison(state, action) {
      const id = action.payload
      if (state.comparison.includes(id)) {
        state.comparison = state.comparison.filter((x) => x !== id)
      } else {
        state.comparison.push(id)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const {
  setFilters,
  clearFilters,
  setSortBy,
  setSearchQuery,
  toggleWishlist,
  toggleComparison,
} = productSlice.actions

export const selectAllProducts = (state) => state.products.items

export const selectFilteredProducts = (state) => {
  const { items, filters, sortBy, searchQuery } = state.products

  let filtered = [...items]

  if (filters.category !== 'all') {
    filtered = filtered.filter((p) => p.category === filters.category)
  }

  if (filters.minRating) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating)
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  switch (sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'popularity':
    default:
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
  }

  return filtered
}

export const selectSearchSuggestions = (state) => {
  const query = state.products.searchQuery.toLowerCase()
  if (!query) return []

  const seen = new Set()

  return state.products.items
    .filter((product) => product.name.toLowerCase().includes(query))
    .filter((product) => {
      if (seen.has(product.name)) return false
      seen.add(product.name)
      return true
    })
    .slice(0, 5)
}

export default productSlice.reducer
