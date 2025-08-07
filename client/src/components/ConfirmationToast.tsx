'use client';

import toast from 'react-hot-toast';

interface ConfirmationToastProps {
  t: { id: string }; 
  message: string;
  onConfirm: () => void;
}

export default function ConfirmationToast({ t, message, onConfirm }: ConfirmationToastProps) {
  return (
    <div className="min-w-[350px] max-w-md bg-white rounded-lg shadow-lg p-4">
      <p className="mb-3 font-medium text-gray-800 text-center">
        {message}
      </p>
      <div className="flex justify-center gap-2">
        <button
          className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
          onClick={() => {
            onConfirm();
            toast.dismiss(t.id);
          }}
        >
          Confirmar
        </button>
        <button
          className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}