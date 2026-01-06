import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCartSubtotal } from '../../store/cartSlice'
import { formatPrice } from '../../utils/format'

const initialForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

const Checkout = () => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const subtotal = useSelector(selectCartSubtotal)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!form.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.zip.trim()) newErrors.zip = 'ZIP/postal code is required'
    if (form.cardNumber.replace(/\s/g, '').length < 12)
      newErrors.cardNumber = 'Card number looks too short'
    if (!form.expiry.trim()) newErrors.expiry = 'Expiry is required'
    if (form.cvv.length < 3) newErrors.cvv = 'CVV is too short'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="checkout-success">
        <h2>Order Confirmed</h2>
        <p>
          Thank you for your purchase! This is a simulated checkout flow, so no
          real payment was processed.
        </p>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <section>
            <h3>Shipping Information</h3>
            <div className="form-row">
              <label>
                Full Name
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <span className="error">{errors.fullName}</span>
                )}
              </label>
            </div>
            <div className="form-row">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </label>
            </div>
            <div className="form-row">
              <label>
                Address
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
                {errors.address && (
                  <span className="error">{errors.address}</span>
                )}
              </label>
            </div>
            <div className="form-row two-cols">
              <label>
                City
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </label>
              <label>
                ZIP / Postal Code
                <input
                  type="text"
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                />
                {errors.zip && <span className="error">{errors.zip}</span>}
              </label>
            </div>
          </section>

          <section>
            <h3>Payment Details</h3>
            <div className="form-row">
              <label>
                Card Number
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="xxxx xxxx xxxx xxxx"
                />
                {errors.cardNumber && (
                  <span className="error">{errors.cardNumber}</span>
                )}
              </label>
            </div>
            <div className="form-row two-cols">
              <label>
                Expiry
                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                />
                {errors.expiry && (
                  <span className="error">{errors.expiry}</span>
                )}
              </label>
              <label>
                CVV
                <input
                  type="password"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                />
                {errors.cvv && <span className="error">{errors.cvv}</span>}
              </label>
            </div>
          </section>

          <button type="submit" className="btn primary full-width">
            Place Order
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <p>Items subtotal: {formatPrice(subtotal)}</p>
          <p className="muted">Shipping & tax will be calculated at review.</p>
        </aside>
      </div>
    </div>
  )
}

export default Checkout
