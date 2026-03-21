"use client";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: ModalProps) {
  console.log("[Modal] render, open =", open);
  if (!open) return null;

  console.log("[Modal] rendering visible modal");
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full border-2 border-[var(--border)] bg-[var(--background)] p-6 sm:max-w-md sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
