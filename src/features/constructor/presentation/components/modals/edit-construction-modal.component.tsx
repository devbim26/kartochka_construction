import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import type { FloorConstruction } from '@features/constructor/types';
import { type ConstructionsEditData } from '@features/guidbooks/types';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { twJoin } from 'tailwind-merge';
import { CreateConstructionForm, type CreateConstructionFormHandle } from './modal-forms';

interface CreateConstructionModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	wrapperClassName?: string;
	currentReportFloorInfo?: FloorConstruction;
	currentConstructionHeader?: ConstructionsEditData;
	floorId?: string;
	reportFloorInfoId?: string;
}

export const EditConstructionModal = ({
	onCancel,
	onConfirm,
	currentReportFloorInfo,
	currentConstructionHeader,
	floorId,
	reportFloorInfoId,
	...props
}: CreateConstructionModalProps) => {
	const formRef = useRef<CreateConstructionFormHandle>(null);
	const { t } = useI18n();

	const handleConfirm = () => {
		formRef.current?.submit();
	};

	const handleSuccess = () => {
		toast.success(t('guides.constructions.editSuccess'));
		onConfirm();
	};

	const applyFormReset = () => {
		if (!currentReportFloorInfo || !currentConstructionHeader) return;
		formRef.current?.reset({
			constructionType: currentConstructionHeader.constructionType,
			id: reportFloorInfoId,
			length: String(currentReportFloorInfo.reportConstructionHeader.length),
			width: String(currentReportFloorInfo.reportConstructionHeader.width),
			construction: currentReportFloorInfo.reportConstructionHeader.constructionHeaderId,
			name: currentConstructionHeader.name || 'Placeholder',
			firstPlacementRoom:
				currentReportFloorInfo.reportConstructionHeader.firstPlacemetnRoom.id,
			secondPlacementRoom:
				currentReportFloorInfo.reportConstructionHeader.secondPlacementRoom.id,
			area: String(currentReportFloorInfo.reportConstructionHeader.square),
		});
	};

	useEffect(() => {
		if (!props.isOpen || !currentReportFloorInfo || !currentConstructionHeader) return;
		const timer = window.setTimeout(() => {
			applyFormReset();
		}, 0);
		return () => window.clearTimeout(timer);
	}, [
		props.isOpen,
		currentReportFloorInfo,
		currentConstructionHeader,
		reportFloorInfoId,
	]);

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
							{t('guides.constructions.editTitle')}
						</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			<CreateConstructionForm
				x={currentReportFloorInfo?.coordinates.x}
				x2={currentReportFloorInfo?.coordinates2.x}
				page={currentReportFloorInfo?.page}
				y={currentReportFloorInfo?.coordinates.y}
				y2={currentReportFloorInfo?.coordinates2.y}
				ref={formRef}
				floorId={floorId}
				reportFloorInfoId={reportFloorInfoId}
				onSuccess={handleSuccess}
			/>
		</Modal>
	);
};
