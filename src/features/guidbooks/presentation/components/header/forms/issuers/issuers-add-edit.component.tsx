import { Button, convertToBase64, FormElementLabel, Input, Select, useAppDispatch } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import { fileUpload } from '@features/auth';
import { FormIssuer, RuCountryNamesSelectValues } from '@features/guidbooks/types';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const IssuersAddEdit = memoize(() => {
	const form = useFormContext<FormIssuer>();
	const { setValue, register, control, formState, trigger } = form;

	const dispatch = useAppDispatch();
	const [preview, setPreview] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<boolean>(false);

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		debugger;
		console.log(file);
		if (file) {
			try {
				const base64 = await convertToBase64(file);
				const fileData = await file.arrayBuffer();
				if (base64 && typeof base64 === 'string') {
					setValue('logoUrl', file.name);
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
		<>
			<Input
				{...register('name')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.name?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.name?.message || 'Производитель'}
				placeholder="Введите производителя"
			/>
			<Input
				{...register('webSite')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.webSite?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				label={formState.errors?.webSite?.message || 'Сайт'}
				placeholder="Введите ссылку"
			/>
			<Controller
				control={control}
				name={'country'}
				render={({ field }) => (
					<Select
						options={RuCountryNamesSelectValues}
						{...field}
						value={field.value || ''}
						label={formState.errors?.country?.message || 'Страна'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.country?.message ? 'text-error' : '',
						)}
						placeholder="Выберите страну"
						buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
						wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
					/>
				)}
			/>
			<div className="relative flex items-start gap-4">
				<div className="flex flex-col gap-y-2">
					<FormElementLabel
						className={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.logoUrl?.message ? 'text-error' : '',
						)}
						errorMessage={formState.errors.logoUrl?.message}
					>
						Логотип
					</FormElementLabel>
					<div className="flex items-center gap-[8px]">
						<Button
							variant="primary"
							className={twMerge(
								'group flex w-fit flex-row items-center gap-[4px] border-2 border-solid border-primary bg-white',
								formState.errors.logoUrl?.message ? 'border-error' : '',
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
							className="h-[60px] w-[60px] rounded-md object-cover"
						/>
					</div>
				)}
			</div>
		</>
	);
}, 'IssuersAddEdit');
