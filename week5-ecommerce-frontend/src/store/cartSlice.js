import { createSlice } from '@reduxjs/toolkit'
import { loadState } from '../utils/localStorage'

const persistedCart = loadState('cart', { items: [] })

const initialState = {
  items: persistedCart.items || [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const existing = state.items.find((item) => item.id === product.id)

      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        })
      }
    },
    removeFromCart(state, action) {
      const id = action.payload
      state.items = state.items.filter((item) => item.id !== id)
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (!item) return

      if (quantity < 1) {
        state.items = state.items.filter((i) => i.id !== id)
      } else {
        item.quantity = quantity
      }
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

export default cartSlice.reducer
