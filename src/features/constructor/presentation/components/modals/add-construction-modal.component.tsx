import type { ModalProps } from '@core';
import { Button, Modal } from '@core';
import { useRef } from 'react';
import { toast } from 'sonner';
import { twJoin } from 'tailwind-merge';
import type { AddConstructionFormHandle } from './modal-forms';
import { AddConstructionForm } from './modal-forms';

interface AddConstructionModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	wrapperClassName?: string;
}

export const AddConstructionModal = ({
	onCancel,
	onConfirm,
	...props
}: AddConstructionModalProps) => {
	const formRef = useRef<AddConstructionFormHandle>(null);

	const handleConfirm = () => {
		formRef.current?.submit();
	};

	const handleSuccess = () => {
		toast.success('Конструкция успешно добавлена!');
		onConfirm();
	};
	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Отмена</p>
					</Button>
					<Button
						onClick={handleConfirm}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Добавить конструкцию</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			<AddConstructionForm ref={formRef} onSuccess={handleSuccess} />
		</Modal>
	);
};
