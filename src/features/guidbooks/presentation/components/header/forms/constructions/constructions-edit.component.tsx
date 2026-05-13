import {
	CheckboxSelect,
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	Switch,
	useI18n,
} from '@core';
import {
	ConstructionsEditFieldNames,
	ConstructionTypeFieldNames,
	ConstructionTypeMap,
	EnConstructionPurposeSelectValues,
	RuConstructionPurposeSelectValues,
} from '@features/guidbooks/constants';
import { convertToClientIssuerData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	EnConstructionTypesSelectValues,
	Guidebooks,
	RuConstructionTypesSelectValues,
	RuCountryNamesSelectValues,
	RuPriorityNamesSelectValues,
	type ConstructionsEditData,
	type ConstructionTypeEnum,
	type Issuer,
	isFloorConstructionType,
	isZPanelGuidebookConstructionType,
} from '@features/guidbooks/types';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoMdWarning } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../../form-sub-title.component';
import { ConstructionLaboratoryDataFields } from './constructions-laboratory-data-fields.component';

export const ConstructionsEdit = () => {
	const form = useFormContext<ConstructionsEditData>();
	const { t, locale } = useI18n();
	const constructionTypeOptions =
		locale === 'en' ? EnConstructionTypesSelectValues : RuConstructionTypesSelectValues;
	const { formState, control, watch, setValue, register } = form;

	const issuerErrorMessage = formState.errors.issuer?.message;
	const issuerLabel =
		issuerErrorMessage === 'guides.constructions.zPanelRequiresBrandIssuer'
			? t('guides.constructions.zPanelRequiresBrandIssuer')
			: issuerErrorMessage || 'Производитель';
	const [displayChars, setDisplayChars] = useState(false);
	const [issuers, setIssuers] = useState<Issuer[]>([]);
	const currentConstruction = watch('constructionTypeObject.constructionTypeEnum');
	const constructionTypeField = watch('constructionType');
	const showImpactLaboratory = isFloorConstructionType(constructionTypeField);
	const showZPanelGuidebookHint =
		!displayChars &&
		isZPanelGuidebookConstructionType(constructionTypeField || currentConstruction);

	const handleGetIssuerData = useCallback(async () => {
		try {
			const response = await getGuidebooksPaginated({
				data: {
					name: null,
					country: null,
					logoUrl: null,
					webSite: null,
				},
				pagination: {
					pageSize: 999999,
					pageNumber: 1,
				},
				guidebookType: Guidebooks.ISSUER,
			});
			const items = convertToPaginatedType(convertToClientIssuerData)(response.data as any);
			setIssuers(items.items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

	useEffect(() => {
		handleGetIssuerData();
	}, []);

	return (
		<div className="flex w-full flex-col gap-[16px] px-[25px]">
			<Switch
				onText="Характеристики"
				offText="Описание"
				textClassName="font-sans text-[17px] font-normal leading-5 tracking-[0.1px]"
				offIcon={
					Object.keys(formState.errors).some((key) =>
						ConstructionsEditFieldNames.includes(key),
					) && <IoMdWarning />
				}
				onIcon={
					!Object.keys(formState.errors).some((key) =>
						ConstructionTypeFieldNames.includes(key),
					) &&
					!!Object.keys(formState.errors).length && <IoMdWarning />
				}
				wrapperClassName="h-[30px] w-[400px] self-center p-[3px] bg-primary"
				onChange={() => setDisplayChars(!displayChars)}
			/>
			{!displayChars ? (
				<>
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
							disabled
							{...register('name')}
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
							{...register('description')}
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
									isSearchable
								/>
							)}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.descriptionSource?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.descriptionSource?.message || 'Источник'}
							error={formState.errors.descriptionSource?.message}
							placeholder="Введите источник"
							{...register('descriptionSource')}
							type={'text'}
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
												formState.errors.country?.message
													? 'ring-error'
													: '',
											),
											labelClassName: twMerge(
												formState.errors.country?.message
													? 'text-error'
													: '',
											),
										},
									}}
									label={formState.errors.country?.message || 'Страна'}
									placeholder="Выберите страну"
								/>
							)}
						/>
						<Controller
							name="constructionPurpose"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									isSearchable
									value={field.value || ''}
									options={
										locale === 'en'
											? EnConstructionPurposeSelectValues
											: RuConstructionPurposeSelectValues
									}
									error={formState.errors.constructionPurpose?.message}
									labelClassName={twMerge(
										'text-sm leading-5 tracking-[0.1px]',
										formState.errors.constructionPurpose?.message ? 'text-error' : '',
									)}
									wrapperClassname="w-[226px] ring-input-border-primary"
									buttonClassName="text-sm rounded-[8px]"
									label={
										formState.errors.constructionPurpose?.message ||
										'Назначение конструкции'
									}
									placeholder="Выберите назначение"
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
									error={issuerErrorMessage}
									labelClassName={twMerge(
										'text-sm leading-5 tracking-[0.1px]',
										issuerErrorMessage ? 'text-error' : '',
									)}
									wrapperClassname="w-[226px] ring-input-border-primary"
									buttonClassName="text-sm rounded-[8px]"
									label={issuerLabel}
									placeholder="Выберите производителя"
									isSearchable
									onChange={(value: string) => {
										field.onChange(value);
										const selected = issuers.find((i) => i.id === value);
										setValue('issuerName', selected?.name ?? '', {
											shouldValidate: true,
										});
									}}
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
							{...register('maxHeight')}
							type={'number'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.RCalcs?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.RCalcs?.message || 'Звукоизоляция Rw, дБ'}
							error={formState.errors.RCalcs?.message}
							placeholder="Введите Rw"
							{...register('RCalcs')}
							type={'text'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.estimatedIndexValue?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={
								formState.errors.estimatedIndexValue?.message ||
								'Расчётный индекс изоляции'
							}
							error={formState.errors.estimatedIndexValue?.message}
							placeholder="Введите значение"
							{...register('estimatedIndexValue')}
							type={'text'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.fireResistance?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={
								formState.errors.fireResistance?.message ||
								'Класс огнестойкости, EI'
							}
							error={formState.errors.fireResistance?.message}
							placeholder="Введите класс"
							{...register('fireResistance')}
							type={'number'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.propertySource?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.propertySource?.message || 'Источник'}
							error={formState.errors.propertySource?.message}
							placeholder="Введите источник"
							{...register('propertySource')}
							type={'text'}
						/>
					</div>
					<FormSubTitle text="Лабораторные данные" />
					<ConstructionLaboratoryDataFields
						readOnly
						namePrefix="airLaboratory"
						title={showImpactLaboratory ? 'Воздушный шум' : undefined}
					/>
					{showImpactLaboratory ? (
						<ConstructionLaboratoryDataFields readOnly namePrefix="impactLaboratory" title="Ударный шум" />
					) : null}
				</>
			) : (
				<>
					<FormSubTitle text="Тип конструкции" />
					<Controller
						name="constructionType"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								isSearchable
								value={field.value || ''}
								onChange={(value) => {
									setValue('constructionType', value as string);
									value &&
										ConstructionTypeMap({
											currentConstruction: value as ConstructionTypeEnum,
											currentForm: form,
										}).action();
								}}
								options={constructionTypeOptions}
								error={formState.errors.constructionType?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px]',
									formState.errors.constructionType?.message ? 'text-error' : '',
								)}
								wrapperClassname="w-fit min-w-[468px] ring-input-border-primary"
								buttonClassName="text-sm rounded-[8px]"
								label={formState.errors.constructionType?.message || ''}
								placeholder="Выберите тип"
							/>
						)}
					/>
					{showZPanelGuidebookHint && (
						<p className="max-w-[720px] font-sans text-sm leading-5 text-gray-600">
							{t('guides.constructions.zPanelGuidebookHint')}
						</p>
					)}
					{currentConstruction ? (
						ConstructionTypeMap({
							currentConstruction: currentConstruction as ConstructionTypeEnum,
							currentForm: form,
						}).component
					) : (
						<></>
					)}
				</>
			)}
		</div>
	);
};
