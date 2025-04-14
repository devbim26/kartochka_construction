import { Button, Input } from '@core';
import type { DesigningData } from '@features';
import { ConstructionTypeEnum, ConstructionTypeMap, DesigningConfig } from '@features';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export const Designing = () => {
	const form = useForm<DesigningData>({
		resolver: zodResolver(DesigningConfig.schema),
		defaultValues: DesigningConfig.defaultValues,
		mode: 'onSubmit',
	});

	const { formState } = form;

	useEffect(() => {
		ConstructionTypeMap({
			currentConstruction: currentConstruction as ConstructionTypeEnum,
			currentForm: form,
		}).action();
	}, []);

	const currentConstruction = ConstructionTypeEnum.HeavySingleLayerWall;

	return (
		<div className="flex w-full flex-col gap-[30px]">
			<div className="flex h-[428px] w-full flex-row gap-[72px] rounded-[20px] bg-white px-[44px] py-[34px]">
				<img className="h-full w-[100px]" />
				<div className="flex flex-col gap-[30px]">
					<Input
						label="Тип конструкции"
						labelClassName="font-sans text-[16px] font-[600] text-input-label-primary"
						inputClassName="h-[30px] px-[12px] font-sans text-[14px] font-[400] w-[300px] rounded-[8px]"
						wrapperClassName="flex-row items-center gap-[66px]"
						value={'Тяжелая однослойная стена + облицовка'}
						disabled
					/>
					<div className="flex flex-col">
						<p className="text-[20px]">- Красный пустотелый кирпич -200 mm</p>
						<p className="text-[20px]">- Стальной каркас -50 mm</p>
						<p className="text-[20px]">- Базальтовая вата -50 mm</p>
						<p className="text-[20px]">- Воздушный промежуток -50 mm</p>
						<p className="text-[20px]">- ГКЛ -13 mm</p>
						<p className="text-[20px]">- ГКЛ -13 mm</p>
					</div>
				</div>
			</div>
			<div className="flex w-full flex-col gap-[35px] rounded-[20px] bg-white px-[25px] py-[27px]">
				{
					ConstructionTypeMap({
						currentConstruction: currentConstruction as ConstructionTypeEnum,
						currentForm: form,
					}).component
				}
				<Button
					className="ml-auto h-[40px] w-fit px-[16px] font-sans text-sm font-semibold shadow-none"
					onClick={form.handleSubmit(
						(data) => console.log(data),
						(errors) => console.log(errors),
					)}
				>
					Применить
				</Button>
			</div>
			<div className="flex w-full gap-[72px] rounded-[20px] bg-white px-[25px] py-[27px]"></div>
		</div>
	);
};
