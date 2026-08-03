import type { ModalProps } from '@core';
import { Button, Modal, useI18n } from '@core';
import { twJoin, twMerge } from 'tailwind-merge';
import { AddRoomForm, type AddRoomFormValues } from './modal-forms/add-room-form.component';

interface Props extends Omit<ModalProps, 'Footer'> {
	onCancel: () => void;
	onConfirm: (data: AddRoomFormValues) => void;
	activeTab?: 'walls' | 'floors' | 'rooms';
	onTabChange?: (tab: 'walls' | 'floors' | 'rooms') => void;
}

export const AddRoomModal = ({
	onCancel,
	onConfirm,
	activeTab = 'rooms',
	onTabChange,
	...props
}: Props) => {
	const { t } = useI18n();
	const modalTabLabelKey = {
		walls: 'floorPlans.modal.addWall',
		floors: 'floorPlans.modal.addFloor',
		rooms: 'floorPlans.modal.addRoom',
	} as const;

	return (
		<Modal
			Footer={() => (
				<div className="flex justify-end gap-7 px-4 py-3">
					<Button
						type="button"
						onClick={onCancel}
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">{t('common.cancel')}</p>
					</Button>
					<Button
						type="submit"
						form="add-room-form"
						className="flex w-fit flex-row items-center px-4 py-1.5"
					>
						<p className="font-sans text-sm font-semibold">{t('common.save')}</p>
					</Button>
				</div>
			)}
			contentClassName={twJoin('text-center', props.contentClassName ?? '')}
			{...props}
		>
			<div className="mb-4 flex flex-row flex-wrap gap-[12px]">
				{(['walls', 'floors'] as const).map((tab) => (
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
			<AddRoomForm onSubmit={onConfirm} />
		</Modal>
	);
};
