import { Button, DeleteIcon, Input, Select } from '@core';
import { ConstructionsData, FormSubTitle, RuRegionNamesSelectValues } from '@features';
import { RuPriorityNamesSelectValues } from '@features/guidbooks/types/priority.types';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const ConstructionsAddAndEdit = () => {
	const form = useFormContext<ConstructionsData>();

	const { formState, control, watch } = form;

	const selectedConstruction = watch('constructionType');

	return (
		<div className="flex flex-col gap-[16px]">
			<FormSubTitle text="Описание" />
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.name?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.name?.message || 'Название конструкции'}
					error={formState.errors.name?.message}
					placeholder="Введите название"
					{...form.register('name')}
					type={'text'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.description?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.description?.message || 'Описание'}
					error={formState.errors.description?.message}
					placeholder="Введите описание"
					{...form.register('description')}
					type={'text'}
				/>
				<Controller
					name="priority"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={RuPriorityNamesSelectValues}
							error={formState.errors.priority?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.priority?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.priority?.message || 'Приоритет'}
							placeholder="Выберите приоритет"
						/>
					)}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.constructionSource?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.constructionSource?.message || 'Источник'}
					error={formState.errors.constructionSource?.message}
					placeholder="Введите источник"
					{...form.register('constructionSource')}
					type={'text'}
				/>
				<Controller
					name="region"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							isSearchable
							value={field.value || ''}
							options={RuRegionNamesSelectValues}
							error={formState.errors.region?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.region?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.region?.message || 'Регион'}
							placeholder="Выберите регион"
						/>
					)}
				/>
				<Controller
					name="manufacturer"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={[{ label: '1', value: '1' }]}
							error={formState.errors.manufacturer?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.manufacturer?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.manufacturer?.message || 'Производитель'}
							placeholder="Выберите производителя"
						/>
					)}
				/>
			</div>
			<FormSubTitle text="Характеристики" />
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.maxHeight?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.maxHeight?.message || 'Максимальная высота, м'}
					error={formState.errors.maxHeight?.message}
					placeholder="Введите высоту"
					{...form.register('maxHeight')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.resistanceClass?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.resistanceClass?.message || 'Класс огнестойкости, EI'}
					error={formState.errors.resistanceClass?.message}
					placeholder="Введите класс"
					{...form.register('resistanceClass')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.specificationsSource?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.specificationsSource?.message || 'Источник'}
					error={formState.errors.specificationsSource?.message}
					placeholder="Введите источник"
					{...form.register('specificationsSource')}
					type={'text'}
				/>
			</div>
			<FormSubTitle text="Лабораторные тесты" />
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.index?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.index?.message || 'Индекс'}
					error={formState.errors.index?.message}
					placeholder="Введите индекс"
					{...form.register('index')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.indexValue?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.indexValue?.message || 'Index value, dBA'}
					error={formState.errors.indexValue?.message}
					placeholder="Введите индекс"
					{...form.register('indexValue')}
					type={'number'}
				/>
			</div>
			<FormSubTitle text="Тип конструкции" />
			<Controller
				name="constructionType"
				control={control}
				render={({ field }) => (
					<Select
						{...field}
						value={field.value || ''}
						options={[{ label: '1', value: '1' }]}
						error={formState.errors.constructionType?.message}
						labelClassName={twMerge(
							'text-sm leading-5 tracking-[0.1px]',
							formState.errors.constructionType?.message ? 'text-error' : '',
						)}
						wrapperClassname="w-[226px] ring-input-border-primary"
						buttonClassName="text-sm rounded-[8px]"
						label={formState.errors.constructionType?.message || ''}
						placeholder="Выберите тип"
					/>
				)}
			/>
			{selectedConstruction && (
				<div className="flex flex-row items-center justify-between">
					<p className="font-sans text-sm font-semibold leading-5">
						1. Базовая конструкция
					</p>
					<Button className="bg-background-button-red border-red border-[1px] border-solid p-[7px] enabled:hover:bg-inherit">
						<DeleteIcon />
					</Button>
				</div>
			)}
		</div>
	);
};
