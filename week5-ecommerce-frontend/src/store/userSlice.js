import { createSlice } from '@reduxjs/toolkit'
import { loadState } from '../utils/localStorage'

const persistedUser = loadState('user', { user: null, isAuthenticated: false })

const initialState = {
  user: persistedUser.user,
  isAuthenticated: persistedUser.isAuthenticated,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      const { email } = action.payload
      state.user = {
        name: 'Demo User',
        email,
      }
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer
