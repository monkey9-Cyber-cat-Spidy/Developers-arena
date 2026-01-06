const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export const Rating = ({ value, count }) => (
  <div className="rating">
    <span>⭐ {value}</span>
    {typeof count === 'number' && <span className="rating-count">({count})</span>}
  </div>
)

export const Loader = () => (
  <div className="loader">
    <div className="spinner" />
    <span>Loading...</span>
  </div>
)

export default Modal
