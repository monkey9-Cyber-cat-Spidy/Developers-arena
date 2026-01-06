# Advanced E-commerce Frontend (Week 5)

A modern e-commerce frontend built with React and Redux Toolkit, featuring a product catalog, shopping cart, simulated user authentication, responsive design, and performance optimizations.

## Project Goals

- Demonstrate advanced frontend skills using React, Redux Toolkit, and React Router.
- Build a realistic e-commerce UI with catalog, filtering, sorting, search with autocomplete, cart, and checkout.
- Practice state management, component architecture, and basic performance techniques (lazy loading, code splitting, caching).

## Features

- Product catalog with CSS Grid layout.
- Filtering by category and minimum rating.
- Sorting by popularity, price, and name.
- Product search with autocomplete suggestions in the header.
- Product detail page with rating, price, description, tags, wishlist, and comparison.
- Interactive shopping cart with quantity updates, totals, taxes, and persistence.
- Simulated user authentication with protected checkout route.
- Checkout flow with client-side form validation.
- Responsive layout for mobile, tablet, and desktop.
- Performance improvements: route-level code splitting, lazy-loaded images, basic offline support via service worker.

## Tech Stack

- **React** (Vite)
- **Redux Toolkit** + **React-Redux** for state management (cart, products, user)
- **React Router** for routing and protected routes
- **Custom CSS** using **CSS Grid** and **Flexbox** for layout
- **Axios (optional)** ready via `services/api.js` abstraction (currently using mock data)
- **LocalStorage** for cart and user persistence
- **Service Worker** for simple offline-first shell

## Project Structure

```text
week5-ecommerce-frontend/
  src/
    components/
      Header/
        Header.jsx
      ProductCard/
        ProductCard.jsx
      Cart/
        Cart.jsx
      Checkout/
        Checkout.jsx
      common/
        Button.jsx
        Modal.jsx
        ProtectedRoute.jsx
    pages/
      Home.jsx
      ProductList.jsx
      ProductDetail.jsx
      CartPage.jsx
    store/
      store.js
      cartSlice.js
      productSlice.js
      userSlice.js
    services/
      api.js
    utils/
      format.js
      localStorage.js
    App.jsx
    main.jsx
    index.css
  public/
    sw.js
  package.json
  README.md
  .gitignore
```

## Setup Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   Open the printed local URL in your browser.

3. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

## Key Implementation Details

### State Management

- `cartSlice.js` manages cart items (add/remove/update quantity, clear cart) and provides selectors for item list, count, and subtotal.
- `productSlice.js` loads mock products, stores filters and sorting, and derives filtered/sorted products and search suggestions.
- `userSlice.js` simulates authentication with a simple `login`/`logout` flow and stores `user` + `isAuthenticated`.
- `store.js` wires all slices together and subscribes to changes to persist cart and user data to `localStorage`.

### Routing & Protected Routes

- `App.jsx` declares routes:
  - `/` → `Home`
  - `/products` → `ProductList`
  - `/products/:id` → `ProductDetail`
  - `/cart` → `CartPage`
  - `/checkout` → `Checkout` (wrapped by `ProtectedRoute`)
- `ProtectedRoute.jsx` checks `user.isAuthenticated` and redirects unauthenticated users back to `/`.

### UI & Components

- `Header` shows navigation, search with autocomplete, a cart badge, and a simulated login/logout button.
- `ProductCard` renders product image, price, rating, and actions (add to cart, wishlist toggle, compare toggle).
- `Cart` displays cart items with quantity controls, per-item totals, and an order summary (subtotal, shipping, tax, total).
- `Checkout` implements a form with validation for shipping and payment fields and an order confirmation message.

### Performance

- Route components (`Home`, `ProductList`, `ProductDetail`, `CartPage`, `Checkout`) are loaded with `React.lazy` + `Suspense` for code splitting.
- Product images use `loading="lazy"` where appropriate.
- A simple service worker (`public/sw.js`) caches the shell and `index.html` for basic offline behavior.

## Quality Standards Checklist

- **Project Overview**: This README explains the project goals and main features.
- **Setup Instructions**: Commands included for install, dev, build, and preview.
- **Code Structure**: Folder hierarchy listed; components and slices are modular.
- **Visual Documentation**: Add screenshots or GIFs of the catalog, cart, product detail, and checkout pages to this section when available.
- **Technical Details**: State management, routing, and performance strategies are described above.
- **Testing Evidence**: You can manually verify behavior by:
  - Adding/removing items from the cart and refreshing to confirm persistence.
  - Trying checkout with invalid and valid form inputs to see validation.
  - Using search and filters to narrow the product list.
  - Logging in/out and confirming checkout is only available when logged in.
- **Component Architecture**: Components are split by domain (`Header`, `ProductCard`, `Cart`, `Checkout`) and shared UI (`common/*`), with Redux slices handling data flow.
