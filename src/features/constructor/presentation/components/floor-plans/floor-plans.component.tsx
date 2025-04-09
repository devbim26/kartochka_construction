import { Button, convertToBase64, DeleteIcon, useAppSelector } from '@core';
import { memoize } from '@core/utils';
import type { FloorPlansData } from '@features/constructor/types';
import { FloorPlansConfig } from '@features/constructor/utils';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { FloorPlanViewer } from '../floor-plan/floor-plan-viewer.component';

export const FloorPlans = memoize(() => {
	const form = useForm<FloorPlansData>({
		defaultValues: FloorPlansConfig.defaultValues,
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
			<div className="flex flex-col gap-[18px] border-b px-[24px] py-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">Добавить уровень</p>
				<Button className="flex h-[28px] w-[100px] flex-row items-center bg-white px-[10px] py-[6px] font-sans font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-white">
					<FaPlus width={'16px'} height={'16px'} />
					0.000
					<DeleteIcon onClick={() => console.log(123)} withoutBg withoutBorder />
				</Button>
			</div>
			<div className="flex flex-col border-b">
				<div className="flex flex-col items-center gap-[20px]">
					{form.watch('floorPlanFile') ? (
						<FloorPlanViewer />
					) : (
						<>
							<Button
								className="h-[40px] w-[190px] px-[16px] text-[16px]"
								onClick={() => document.getElementById('pdf-upload')?.click()}
								disabled={!aboutBuildingData?.data?.isFloorPlan}
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
							<p className="font-sans text-lg leading-4">или</p>
							<Button className="h-[40px] w-[190px] bg-white px-[16px] text-[16px] text-primary ring-2 ring-inset ring-primary enabled:hover:bg-white">
								Создать конструкцию
							</Button>
						</>
					)}
				</div>
			</div>
			<div className="flex border-b py-[30px]"></div>
		</div>
	);
}, 'FloorPlans');
