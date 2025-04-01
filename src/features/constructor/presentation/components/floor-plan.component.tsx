import { Button, convertToBase64, memoize, useAppSelector } from '@core';
import type { FloorPlanData } from '@features/constructor/types';
import { ConstructorFloorPlanFormDataConfig } from '@features/constructor/utils';
import { useForm } from 'react-hook-form';

export const FloorPlanForm = memoize(() => {
	const form = useForm<FloorPlanData>({
		defaultValues: ConstructorFloorPlanFormDataConfig.defaultValues,
	});
	const { trigger, control, formState, setValue } = form;

	const handleUploadPdf = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file && file.type === 'application/pdf') {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('floorPlanPdf', base64);
				setValue('floorPlanFile', file);
			}
			trigger('floorPlanPdf');
			trigger('floorPlanFile');
		}
	};

	const aboutBuildingData = useAppSelector((store) => store.constructorData);

	return (
		<div className="flex flex-col rounded-xl bg-white">
			<div className="flex border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">Добавить уровень</p>
			</div>
			{aboutBuildingData?.data?.isFloorPlan && (
				<div className="flex flex-col gap-[20px]">
					<Button
						className="mb-[44px] text-[22px] leading-[27px]"
						onClick={() => document.getElementById('pdf-upload')?.click()}
					>
						Загрузить план этажа
					</Button>
					<input
						type="file"
						id="pdf-upload"
						accept="application/pdf"
						onChange={handleUploadPdf}
						className="hidden"
					/>
				</div>
			)}
		</div>
	);
}, 'FloorPlan');
