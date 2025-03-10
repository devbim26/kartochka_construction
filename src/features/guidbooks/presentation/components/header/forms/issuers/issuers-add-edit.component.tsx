import { Button, convertToBase64, FormElementLabel, Input, Select } from '@core';
import { memoize } from '@core/utils/hoc/memo.utils';
import type { Issuer } from '@features/guidbooks/types';
import { RuCountryNamesMap, RuCountryNamesSelectValues } from '@features/guidbooks/types';
import { Controller, useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export const IssuersAddEdit = memoize(() => {
	const form = useFormContext<Issuer>();
	const { setValue, register, control, formState, trigger, watch } = form;

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
		const file = event.target.files?.[0];
		if (file) {
			const base64 = await convertToBase64(file);
			if (base64 && typeof base64 === 'string') {
				setValue('logoUrl', base64);
			}
			trigger('logoUrl');
		}
	};
	const logo = watch('logoUrl');
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
				max={50}
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
				max={50}
			/>
			<Controller
				control={control}
				name={'countries'}
				render={({ field }) => (
					<Select
						multiple
						options={[
							{ label: RuCountryNamesMap.None, value: RuCountryNamesMap.None },
							...RuCountryNamesSelectValues.filter(
								(reg) => reg.label !== RuCountryNamesMap.None,
							).sort((a, b) => a.label.localeCompare(b.label)),
						]}
						{...field}
						value={field.value || []}
						label={formState.errors?.countries?.message || 'Страна'}
						isSearchable
						labelClassName={twMerge(
							'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
							formState.errors.countries?.message ? 'text-error' : '',
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
						errorMessage={formState.errors.logoUrl?.message?.toString()}
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
				{logo && (
					<div className="flex justify-center self-center">
						<img
							src={logo}
							alt="Превью изображения"
							className="size-[60px] rounded-md object-cover"
						/>
					</div>
				)}
			</div>
		</>
	);
}, 'IssuersAddEdit');
