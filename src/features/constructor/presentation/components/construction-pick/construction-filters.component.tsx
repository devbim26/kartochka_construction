import { Button, FormElementLabel, Input } from '@core';
import type { ConstructionSelectRestrictions } from '@features/constructor/types';
import { useFormContext } from 'react-hook-form';
import { IoOptionsSharp } from 'react-icons/io5';

type Props = {
	onSubmit: () => void;
};

export const ConstructionFilters = ({ onSubmit }: Props) => {
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
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxThickness')}
						type={'number'}
						placeholder="Толщина max"
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">Масса, кг/м²</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minWeight')}
						type={'number'}
						placeholder="Масса min"
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxWeight')}
						type={'number'}
						placeholder="Масса max"
					/>
				</div>
				<div className="flex gap-[10px]">
					<FormElementLabel className="w-[400px]">
						Звукоизоляция лабораторная, дБ
					</FormElementLabel>
					<Input
						wrapperClassName="flex-row items-center gap-[10px] "
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('minLabIndex')}
						type={'number'}
						placeholder="Звукоизоляция лаб. min"
					/>
					<Input
						wrapperClassName="flex-row items-center gap-[10px]"
						inputClassName="w-[300px] py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5"
						{...register('maxLabIndex')}
						type={'number'}
						placeholder="Звукоизоляция лаб. max"
					/>
				</div>
				<Button
					className={
						'h-[40px] w-[100px] self-end bg-white px-[16px] font-sans text-sm font-semibold text-primary shadow-none ring-2 ring-inset ring-primary enabled:hover:bg-primary enabled:hover:text-white'
					}
					onClick={onSubmit}
				>
					Применить
				</Button>
			</div>
		</div>
	);
};
