import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
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
	const { t } = useI18n();

	const handleConfirm = () => {
		formRef.current?.submit();
	};

	const handleSuccess = () => {
		toast.success(t('guides.constructions.addSuccess'));
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
						<p className="font-sans text-sm font-semibold">{t('common.cancel')}</p>
					</Button>
					<Button
						onClick={handleConfirm}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">
							{t('guides.constructions.addTitle')}
						</p>
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
