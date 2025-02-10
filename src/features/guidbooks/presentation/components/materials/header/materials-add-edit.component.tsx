import { Button, convertToBase64, FormElementLabel, Input, Select, useAppDispatch } from '@core';
import {
	fileUpload,
	FormSubTitle,
	MaterialsAddAndEditData,
	RuRegionNamesSelectValues,
} from '@features';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const MaterialsAddAndEdit = () => {
	const form = useFormContext<MaterialsAddAndEditData>();

	const { formState, control } = form;

	const dispatch = useAppDispatch();

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			form.setValue('image.name', file.name);
			const base64 = await convertToBase64(file);
			const fileData = await file.arrayBuffer();
			if (base64) {
				form.setValue('image.data', base64);
				dispatch(
					fileUpload({
						data: { mimeType: file.type, isPublic: true },
						file: fileData,
					}),
				);
				form.setValue('image.url', '123');
			}
		}
	};

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
					label={formState.errors.name?.message || 'Название'}
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
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.shortName?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.shortName?.message || 'Краткое название'}
					error={formState.errors.shortName?.message}
					placeholder="Введите краткое название"
					{...form.register('shortName')}
					type={'text'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.density?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.density?.message || 'Плотность материала, кг/м³'}
					error={formState.errors.density?.message}
					placeholder="Введите плотность материала"
					{...form.register('density')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.thickness?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.thickness?.message || 'Толщина материала, мм'}
					error={formState.errors.thickness?.message}
					placeholder="Введите толщину материала"
					{...form.register('thickness')}
					type={'number'}
				/>
				<Controller
					name="materialType"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={[{ label: '1', value: '1' }]}
							error={formState.errors.materialType?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.materialType?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.materialType?.message || 'Тип материала'}
							placeholder="Выберите тип материала"
						/>
					)}
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
					name="type"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={[{ label: '1', value: '1' }]}
							error={formState.errors.type?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.type?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.type?.message || 'Тип'}
							placeholder="Выберите тип"
						/>
					)}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.manufacturer?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.manufacturer?.message || 'Производитель'}
					error={formState.errors.manufacturer?.message}
					placeholder="Введите производителя"
					{...form.register('manufacturer')}
					type={'text'}
				/>
				<div className="flex flex-col gap-[8px]">
					<FormElementLabel
						className={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.image?.url ? 'text-error' : '',
						)}
					>
						{formState.errors.image?.url?.message || 'Изображение'}
					</FormElementLabel>
					<div className="flex">
						<Button
							className="group flex h-[32px] w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[13px] group-hover:bg-primary"
							onClick={() => document.getElementById('file-upload')!.click()}
						>
							<p className="border-primary font-sans text-sm font-semibold leading-4 text-primary group-hover:text-white">
								Выбрать изображение
							</p>
						</Button>
						<input
							type="file"
							id="file-upload"
							accept="image/*"
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
				</div>
			</div>
			<FormSubTitle text="Физические свойства" />
			<div className="flex flex-wrap gap-[16px]">
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.materialCoefficient?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.materialCoefficient?.message || 'Коэффициент материала'}
					error={formState.errors.materialCoefficient?.message}
					placeholder="Введите коэффициент"
					{...form.register('materialCoefficient')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.speedOfSound?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.speedOfSound?.message || 'Скорость звука'}
					error={formState.errors.speedOfSound?.message}
					placeholder="Введите скорость"
					{...form.register('speedOfSound')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.lossFactor?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.lossFactor?.message || 'Коэффициент потерь'}
					error={formState.errors.lossFactor?.message}
					placeholder="Введите коэффициент"
					{...form.register('lossFactor')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.youngModulus?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.youngModulus?.message || 'Модуль Юнга материала, ГПа'}
					error={formState.errors.youngModulus?.message}
					placeholder="Введите модуль Юнга"
					{...form.register('youngModulus')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.damping?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.damping?.message || 'Коэффициент демпфирования'}
					error={formState.errors.damping?.message}
					placeholder="Введите коэффициент"
					{...form.register('damping')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.solid?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.solid?.message || 'Полнотелость, %'}
					error={formState.errors.solid?.message}
					placeholder="Введите значение"
					{...form.register('solid')}
					type={'number'}
				/>
			</div>
		</div>
	);
};
