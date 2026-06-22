import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import { twJoin } from 'tailwind-merge';
import { ConstructionInfoModalContent } from './construction-info-modal-content.component';

interface GeneralInformationModalProps extends Omit<ModalProps, 'Footer' | 'children'> {
	onCancel: () => void;
	wrapperClassName?: string;
}

/** Модалка по кнопке «i» в ведомости конструкций на поэтажных планах. */
export const GeneralInformationModal = ({ onCancel, ...props }: GeneralInformationModalProps) => {
	const { t } = useI18n();

	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">{t('common.close')}</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-left', props.contentClassName ?? '')}
			{...props}
		>
			<ConstructionInfoModalContent />
		</Modal>
	);
};
