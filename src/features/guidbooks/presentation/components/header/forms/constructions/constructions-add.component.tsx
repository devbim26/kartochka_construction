import { convertToPaginatedType, convertToSelectValues, Input, Select, Switch } from '@core';
import type { ConstructionsAddData, ConstructionTypeTemplate, Issuer } from '@features';
import {
	convertToClientConstructionTypesList,
	convertToClientIssuerData,
	FormSubTitle,
	getGuidebooksConstructionTypes,
	getGuidebooksPaginated,
	Guidebooks,
	RuPriorityNamesSelectValues,
	RuRegionNamesSelectValues,
} from '@features';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoMdWarning } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { HeavySingleWallComponent } from './contruction-type';

export const ConstructionsAdd = () => {
	const [search] = useSearchParams();
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, watch } = form;
	const [displayChars, setDisplayChars] = useState(false);
	const [constructionTypes, setConstructionTypes] = useState<ConstructionTypeTemplate[]>([]);
	const [issuers, setIssuers] = useState<Issuer[]>([]);
	const currentConstruction = watch('constructionType');

	const handleGetMaterialTypeData = useCallback(async () => {
		try {
			const response = await getGuidebooksConstructionTypes();
			const items = convertToClientConstructionTypesList(response.data as any);
			setConstructionTypes(items);
		} catch (error) {
			console.log('Error:', error);
		}
	}, []);

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

	useEffect(() => {
		handleGetIssuerData();
		handleGetMaterialTypeData();
	}, []);

	return (
		<div className="flex w-full flex-col gap-[16px] px-[25px]">
			<Switch
				onText="Характеристики"
				offText="Описание"
				textClassName="font-sans text-[17px] font-normal leading-5 tracking-[0.1px]"
				offIcon={<IoMdWarning />}
				onIcon={<IoMdWarning />}
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
								formState.errors.descriptionSource?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.descriptionSource?.message || 'Источник'}
							error={formState.errors.descriptionSource?.message}
							placeholder="Введите источник"
							{...form.register('descriptionSource')}
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
							{...form.register('fireResistance')}
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
							{...form.register('propertySource')}
							type={'text'}
						/>
					</div>
					<FormSubTitle text="Лабораторные тесты" />
					<div className="flex flex-wrap gap-[16px]">
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.labRTotal?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[468px]"
							label={formState.errors.labRTotal?.message || 'R_total'}
							error={formState.errors.labRTotal?.message}
							placeholder="Введите через запятую"
							{...form.register('labRTotal')}
							type={'text'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.labIndex?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.labIndex?.message || 'Индекс'}
							error={formState.errors.labIndex?.message}
							placeholder="Введите индекс"
							{...form.register('labIndex')}
							type={'number'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.labIndexValue?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.labIndexValue?.message || 'Index value, dBA'}
							error={formState.errors.labIndexValue?.message}
							placeholder="Введите индекс"
							{...form.register('labIndexValue')}
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
							{...form.register('propertySource')}
							type={'text'}
						/>
					</div>
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
								value={field.value || ''}
								options={constructionTypes.map((data) => ({
									label: data.name ?? '',
									value: data.constructionTypeTemplateId ?? '',
								}))}
								error={formState.errors.constructionType?.message}
								labelClassName={twMerge(
									'text-sm leading-5 tracking-[0.1px]',
									formState.errors.constructionType?.message ? 'text-error' : '',
								)}
								wrapperClassname="w-fit min-w-[226px] ring-input-border-primary"
								buttonClassName="text-sm rounded-[8px]"
								label={formState.errors.constructionType?.message || ''}
								placeholder="Выберите тип"
							/>
						)}
					/>
					<HeavySingleWallComponent />
				</>
			)}
		</div>
	);
};
