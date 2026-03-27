import { Modal, type ModalProps } from '@core';
import { twJoin } from 'tailwind-merge';
import { FormSubscription } from './form-sub-form.component';

interface Props extends Omit<ModalProps, 'Footer'> {
	onClose: () => void;
}

export const FormSubModal = ({
	children,
	...props
}: Props) => {
	return (
		<Modal
			className="w-full max-w-fit md:w-fit"
			contentClassName={twJoin('text-center', props.contentClassName ?? 'hidden')}
			{...props}
		>
			<FormSubscription />
		</Modal>
	);
};
