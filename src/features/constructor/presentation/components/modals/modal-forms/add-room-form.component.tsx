import { Input, Select, useI18n, type SelectOption } from '@core';
import { RoomPlacementKind } from '@features/constructor/types/room-placement.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

const addRoomSchema = z.object({
	name: z.string().min(1, 'validation.required'),
	roomKind: z.nativeEnum(RoomPlacementKind),
});

export type AddRoomFormValues = z.infer<typeof addRoomSchema>;

type Props = {
	onSubmit: (data: AddRoomFormValues) => void;
};

export const AddRoomForm = ({ onSubmit }: Props) => {
	const { t } = useI18n();
	const form = useForm<AddRoomFormValues>({
		defaultValues: {
			name: '',
			roomKind: RoomPlacementKind.RoomA,
		},
		resolver: zodResolver(addRoomSchema),
	});
	const { register, control, formState, handleSubmit } = form;

	const roomKindOptions: SelectOption[] = [
		{ label: t('floorPlans.roomKind.roomA'), value: RoomPlacementKind.RoomA },
		{ label: t('floorPlans.roomKind.roomB'), value: RoomPlacementKind.RoomB },
	];

	return (
		<FormProvider {...form}>
			<form
				className="flex flex-col gap-[20px]"
				onSubmit={handleSubmit(onSubmit)}
				id="add-room-form"
			>
				<Input
					{...register('name')}
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 text-input-label-primary w-[145px] text-left',
						formState.errors.name?.message ? 'text-error' : '',
					)}
					wrapperClassName="shadow-none ring-input-border-primary flex-row gap-[20px]"
					inputClassName="w-[226px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
					error={
						formState.errors.name?.message
							? t(formState.errors.name.message as any)
							: undefined
					}
					containerClassName="w-[226px]"
					label={
						formState.errors?.name?.message
							? t(formState.errors.name.message as any)
							: t('floorPlans.addRoom.nameLabel')
					}
					placeholder={t('floorPlans.addRoom.namePlaceholder')}
					maxLength={80}
				/>
				<Controller
					control={control}
					name="roomKind"
					render={({ field }) => (
						<Select
							options={roomKindOptions}
							{...field}
							value={field.value || ''}
							label={t('floorPlans.addRoom.kindLabel')}
							labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary w-[145px] text-left"
							buttonClassName="w-[226px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
							wrapperClassname="shadow-none ring-input-border-primary flex-row gap-[20px]"
						/>
					)}
				/>
			</form>
		</FormProvider>
	);
};
