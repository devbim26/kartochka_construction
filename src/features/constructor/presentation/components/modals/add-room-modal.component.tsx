import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import { twJoin } from 'tailwind-merge';
import { AddRoomForm, type AddRoomFormValues } from './modal-forms/add-room-form.component';

interface Props extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: (data: AddRoomFormValues) => void;
}

export const AddRoomModal = ({ onCancel, onConfirm, ...props }: Props) => {
	const { t } = useI18n();

	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						type="button"
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">{t('common.cancel')}</p>
					</Button>
					<Button
						type="submit"
						form="add-room-form"
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">{t('common.save')}</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			<AddRoomForm onSubmit={onConfirm} />
		</Modal>
	);
};
