import type { ModalProps } from '@core';
import { Button, Modal } from '@core';
import { twJoin } from 'tailwind-merge';

interface CreateConstructionModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	wrapperClassName?: string;
}

export const GeneralInformationModal = ({ onCancel, ...props }: CreateConstructionModalProps) => {
	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Закрыть</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		></Modal>
	);
};
