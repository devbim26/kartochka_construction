import { Input, Select, useI18n } from '@core';
import { getAcousticModels } from '@features/guidbooks/services/acoustic-model.services';
import type { AcousticModel } from '@features/guidbooks/types/acoustic-models';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export const AcousticModelAddEdit = () => {
	const form = useFormContext<AcousticModel>();
	const { register, control, formState, watch } = form;
	const { t } = useI18n();
	const [search] = useSearchParams();
	const isEdit = search.get('edit') === 'true';
	const openRouterModelId = watch('openRouterModelId');
	const modelName = watch('name');
	const [modelOptions, setModelOptions] = useState<{ value: string; label: string }[]>([]);

	useEffect(() => {
		let cancelled = false;
		getAcousticModels({ name: '' })
			.then((response) => {
				if (cancelled) return;
				setModelOptions(
					(response.data ?? [])
						.filter((item) => item.openRouterModelId)
						.map((item) => ({
							value: String(item.openRouterModelId),
							label: item.name || String(item.openRouterModelId),
						})),
				);
			})
			.catch(() => {
				if (!cancelled) setModelOptions([]);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const selectOptions = useMemo(() => {
		if (!isEdit) return modelOptions;
		if (!openRouterModelId) return modelOptions;
		const exists = modelOptions.some((o) => o.value === openRouterModelId);
		if (exists) return modelOptions;
		return [
			{
				value: openRouterModelId,
				label: modelName || openRouterModelId,
			},
			...modelOptions,
		];
	}, [isEdit, modelOptions, modelName, openRouterModelId]);

	return (
		<>
			{isEdit ? (
				<Input
					value={watch('name') || openRouterModelId || ''}
					readOnly
					disabled
					labelClassName="font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary"
					inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
					containerClassName="w-[226px]"
					label={t('guides.acousticModels.fields.name')}
				/>
			) : (
				<Controller
					control={control}
					name="openRouterModelId"
					render={({ field }) => (
						<Select
							options={selectOptions}
							value={field.value ?? ''}
							onChange={(value) => field.onChange(value ? String(value) : '')}
							onBlur={field.onBlur}
							isSearchable
							disablePlaceholder
							error={formState.errors.openRouterModelId?.message}
							label={
								formState.errors.openRouterModelId?.message ||
								t('guides.acousticModels.fields.model')
							}
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
								formState.errors.openRouterModelId?.message ? 'text-error' : '',
							)}
							placeholder={t('guides.acousticModels.placeholders.model')}
							buttonClassName="h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px] rounded-[8px]"
							wrapperClassname="w-[226px] shadow-none ring-input-border-primary"
						/>
					)}
				/>
			)}
			<Input
				{...register('coefficient')}
				labelClassName={twMerge(
					'font-sans text-sm font-normal leading-5 tracking-[0.1px] text-input-label-primary',
					formState.errors.coefficient?.message ? 'text-error' : '',
				)}
				inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
				containerClassName="w-[226px]"
				type="number"
				step="any"
				label={
					formState.errors?.coefficient?.message ||
					t('guides.acousticModels.fields.coefficient')
				}
				placeholder={t('guides.acousticModels.placeholders.coefficient')}
			/>
		</>
	);
};
