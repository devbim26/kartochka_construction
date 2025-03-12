import { Modal, type ModalProps } from '@core';
import { twJoin } from 'tailwind-merge';
import { Button } from '..';

interface DeleteModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	wrapperClassName?: string;
}

export const DeleteModal = ({ onCancel, onConfirm, children, ...props }: DeleteModalProps) => {
	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						onClick={onConfirm}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Удалить</p>
					</Button>
					<Button
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Отмена</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			{children}
		</Modal>
	);
};
