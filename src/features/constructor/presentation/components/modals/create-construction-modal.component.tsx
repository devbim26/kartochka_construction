import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import { useRef } from 'react';
import { toast } from 'sonner';
import { twJoin, twMerge } from 'tailwind-merge';
import { CreateConstructionForm, type CreateConstructionFormHandle } from './modal-forms';

interface CreateConstructionModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	activeTab?: 'walls' | 'floors' | 'rooms';
	onTabChange?: (tab: 'walls' | 'floors' | 'rooms') => void;
	wrapperClassName?: string;
	floorId?: string;
	reportFloorInfoId?: string;
	floorNumber?: string;
}

export const CreateConstructionModal = ({
	onCancel,
	onConfirm,
	activeTab = 'walls',
	onTabChange,
	floorId,
	reportFloorInfoId,
	floorNumber,
	...props
}: CreateConstructionModalProps) => {
	const formRef = useRef<CreateConstructionFormHandle>(null);
	const { t } = useI18n();
	const modalTabLabelKey = {
		walls: 'floorPlans.modal.addWall',
		floors: 'floorPlans.modal.addFloor',
		rooms: 'floorPlans.modal.addRoom',
	} as const;

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
			<div className="mb-4 flex flex-row flex-wrap gap-[12px]">
				{(['walls', 'floors', 'rooms'] as const).map((tab) => (
					<Button
						key={tab}
						type="button"
						onClick={() => onTabChange?.(tab)}
						className={twMerge(
							'flex h-[30px] flex-row items-center px-[16px] font-sans text-sm font-semibold shadow-none',
							activeTab === tab
								? ''
								: 'bg-white text-primary ring-[2px] ring-inset ring-primary enabled:hover:bg-white',
						)}
					>
						{t(modalTabLabelKey[tab])}
					</Button>
				))}
			</div>
			<CreateConstructionForm
				ref={formRef}
				onSuccess={handleSuccess}
				floorId={floorId}
				reportFloorInfoId={reportFloorInfoId}
				floorNumber={floorNumber}
				constructionTargetTab={activeTab === 'floors' ? 'floors' : 'walls'}
			/>
		</Modal>
	);
};
