import { convertToBase64, Input, Select, useAppDispatch } from '@core';
import { convertToPaginatedType, convertToSelectValues } from '@core/converters';
import {
	fileUpload,
	FormSubTitle,
	getGuidebooksMaterialTypes,
	getGuidebooksPaginated,
	Guidebooks,
	RuMaterialOriginTypesSelectValues,
	RuRegionNamesSelectValues,
	type Issuer,
	type MaterialsAddAndEditData,
	type MaterialType,
} from '@features';
import {
	convertToClientIssuerData,
	convertToClientMaterialTypeList,
} from '@features/guidbooks/converters';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const MaterialsAddAndEdit = () => {
	const form = useFormContext<MaterialsAddAndEditData>();
	const { formState, control, setValue } = form;
	const dispatch = useAppDispatch();
	const [preview, setPreview] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<boolean>(false);
	const [issuers, setIssuers] = useState<Issuer[]>([]);
	const [materialTypes, setMaterialTypes] = useState<MaterialType[]>([]);

	const handleGetIssuerData = useCallback(async () => {
		try {
			const response = await getGuidebooksPaginated({
				data: {
					name: null,
					country: null,
					logoUrl: null,
					webSite: null,
				},
				guidebookType: Guidebooks.ISSUER,
			});

			const items = convertToPaginatedType(convertToClientIssuerData)(response.data as any);
			setIssuers(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	const handleGetMaterialTypeData = useCallback(async () => {
		try {
			const response = await getGuidebooksMaterialTypes();
			const items = convertToClientMaterialTypeList(response.data);
			setMaterialTypes(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	useEffect(() => {
		handleGetIssuerData();
		handleGetMaterialTypeData();
	}, []);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			try {
				const base64 = await convertToBase64(file);
				const fileData = await file.arrayBuffer();
				if (base64 && typeof base64 === 'string') {
					setValue('image', file.name);
					setPreview(base64);
					dispatch(
						fileUpload({
							data: { mimeType: file.type, isPublic: true },
							file: fileData,
						}),
					);
					setUploadError(false);
				}
			} catch (error) {
				setUploadError(true);
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
					name="materialType.id"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							value={field.value || ''}
							options={materialTypes.map((data) => ({
								label: data.label,
								value: data.id,
							}))}
							error={formState.errors.materialType?.id?.message}
							labelClassName={twMerge(
								'text-sm leading-5 tracking-[0.1px]',
								formState.errors.materialType?.id?.message ? 'text-error' : '',
							)}
							wrapperClassname="w-[226px] ring-input-border-primary"
							buttonClassName="text-sm rounded-[8px]"
							label={formState.errors.materialType?.id?.message || 'Тип материала'}
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
							options={convertToSelectValues(issuers) ?? []}
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
				{/* <div className="relative flex items-start gap-4">
					<div className="flex flex-col gap-y-2">
						<FormElementLabel
							className={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
								formState.errors.image?.message ? 'text-error' : '',
							)}
							errorMessage={formState.errors.image?.message}
						>
							Логотип
						</FormElementLabel>
						<div className="flex items-center gap-[8px]">
							<Button
								variant="primary"
								className={twMerge(
									'group flex w-fit flex-row items-center gap-[4px] border-2 border-solid border-primary bg-white',
									formState.errors.image?.message ? 'border-error' : '',
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
					{preview && (
						<div className="flex justify-center self-center">
							<img
								src={preview}
								alt="Превью изображения"
								className="size-[60px] rounded-md object-cover"
							/>
						</div>
					)}
				</div> */}
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
			</div>
		</div>
	);
};
