// src/components/ConfirmModal.jsx
import { X, AlertTriangle } from 'lucide-react';

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1200] flex justify-center items-center p-4">
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] w-full max-w-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#1E1E1E]">
          <h5 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} />
            {title}
          </h5>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 text-gray-300 text-sm">
          {message}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-white/5 bg-[#1E1E1E]/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-md"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}