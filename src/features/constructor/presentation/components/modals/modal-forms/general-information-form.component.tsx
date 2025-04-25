import { FormElementLabel } from '@core';
import {
	GeneralInformationFireResistance,
	GeneralInformationPhysical,
	GeneralInformationSoundproofing,
	GeneralInformationThermal,
} from './general-information-tables';

export const GeneralInformationForm = () => {
	return (
		<div className="flex flex-row gap-[10px] border-b">
			<div className="flex flex-col gap-[24px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Общая информация
				</FormElementLabel>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Название
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Ф2332
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Конструкция разделяет
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						Жил. комната/ жил. комната
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Длина, м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Ширина (высота), м
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Площадь, м2
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						2
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая толщина, мм
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						123
					</p>
				</div>
				<div className="flex flex-row gap-[20px]">
					<p className="w-[200px] pl-[24px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary">
						Общая масса, кг
					</p>
					<p className="w-[200px] text-left font-sans text-sm font-normal leading-5 tracking-[0.1px]">
						1212
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-[10px]">
				<FormElementLabel className="text-left font-sans font-semibold leading-6">
					Соответствие нормам
				</FormElementLabel>
				<GeneralInformationPhysical />
				<GeneralInformationSoundproofing />
				<GeneralInformationThermal />
				<GeneralInformationFireResistance />
			</div>
		</div>
	);
};
