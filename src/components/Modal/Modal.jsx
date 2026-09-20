// Generic modal with backdrop click-to-close
export default function Modal({ open, onClose, children }) {
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className={`modal-backdrop${open ? ' open' : ''}`}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-box">
        {children}
      </div>
    </div>
  );
}
