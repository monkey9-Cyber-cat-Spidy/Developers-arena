import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import productReducer from './productSlice'
import userReducer from './userSlice'
import { saveState } from '../utils/localStorage'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productReducer,
    user: userReducer,
  },
})

store.subscribe(() => {
  const state = store.getState()

  saveState('cart', {
    items: state.cart.items,
  })

  saveState('user', {
    user: state.user.user,
    isAuthenticated: state.user.isAuthenticated,
  })
})

export default store
