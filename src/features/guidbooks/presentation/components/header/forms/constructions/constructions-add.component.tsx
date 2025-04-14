import { ConstructionPosition, MaterialParametrs } from '@api-gen';
import {
	CheckboxSelect,
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	Switch,
} from '@core';
import {
	ConstructionsAddFieldNames,
	ConstructionTypeFieldNames,
} from '@features/guidbooks/constants';
import { convertToClientIssuerData } from '@features/guidbooks/converters';
import { getGuidebooksPaginated } from '@features/guidbooks/services';
import {
	ConstructionTypeEnum,
	Guidebooks,
	MaterialTypeEnum,
	RuConstructionTypesSelectValues,
	RuCountryNamesSelectValues,
	RuIndexTypeNamesSelectValues,
	RuPriorityNamesSelectValues,
	type ConstructionsAddData,
	type Issuer,
} from '@features/guidbooks/types';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoMdWarning } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';
import { FormSubTitle } from '../../../form-sub-title.component';
import {
	FramePartitionDouble,
	FramePartitionSingle,
	HeavyMultiLayerWallComponent,
	HeavyMultiLayerWallFacingBothSideComponent,
	HeavyMultiLayerWallFacingOneSideComponent,
	HeavyMultiLayerWallSoundproofBothSide,
	HeavyMultiLayerWallSoundproofingLeftSide,
	HeavyMultiLayerWallSoundproofOneSide,
	HeavySingleLayerWallComponent,
	HeavySingleLayerWallFacingBothSideComponent,
	HeavySingleLayerWallFacingOneSideComponent,
	HeavySingleLayerWallSoundproofingBothSideComponent,
	HeavySingleLayerWallSoundproofingOneSideComponent,
} from './contruction-type';

export const ConstructionsAdd = () => {
	const form = useFormContext<ConstructionsAddData>();
	const { formState, control, watch, setValue, register, trigger } = form;
	const [displayChars, setDisplayChars] = useState(false);
	const [issuers, setIssuers] = useState<Issuer[]>([]);
	const currentConstruction = watch('constructionType');

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

	const ConstructionTypeMap = {
		[ConstructionTypeEnum.HeavySingleLayerWall]: {
			component: <HeavySingleLayerWallComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWall,
				);
				setValue('constructionTypeObject.constructions', [
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
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide]: {
			component: <HeavySingleLayerWallFacingOneSideComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
				);
				setValue('constructionTypeObject.constructions', [
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
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.AirGap,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Frame,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Board,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide]: {
			component: <HeavySingleLayerWallFacingBothSideComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.AirGap,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Frame,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Board,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
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
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Right,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.AirGap,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Frame,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Board,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide]: {
			component: <HeavySingleLayerWallSoundproofingOneSideComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide,
				);
				setValue('constructionTypeObject.constructions', [
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
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.ZPanel,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Board,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide]: {
			component: <HeavySingleLayerWallSoundproofingBothSideComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.ZPanel,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Board,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
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
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Right,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.ZPanel,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Board,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavyMultiLayerWall]: {
			component: <HeavyMultiLayerWallComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWall,
				);
				setValue('constructionTypeObject.constructions', [
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
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide]: {
			component: <HeavyMultiLayerWallFacingOneSideComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide,
				);
				setValue('constructionTypeObject.constructions', [
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
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.AirGap,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Frame,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Board,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide]: {
			component: <HeavyMultiLayerWallFacingBothSideComponent />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.AirGap,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Frame,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Board,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '1',
								value: MaterialTypeEnum.Heavy,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Heavy,
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Right,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
						userMaterialTypes: [
							{
								positionId: '0',
								value: MaterialTypeEnum.AirGap,
							},
							{
								positionId: '1',
								value: MaterialTypeEnum.Link,
							},
							{
								positionId: '2',
								value: MaterialTypeEnum.Frame,
							},
							{
								positionId: '3',
								value: MaterialTypeEnum.Filler,
							},
							{
								positionId: '4',
								value: MaterialTypeEnum.Board,
							},
						],
					},
				]);
			},
		},
		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofOneSide]: {
			component: <HeavyMultiLayerWallSoundproofOneSide />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofOneSide,
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
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
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
		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofBothSide]: {
			component: <HeavyMultiLayerWallSoundproofBothSide />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofBothSide,
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
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
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
					{
						contructionPosition: ConstructionPosition.Right,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
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
		[ConstructionTypeEnum.FramePartitionSingle]: {
			component: <FramePartitionSingle />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.FramePartitionSingle,
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
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '4',
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
		[ConstructionTypeEnum.FramePartitionDouble]: {
			component: <FramePartitionDouble />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.FramePartitionDouble,
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
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '5',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '6',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '7',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '8',
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
		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingLeftSide]: {
			component: <HeavyMultiLayerWallSoundproofingLeftSide />,
			action: () => {
				form.setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingLeftSide,
				);
				form.setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '1',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialTypeValue: [
									{
										materialParameters: MaterialParametrs.ConnectionNumber,
										value: '',
									},
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '0',
								materialId: '',
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
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
		<div className="flex w-full flex-col gap-[16px] px-[25px]">
			<Switch
				onText="Характеристики"
				offText="Описание"
				textClassName="font-sans text-[17px] font-normal leading-5 tracking-[0.1px]"
				offIcon={
					Object.keys(formState.errors).some((key) =>
						ConstructionsAddFieldNames.includes(key),
					) && <IoMdWarning />
				}
				onIcon={
					Object.keys(formState.errors).some((key) =>
						ConstructionTypeFieldNames.includes(key),
					) && <IoMdWarning />
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
							{...register('name')}
							disabled
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
									isSearchable
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
							name="issuer"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									isSearchable
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
							{...register('maxHeight')}
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
							{...register('labRTotal')}
							type={'text'}
						/>
						<Controller
							name="labIndex"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									isSearchable
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
							{...register('labIndexValue')}
							type={'number'}
						/>
						<Input
							labelClassName={twMerge(
								'font-sans text-sm font-normal leading-5 tracking-[0.1px]',
								formState.errors.laboratoryTestSource?.message ? 'text-error' : '',
							)}
							inputClassName="py-[6px] px-[12px] h-fit font-sans text-sm font-normal leading-5 tracking-[0.1px]"
							containerClassName="w-[226px]"
							label={formState.errors.laboratoryTestSource?.message || 'Источник'}
							error={formState.errors.laboratoryTestSource?.message}
							placeholder="Введите источник"
							{...register('laboratoryTestSource')}
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
								isSearchable
								value={field.value || ''}
								onChange={(value) => {
									setValue('constructionType', value as string);
									if (value)
										ConstructionTypeMap[value as ConstructionTypeEnum].action();
									trigger('constructionType');
								}}
								options={RuConstructionTypesSelectValues}
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
					{currentConstruction ? (
						ConstructionTypeMap[currentConstruction as ConstructionTypeEnum].component
					) : (
						<></>
					)}
				</>
			)}
		</div>
	);
};
