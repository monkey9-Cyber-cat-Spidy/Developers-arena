const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear wireless headphones with 30 hours of battery life.',
    price: 99.99,
    category: 'Electronics',
    rating: 4.5,
    ratingCount: 120,
    image: '/images/wireless-headphones.jpg',
    popularity: 5,
    tags: ['audio', 'wireless', 'headphones'],
  },
  {
    id: '2',
    name: 'Smartphone Case',
    description: 'Shockproof, slim-fit smartphone case with raised bezels.',
    price: 24.99,
    category: 'Accessories',
    rating: 4.2,
    ratingCount: 80,
    image: '/images/smartphone-case.jpg',
    popularity: 3,
    tags: ['case', 'phone'],
  },
  {
    id: '3',
    name: 'USB-C Cable',
    description: 'Durable braided USB-C cable, 1.5m, fast charging supported.',
    price: 19.99,
    category: 'Accessories',
    rating: 4.0,
    ratingCount: 60,
    image: '/images/usb-c-cable.jpg',
    popularity: 4,
    tags: ['cable', 'usb-c'],
  },
  {
    id: '4',
    name: '4K Monitor',
    description: '27-inch 4K UHD monitor with HDR and ultra-thin bezels.',
    price: 329.99,
    category: 'Electronics',
    rating: 4.7,
    ratingCount: 45,
    image: '/images/4k-monitor.jpg',
    popularity: 5,
    tags: ['monitor', '4k'],
  },
  {
    id: '5',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with hot-swappable switches.',
    price: 89.99,
    category: 'Computers',
    rating: 4.6,
    ratingCount: 150,
    image: '/images/mechanical-keyboard.jpg',
    popularity: 4,
    tags: ['keyboard', 'mechanical'],
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI settings.',
    price: 34.99,
    category: 'Computers',
    rating: 4.3,
    ratingCount: 90,
    image: '/images/wireless-mouse.jpg',
    popularity: 3,
    tags: ['mouse', 'wireless'],
  },
]

export const getProducts = async () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts), 300)
  })

export const getProductById = async (id) =>
  new Promise((resolve, reject) => {
    const product = mockProducts.find((p) => p.id === id)

    setTimeout(() => {
      if (product) resolve(product)
      else reject(new Error('Product not found'))
    }, 300)
  })

export const fakeLogin = async (email) =>
  new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          name: 'Demo User',
          email,
        }),
      300,
    )
  })

export default {
  getProducts,
  getProductById,
  fakeLogin,
}
