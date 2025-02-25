import { ConstructionPosition, MaterialParametrs } from '@api-gen';
import type { SelectOption } from '@core';
import { convertToPaginatedType, convertToSelectValues, Input, Select, Switch } from '@core';
import type { ConstructionsEditData, FilterIssuer } from '@features';
import {
	ConstructionTypeEnum,
	convertToClientIssuerData,
	convertToServerIssuerData,
	DescriptionFieldNames,
	FormSubTitle,
	getGuidebooksPaginated,
	Guidebooks,
	RuConstructionConstructionTypeSelectValues,
	RuIndexTypeNamesSelectValues,
	RuPriorityNamesSelectValues,
	RuRegionNamesSelectValues,
} from '@features';

import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoMdWarning } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';
import { catchError, from, switchMap, tap } from 'rxjs';
import { twMerge } from 'tailwind-merge';
import { HeavySingleWallComponent } from './contruction-type';

export const ConstructionsEdit = () => {
	const [search] = useSearchParams();
	const form = useFormContext<ConstructionsEditData>();

	const [isSpecsDisplay, setSpecsDisplay] = useState(false);

	const handleChangeDisplay = () => {
		setSpecsDisplay(!isSpecsDisplay);
	};

	useEffect(() => {
		handleGetIssuers({ name: '', country: '', webSite: '', logoUrl: '' });
	}, []);

	const [issuers, setIssuers] = useState<Array<SelectOption>>();

	const handleGetIssuers = (data: FilterIssuer) => {
		from(
			getGuidebooksPaginated({
				data: convertToServerIssuerData(data),
				pagination: { pageSize: 999999, pageNumber: 1 },
				guidebookType: Guidebooks.ISSUER,
			}),
		)
			.pipe(
				switchMap((response: AxiosResponse) => {
					const items = convertToPaginatedType(convertToClientIssuerData)(response.data);
					return from([items]);
				}),
				tap((items) => setIssuers(convertToSelectValues(items.items)!)),
				catchError((error) => {
					console.log('Error:', error);
					return from([null]);
				}),
			)
			.subscribe();
	};

	const { formState, control, watch } = form;

	const currentConstruction = watch('constructionType');

	const ConstructionTypeMap = {
		[ConstructionTypeEnum.HeavySingleLayerWall]: {
			component: <HeavySingleWallComponent />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWall,
				);
				form.setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide]: {
			component: <HeavySingleWallComponent />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWall,
				);
				form.setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide]: {
			component: <HeavySingleWallComponent />,
			action: () => {
				console.log(123);
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWall,
				);
				form.setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
					},
				]);
			},
		},
	};

	return (
		<div className="flex w-full flex-col gap-[16px]">
			<Switch
				onText="Характеристики"
				offText="Описание"
				textClassName="font-sans text-[17px] font-normal leading-5 tracking-[0.1px]"
				offIcon={
					Object.keys(formState.errors).some((key) =>
						DescriptionFieldNames.includes(key),
					) && <IoMdWarning />
				}
				onIcon={
					!Object.keys(formState.errors).some((key) =>
						DescriptionFieldNames.includes(key),
					) &&
					!!Object.keys(formState.errors).length && <IoMdWarning />
				}
				wrapperClassName="h-[30px] w-[400px] self-center p-[3px] bg-primary"
				onChange={handleChangeDisplay}
			/>
			{isSpecsDisplay ? (
				<>
					<FormSubTitle text="Тип конструкции" />
					<Controller
						name="constructionType"
						control={control}
						render={({ field }) => (
							<Select
								{...field}
								value={field.value || ''}
								onChange={(value) => {
									form.setValue('constructionType', value as string);
									if (value)
										ConstructionTypeMap[value as ConstructionTypeEnum].action();
								}}
								options={RuConstructionConstructionTypeSelectValues}
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
					{currentConstruction ? (
						ConstructionTypeMap[currentConstruction as ConstructionTypeEnum].component
					) : (
						<></>
					)}
				</>
			) : (
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
									options={issuers || []}
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
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.maxHeight?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={
								formState.errors.comment?.message || 'Примечание (не обязательно)'
							}
							error={formState.errors.comment?.message}
							placeholder="Примечание"
							{...form.register('maxHeight')}
							type={'text'}
							maxLength={100}
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
						<Controller
							name="labIndex"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									value={field.value || ''}
									options={RuIndexTypeNamesSelectValues}
									error={formState.errors.labIndex?.message}
									labelClassName={twMerge(
										'text-sm leading-5 tracking-[0.1px]',
										formState.errors.labIndex?.message ? 'text-error' : '',
									)}
									wrapperClassname="w-[226px] ring-input-border-primary"
									buttonClassName="text-sm rounded-[8px]"
									label={formState.errors.labIndex?.message || 'Индекс'}
									placeholder="Выберите индекс"
								/>
							)}
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
					</div>
					<FormSubTitle text="Расчетное значение" />
					<div className="flex flex-wrap gap-[16px]">
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.laboratoryTestSource?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.laboratoryTestSource?.message || 'R_calcs'}
							error={formState.errors.laboratoryTestSource?.message}
							placeholder="R_calc"
							{...form.register('estimatedRTotal')}
							type={'text'}
						/>
						<Controller
							name="labIndex"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									value={field.value || ''}
									options={RuIndexTypeNamesSelectValues}
									error={formState.errors.labIndex?.message}
									labelClassName={twMerge(
										'text-sm leading-5 tracking-[0.1px]',
										formState.errors.labIndex?.message ? 'text-error' : '',
									)}
									wrapperClassname="w-[226px] ring-input-border-primary"
									buttonClassName="text-sm rounded-[8px]"
									label={formState.errors.labIndex?.message || 'Индекс'}
									placeholder="Выберите индекс"
								/>
							)}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.estimatedIndexValue?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={
								formState.errors.estimatedIndexValue?.message || 'Index value, dBa'
							}
							error={formState.errors.estimatedIndexValue?.message}
							placeholder="Введите индекс"
							{...form.register('estimatedIndexValue')}
							type={'number'}
						/>
					</div>
				</>
			)}
		</div>
	);
};
