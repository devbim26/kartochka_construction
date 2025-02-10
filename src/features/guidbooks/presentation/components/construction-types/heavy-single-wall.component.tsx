import { Button, DeleteIcon, Input, Select } from '@core';
import { BaseConstrustionLayer } from '@features/guidbooks/constants';
import { ConstructionsAddData, ConstructionsEditData } from '@features/guidbooks/utils';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface Layer {
	id: string;
}

export const HeavySingleWall = () => {
	const [search] = useSearchParams();
	const isEditMode = search.get('edit');
	const form = useFormContext<ConstructionsAddData>();
	const formEdit = useFormContext<ConstructionsEditData>();
	const { formState, control, setValue, watch } = form;

	const [topLayers, setTopLayers] = useState<Layer[]>([]);
	const [bottomLayers, setBottomLayers] = useState<Layer[]>([]);

	const handleAddLayer = (isTop = false) => {
		const newLayer = {
			id: crypto.randomUUID(),
		};
		isTop
			? setTopLayers(() => [newLayer, ...topLayers])
			: setBottomLayers(() => [...bottomLayers, newLayer]);
	};

	const handleDeleteLayer = (id: string, isTop = false) => {
		if (isTop) {
			setTopLayers(topLayers.filter((item) => item.id !== id));
		} else {
			setBottomLayers(bottomLayers.filter((item) => item.id !== id));
		}
	};

	console.log(formState.errors.heavySingleWall);

	return (
		<div className="flex flex-col gap-[16px]">
			<div className="flex flex-row items-center justify-between">
				<p className="font-sans text-sm font-semibold leading-5">1. Базовая конструкция</p>
				<Button className="border-[1px] border-solid border-red bg-background-button-red p-[7px] enabled:hover:bg-inherit">
					<DeleteIcon />
				</Button>
			</div>

			{topLayers.length < 2 && (
				<AiOutlinePlusCircle
					className="h-[33px] w-[33px] cursor-pointer self-center text-primary"
					onClick={() => handleAddLayer(true)}
				/>
			)}

			{topLayers.map((layer) => (
				<div className="flex flex-row gap-[16px]">
					<BaseConstrustionLayer key={layer.id} id={layer.id} />
					<Button
						className="border-[1px] border-solid border-red bg-background-button-red p-[7px] enabled:hover:bg-inherit"
						onClick={() => handleDeleteLayer(layer.id, true)}
					>
						<DeleteIcon />
					</Button>
				</div>
			))}

			<div className="flex flex-wrap gap-[16px]">
				<Controller
					name="heavySingleWall.0.material"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={[{ label: 'Полнотелый красный кирпич', value: '1' }]}
							error={formState.errors.heavySingleWall?.[0]?.material?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.heavySingleWall?.[0]?.material?.message
									? 'text-error'
									: '',
							)}
							wrapperClassname="ring-input-border-primary flex-row items-center gap-[16px]"
							buttonClassName="text-sm rounded-[8px] w-[226px]"
							label={
								formState.errors.heavySingleWall?.[0]?.material?.message ||
								'Тяжелая однослойная стена'
							}
							placeholder="Выберите материал"
						/>
					)}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
						formState.errors.heavySingleWall?.[0]?.thickness?.message
							? 'text-error'
							: '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
					wrapperClassName="flex-row items-center gap-[16px]"
					label={
						formState.errors.heavySingleWall?.[0]?.thickness?.message || 'Толщина, мм'
					}
					error={formState.errors.heavySingleWall?.[0]?.thickness?.message}
					placeholder="Введите толщину"
					{...form.register('heavySingleWall.0.thickness')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-nowrap',
						formState.errors.heavySingleWall?.[0]?.density?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] w-[78px]"
					wrapperClassName="flex-row items-center gap-[16px]"
					label={
						formState.errors.heavySingleWall?.[0]?.density?.message ||
						'Плотность, кг/м³'
					}
					error={formState.errors.heavySingleWall?.[0]?.density?.message}
					placeholder="Введите плотность"
					{...form.register('heavySingleWall.0.density')}
					type={'number'}
				/>
			</div>

			{bottomLayers.map((layer) => (
				<div className="flex flex-row gap-[16px]">
					<BaseConstrustionLayer key={layer.id} id={layer.id} />
					<Button
						className="border-[1px] border-solid border-red bg-background-button-red p-[7px] enabled:hover:bg-inherit"
						onClick={() => handleDeleteLayer(layer.id, false)}
					>
						<DeleteIcon />
					</Button>
				</div>
			))}

			{bottomLayers.length < 2 && (
				<AiOutlinePlusCircle
					className="h-[33px] w-[33px] cursor-pointer self-center text-primary"
					onClick={() => handleAddLayer()}
				/>
			)}
		</div>
	);
};
