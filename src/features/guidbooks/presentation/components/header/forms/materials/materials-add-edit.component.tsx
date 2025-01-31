import {
	Button,
	convertToBase64,
	FormElementLabel,
	Input,
	memoize,
	Select,
	useAppDispatch,
} from '@core';
import {
	fileUpload,
	FormSubTitle,
	MaterialsData,
	RuRegionNamesSelectValues,
	type HeaderFormsProps,
	type IMaterialsAddAndEditForm,
} from '@features';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const MaterialsAddAndEdit = memoize(
	({ control }: HeaderFormsProps<IMaterialsAddAndEditForm>) => {
		const form = useFormContext<MaterialsData>();
		const onSubmit = () => {};

		const { formState, watch, setValue } = form;

		const dispatch = useAppDispatch();

		useEffect(() => {
			form.trigger();
			form.handleSubmit(() => console.log(123))();
		}, []);

		console.log(watch('name'));

		form.watch();

		const handleFileChange = async (
			event: React.ChangeEvent<HTMLInputElement>,
		): Promise<void> => {
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

		console.log(formState.errors);

		return (
			<div className="flex flex-col gap-[23px]">
				<FormSubTitle text="Описание" />
				<div className="flex flex-wrap gap-[23px]">
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
						label={formState.errors.thickness?.message || 'Толщина материала, кг/м³'}
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
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									formState.errors.materialType?.message ? 'text-error' : '',
								)}
								buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
								wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
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
								value={field.value || ''}
								options={RuRegionNamesSelectValues}
								error={formState.errors.region?.message}
								labelClassName={twMerge(
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									formState.errors.region?.message ? 'text-error' : '',
								)}
								buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
								wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
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
									'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
									formState.errors.type?.message ? 'text-error' : '',
								)}
								buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
								wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
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
							{formState.errors.image?.url?.message || 'Логотип компании'}
						</FormElementLabel>
						<div className="flex">
							<Button
								className="group flex w-fit flex-row items-center gap-[4px] border border-solid border-primary bg-background-button-secondary px-[16px] py-[6px] group-hover:bg-primary"
								onClick={() => document.getElementById('file-upload')!.click()}
							>
								<p className="border-primary font-sans text-base font-semibold leading-4 text-primary group-hover:text-white">
									Загрузить
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
				<div className="flex flex-wrap gap-[23px]"></div>
			</div>
		);
	},
	'MaterialsAddAndEdit',
);
