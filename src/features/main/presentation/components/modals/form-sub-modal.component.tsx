import { Button, Modal, type ModalProps } from '@core';
import { twJoin } from 'tailwind-merge';
import { FormSubscription } from './form-sub-form.component';

interface Props extends Omit<ModalProps, 'Footer'> {
	onConfirm: () => void;
	confirmTitle: string;
	onClose: () => void;
	hasSubmitButton?: boolean;
	hasUndoButton?: boolean;
}

export const FormSubModal = ({
	onConfirm,
	confirmTitle,
	hasSubmitButton = true,
	hasUndoButton = true,
	children,
	...props
}: Props) => {
	return (
		<Modal
			className="w-full max-w-fit md:w-fit"
			Footer={() => (
				<div className="flex h-fit w-full justify-end px-4 py-3">
					{hasUndoButton && (
						<Button
							onClick={props.onClose}
							className="flex h-[40px] w-fit flex-row items-center px-4 py-1.5"
							variant="outline"
						>
							<p className="font-sans text-sm font-semibold">Отмена</p>
						</Button>
					)}
					{hasSubmitButton && (
						<Button
							onClick={onConfirm}
							className="flex h-[40px] w-fit flex-row items-center px-4 py-1.5"
						>
							<p className="font-sans text-sm font-semibold">{confirmTitle}</p>
						</Button>
					)}
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? 'hidden')}
			{...props}
		>
			<FormSubscription />
		</Modal>
	);
};
