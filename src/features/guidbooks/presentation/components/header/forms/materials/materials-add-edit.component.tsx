import { Button, CheckboxSelect, convertToBase64, FormElementLabel, Input, Select } from '@core';
import { convertToPaginatedType, convertToSelectValues } from '@core/converters';
import { convertToClientIssuerData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	Guidebooks,
	RuCountryNamesSelectValues,
	RuMaterialOriginTypesSelectValues,
	RuMaterialTypesSelectValues,
	type Issuer,
	type MaterialsAddAndEditData,
} from '@features/guidbooks/types';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../../form-sub-title.component';

export const MaterialsAddAndEdit = () => {
	const form = useFormContext<MaterialsAddAndEditData>();
	const { formState, control, setValue, trigger, watch } = form;
	const [issuerData, setIssuerData] = useState<Array<Issuer>>([]);

	const handleGetIssuerData = useCallback(async () => {
		try {
			const response = await getGuidebooksPaginated({
				data: { name: null, country: null, logoUrl: null, webSite: null },
				guidebookType: Guidebooks.ISSUER,
				pagination: { pageNumber: 1, pageSize: 99999 },
			});

			const resData = convertToPaginatedType(convertToClientIssuerData)(response.data as any);
			setIssuerData(resData.items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	useEffect(() => {
		handleGetIssuerData();
	}, []);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('imageUrl', base64);
				setValue('imageFile', file);
			}
			trigger('imageUrl');
			trigger('imageFile');
		}
	};

	const imageUrl = watch('imageUrl');

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
							isSearchable
							options={RuMaterialTypesSelectValues}
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
					name="country"
					control={control}
					render={({ field }) => (
						<CheckboxSelect
							{...field}
							value={field.value || []}
							options={RuCountryNamesSelectValues}
							searchable
							multiple
							classNames={{
								popover: {
									buttonClassName: twMerge(
										formState.errors.country?.message ? 'ring-error' : '',
									),
									labelClassName: twMerge(
										formState.errors.country?.message ? 'text-error' : '',
									),
								},
							}}
							label={formState.errors.country?.message || 'Страна'}
							placeholder="Выберите страну"
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
							isSearchable
							options={RuMaterialOriginTypesSelectValues}
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
				<Controller
					name="issuer"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							isSearchable
							options={convertToSelectValues(issuerData) ?? []}
							error={formState.errors.issuer?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.issuer?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.issuer?.message || 'Производитель'}
							placeholder="Выберите производителя"
						/>
					)}
				/>
				<div className="relative flex items-start gap-4">
					<div className="flex flex-col gap-y-2">
						<FormElementLabel
							className={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
								formState.errors.imageUrl?.message ||
									formState.errors.imageFile?.message?.toString()
									? 'text-error'
									: '',
							)}
							errorMessage={
								formState.errors.imageUrl?.message ||
								formState.errors.imageFile?.message?.toString()
							}
						>
							Изображение
						</FormElementLabel>
						<div className="flex items-center gap-[8px]">
							<Button
								variant="primary"
								className={twMerge(
									'group flex w-fit flex-row items-center gap-[4px] border-2 border-solid border-primary bg-white',
									formState.errors.imageUrl?.message ||
										formState.errors.imageFile?.message
										? 'border-error'
										: '',
								)}
								onClick={() => document.getElementById('file-upload')!.click()}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
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
					{imageUrl && (
						<div className="flex justify-center self-center">
							<img
								src={imageUrl}
								alt="Превью изображения"
								className="size-[60px] rounded-md object-cover"
							/>
						</div>
					)}
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
						formState.errors.relativeCompression?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.relativeCompression?.message || 'Относительное сжатие'}
					error={formState.errors.relativeCompression?.message}
					placeholder="Введите сжатие"
					{...form.register('relativeCompression')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.velocity?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.velocity?.message || 'Скорость звука'}
					error={formState.errors.velocity?.message}
					placeholder="Введите скорость"
					{...form.register('velocity')}
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
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.fc?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.fc?.message || 'Fc'}
					error={formState.errors.fc?.message}
					placeholder="Введите значение"
					{...form.register('fc')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.fb?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.fb?.message || 'Fb'}
					error={formState.errors.fb?.message}
					placeholder="Введите значение"
					{...form.register('fb')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.rc?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.rc?.message || 'Rc'}
					error={formState.errors.rc?.message}
					placeholder="Введите значение"
					{...form.register('rc')}
					type={'number'}
				/>
				<Input
					labelClassName={twMerge(
						'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
						formState.errors.rb?.message ? 'text-error' : '',
					)}
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={formState.errors.rb?.message || 'Rb'}
					error={formState.errors.rb?.message}
					placeholder="Введите значение"
					{...form.register('rb')}
					type={'number'}
				/>
			</div>
		</div>
	);
};
