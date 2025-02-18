import { toast } from 'sonner';

export const showToast = (message: string, type: 'success' | 'error') => {
	type === 'success' ? toast.success(message) : toast.error(message);
};
