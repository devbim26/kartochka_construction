import { Button } from '../button';
import { Modal, type ModalProps } from './modal.component';

interface ConfirmationModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	confirmButtonText?: string;
	cancelButtonText?: string;
}

export const ConfirmationModal = ({
	onCancel,
	onConfirm,
	confirmButtonText = 'Подтвердить',
	cancelButtonText = 'Отменить',
	children,
	...props
}: ConfirmationModalProps) => {
	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-x-4 p-2">
					<Button onClick={onConfirm} className="w-28">
						{confirmButtonText}
					</Button>
					<Button onClick={onCancel} className="w-28">
						{cancelButtonText}
					</Button>
				</div>
			)}
			{...props}
		>
			{children}
		</Modal>
	);
};
