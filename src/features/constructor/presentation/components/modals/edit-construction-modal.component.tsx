import type { ModalProps } from '@core';
import { Button, Modal } from '@core';
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

	const handleConfirm = () => {
		formRef.current?.submit();
	};

	const handleSuccess = () => {
		toast.success('Конструкция успешно отредактирована!');
		onConfirm();
	};

	useEffect(() => {
		if (currentReportFloorInfo && currentConstructionHeader) {
			formRef.current?.reset({
				constructionType:
					currentReportFloorInfo.reportConstructionHeader.requirement?.constructionType,
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
		}
	}, [currentReportFloorInfo, currentConstructionHeader]);

	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Отмена</p>
					</Button>
					<Button
						onClick={handleConfirm}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">Редактировать конструкции</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			<CreateConstructionForm
				x={currentReportFloorInfo?.coordinates.x}
				page={currentReportFloorInfo?.page}
				y={currentReportFloorInfo?.coordinates.y}
				ref={formRef}
				floorId={floorId}
				onSuccess={handleSuccess}
			/>
		</Modal>
	);
};
