import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Icon from '../components/Icon';

const ToastContext = createContext(null);

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast) => {
    const id = ++nextId;
    const entry = { id, duration: 4000, ...toast };
    setToasts((list) => [...list, entry]);
    if (entry.duration > 0) {
      setTimeout(() => dismiss(id), entry.duration);
    }
    return id;
  }, [dismiss]);

  const api = {
    push,
    dismiss,
    success: (title, desc) => push({ variant: 'success', title, desc }),
    error: (title, desc) => push({ variant: 'error', title, desc }),
    info: (title, desc) => push({ variant: 'info', title, desc }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-host">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  return (
    <div className={`toast ${toast.variant || 'info'}`} role="status">
      <div className="toast-body">
        <div className="toast-title">{toast.title}</div>
        {toast.desc && <div className="toast-desc">{toast.desc}</div>}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', display: 'flex' }}
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};
