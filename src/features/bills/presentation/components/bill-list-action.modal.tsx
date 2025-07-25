import type { ModalProps } from '@core';
import { Button, Modal } from '@core';
import { twJoin } from 'tailwind-merge';

interface Props extends Omit<ModalProps, 'Footer'> {
	onConfirm: () => void;
	confirmTitle: string;
	onClose: () => void;
	hasSubmitButton?: boolean;
}

export const BillListActionModal = ({
	onConfirm,
	confirmTitle,
	hasSubmitButton = true,
	children,
	...props
}: Props) => {
	return (
		<Modal
			className="max-w-fit"
			Footer={() => (
				<div className="flex h-fit w-full justify-between px-4 py-3">
					<Button
						onClick={props.onClose}
						className="flex h-[40px] w-fit flex-row items-center px-4 py-1.5"
						variant="outline"
					>
						<p className="font-sans text-sm font-semibold">Отмена</p>
					</Button>
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
			{children}
		</Modal>
	);
};
