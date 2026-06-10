"use client";
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-toggle-track"><span className="admin-toggle-knob" /></span>
      {label && <span className="admin-toggle-label">{label}</span>}
    </label>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <>
      <div className="admin-drawer-overlay" onClick={onClose} />
      <aside className="admin-drawer" role="dialog">
        <header className="admin-drawer-head">
          <h3>{title}</h3>
          <button onClick={onClose} className="admin-icon-btn" aria-label="Close">✕</button>
        </header>
        <div className="admin-drawer-body">{children}</div>
      </aside>
    </>
  );
}

export function ConfirmModal({ open, onCancel, onConfirm, title, message, confirmText = "Delete" }: {
  open: boolean; onCancel: () => void; onConfirm: () => void; title: string; message: string; confirmText?: string;
}) {
  if (!open) return null;
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button className="admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="admin-btn-red" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
