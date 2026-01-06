export const loadState = (key, defaultValue) => {
  if (typeof window === 'undefined') return defaultValue

  try {
    const serializedState = window.localStorage.getItem(key)
    if (!serializedState) return defaultValue
    return JSON.parse(serializedState)
  } catch (error) {
    console.error('Failed to load state from localStorage', error)
    return defaultValue
  }
}

export const saveState = (key, value) => {
  if (typeof window === 'undefined') return

  try {
    const serializedState = JSON.stringify(value)
    window.localStorage.setItem(key, serializedState)
  } catch (error) {
    console.error('Failed to save state to localStorage', error)
  }
}
