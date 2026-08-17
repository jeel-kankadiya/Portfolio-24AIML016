/* Toast.jsx — Reusable toast notification component */
import { useState, useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3500 }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (exiting) {
      const exitTimer = setTimeout(() => {
        onClose();
      }, 300); // match animation duration
      return () => clearTimeout(exitTimer);
    }
  }, [exiting, onClose]);

  const handleClose = () => {
    setExiting(true);
  };

  return (
    <div className={`toast toast-${type} ${exiting ? 'toast-exit' : ''}`} role="alert">
      <span className="toast-icon">
        {type === 'success' ? '✅' : '❌'}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={handleClose} aria-label="Close notification">
        ✕
      </button>
    </div>
  );
};

/* ToastContainer — manages multiple toasts */
export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))}
  </div>
);

export default Toast;
