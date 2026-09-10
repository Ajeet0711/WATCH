interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  showFooter?: boolean;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  actionLabel = 'Continue',
  onAction,
  showFooter = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-pulse-glow">
        <h2 className="text-2xl md:text-3xl font-bold text-wellness-700 mb-4 text-center">{title}</h2>
        <div className="mb-6">{children}</div>
        {showFooter && (
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-800 transition-all text-sm md:text-base"
            >
              Close
            </button>
            {onAction && (
              <button
                onClick={onAction}
                className="px-4 md:px-6 py-2 md:py-3 bg-wellness-500 hover:bg-wellness-600 text-white rounded-lg font-semibold transition-all text-sm md:text-base"
              >
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
