import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import { twJoin, twMerge } from 'tailwind-merge';
import {
	ConstructionInfoModalContent,
	type ConstructionInfoOverrides,
} from './construction-info-modal-content.component';

type Props = Omit<ModalProps, 'Footer' | 'children' | 'headerTitle'> & {
	onClose: () => void;
	constructionHeaderId: string | null;
	overrides?: ConstructionInfoOverrides;
	hideDownload?: boolean;
	headerTitle?: string;
};

/** Модалка полной информации о конструкции (по constructionHeaderId из справочника). */
export const ConstructionDetailsModal = ({
	onClose,
	constructionHeaderId,
	overrides,
	hideDownload = true,
	headerTitle = '',
	className,
	contentClassName,
	...props
}: Props) => {
	const { t } = useI18n();

	return (
		<Modal
			headerTitle={headerTitle}
			onClose={onClose}
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						onClick={onClose}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">{t('common.close')}</p>
					</Button>
				</div>
			)}
			{...props}
			contentClassName={twJoin('text-left', contentClassName ?? '')}
			className={twMerge(
				'!max-w-[min(96vw,1180px)] !w-[min(96vw,1180px)] md:!w-[min(96vw,1080px)]',
				className,
			)}
		>
			{constructionHeaderId ? (
				<ConstructionInfoModalContent
					constructionHeaderId={constructionHeaderId}
					hideDownload={hideDownload}
					overrides={overrides}
				/>
			) : null}
		</Modal>
	);
};
