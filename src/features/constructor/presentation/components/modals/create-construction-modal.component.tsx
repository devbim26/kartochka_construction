import type { ModalProps } from '@core';
import { Button, Modal } from '@core';
import { useRef } from 'react';
import { toast } from 'sonner';
import { twJoin } from 'tailwind-merge';
import { CreateConstructionForm, type CreateConstructionFormHandle } from './modal-forms';

interface CreateConstructionModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	wrapperClassName?: string;
}

export const CreateConstructionModal = ({
	onCancel,
	onConfirm,
	children,
	...props
}: CreateConstructionModalProps) => {
	const formRef = useRef<CreateConstructionFormHandle>(null);

	const handleConfirm = () => {
		formRef.current?.submit();
	};

	const handleSuccess = () => {
		toast.success('Конструкция успешно создана!');
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
						<p className="font-sans text-sm font-semibold">Создать конструкцию</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			<CreateConstructionForm ref={formRef} onSuccess={handleSuccess} />
		</Modal>
	);
};
