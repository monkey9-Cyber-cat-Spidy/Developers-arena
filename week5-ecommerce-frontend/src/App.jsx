import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import ProtectedRoute from './components/common/ProtectedRoute'
import { Loader } from './components/common/Modal'

const Home = lazy(() => import('./pages/Home'))
const ProductList = lazy(() => import('./pages/ProductList'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Checkout = lazy(() => import('./components/Checkout/Checkout'))

function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="main-content">
        <Suspense
          fallback={
            <div className="center">
              <Loader />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <footer className="footer">
        <p>Advanced E-commerce Frontend &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
