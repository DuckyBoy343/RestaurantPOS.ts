import toast from 'react-hot-toast';
import ConfirmationToast from '@/components/ConfirmationToast';

export const showConfirmationToast = (message: string, onConfirm: () => void) => {
  toast.custom(
    (t) => (
      <ConfirmationToast
        t={t}
        message={message}
        onConfirm={onConfirm}
      />
    ),
    {
      duration: 6000,
      position: 'top-center',
    }
  );
};