import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import type { FloorConstruction } from '@features/constructor/types';
import { resolveConstructionClass } from '@features/constructor/utils';
import { type ConstructionsEditData } from '@features/guidbooks/types';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { twJoin, twMerge } from 'tailwind-merge';
import { CreateConstructionForm, type CreateConstructionFormHandle } from './modal-forms';

interface EditConstructionModalProps extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: () => void;
	wrapperClassName?: string;
	currentReportFloorInfo?: FloorConstruction;
	currentConstructionHeader?: ConstructionsEditData;
	floorId?: string;
	reportFloorInfoId?: string;
	floorConstructionInfoId?: string;
}

export const EditConstructionModal = ({
	onCancel,
	onConfirm,
	currentReportFloorInfo,
	currentConstructionHeader,
	floorId,
	reportFloorInfoId,
	floorConstructionInfoId,
	className,
	...props
}: EditConstructionModalProps) => {
	const formRef = useRef<CreateConstructionFormHandle>(null);
	const { t } = useI18n();
	const [detailsOpen, setDetailsOpen] = useState(false);

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
			constructionType: resolveConstructionClass(currentConstructionHeader.constructionType),
			id: floorConstructionInfoId ?? currentReportFloorInfo.id,
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
		if (!props.isOpen) {
			setDetailsOpen(false);
		}
	}, [props.isOpen]);

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
		floorConstructionInfoId,
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
			{...props}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			className={twMerge(
				className,
				detailsOpen &&
					'!max-w-[min(98vw,2000px)] !w-[min(98vw,2000px)] md:!w-[min(98vw,1920px)]',
			)}
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
				floorConstructionInfoId={floorConstructionInfoId ?? currentReportFloorInfo?.id}
				onSuccess={handleSuccess}
				detailsOpen={detailsOpen}
				onDetailsOpenChange={setDetailsOpen}
			/>
		</Modal>
	);
};
