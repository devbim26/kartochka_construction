import { Button, FormElementLabel, Input } from '@core';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import { useFormContext } from 'react-hook-form';
import { IoOptionsSharp } from 'react-icons/io5';

export const ConstructionFilters = () => {
	const { register } = useFormContext<ConstructionSelectRestrictions>();
	return (
		<div className="flex h-fit w-full flex-col rounded-xl bg-white pt-[18px]">
			<div className="flex items-center justify-between border-b px-[24px] pb-[18px]">
				<p className="font-sans text-lg font-semibold leading-4">Ограничения</p>
				<IoOptionsSharp className="size-[25px] text-primary" />
			</div>
			<div className="flex w-full flex-col gap-[20px] px-[24px] py-[10px]">
				<div className="flex w-full gap-[10px]">
					<FormElementLabel className="w-[400px]">Толщина, мм</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minThickness')}
						type={'number'}
						placeholder="Толщина min"
						max={50}
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxThickness')}
						type={'number'}
						placeholder="Толщина max"
						max={50}
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">Масса, кг/м2</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minHeight')}
						type={'number'}
						placeholder="Масса min"
						max={50}
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxHeight')}
						type={'number'}
						placeholder="Масса max"
						max={50}
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">Высота, м</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minHeight')}
						type={'number'}
						placeholder="Высота min"
						max={50}
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxHeight')}
						type={'number'}
						placeholder="Высота max"
						max={50}
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">
						Звукоизоляция расчетная, дБ
					</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minIndex')}
						type={'number'}
						placeholder="Звукоизоляция расчетная min"
						max={50}
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxIndex')}
						type={'number'}
						placeholder="Звукоизоляция расчетная max"
						max={50}
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">
						Звукоизоляция лабораторая, дБ
					</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minLabIndex')}
						type={'number'}
						placeholder="Звукоизоляция лабораторая min"
						max={50}
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxLabIndex')}
						type={'number'}
						placeholder="Звукоизоляция лабораторая max"
						max={50}
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">
						Предел огнестойкости, EI
					</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minFireresistance')}
						type={'number'}
						placeholder="Предел огнестойкости min"
						max={50}
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxFireresistance')}
						type={'number'}
						placeholder="Предел огнестойкости max"
						max={50}
					/>
				</div>
				<Button
					className={
						'h-[40px] w-[100px] self-end bg-white px-[16px] font-sans text-sm font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-primary enabled:hover:text-white'
					}
				>
					Применить
				</Button>
			</div>
		</div>
	);
};
