import { ConstructionPosition, MaterialParametrs } from '@api-gen';
import {
	CheckboxSelect,
	convertToPaginatedType,
	convertToSelectValues,
	Input,
	Select,
	Switch,
} from '@core';
import type { ConstructionsAddData, Issuer } from '@features';
import {
	ConstructionsAddFieldNames,
	ConstructionTypeEnum,
	ConstructionTypeFieldNames,
	convertToClientIssuerData,
	FormSubTitle,
	FramePartitionDoubleComponent,
	FramePartitionSingleComponent,
	getGuidebooksPaginated,
	Guidebooks,
	HeavyMultiLayerWallComponent,
	HeavyMultiLayerWallFacingBothSideComponent,
	HeavyMultiLayerWallFacingOneSideComponent,
	HeavyMultiLayerWallSoundproofBothSideComponent,
	HeavyMultiLayerWallSoundproofingLeftSideComponent,
	HeavyMultiLayerWallSoundproofingOneSideComponent,
	HeavySingleLayerWallComponent,
	HeavySingleLayerWallFacingBothSideComponent,
	HeavySingleLayerWallFacingOneSideComponent,
	HeavySingleLayerWallSoundproofingBothSideComponent,
	HeavySingleLayerWallSoundproofingOneSideComponent,
	MaterialTypeEnum,
	RuConstructionTypesSelectValues,
	RuCountryNamesSelectValues,
	RuIndexTypeNamesSelectValues,
	RuPriorityNamesSelectValues,
} from '@features';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IoMdWarning } from 'react-icons/io';
import { twMerge } from 'tailwind-merge';

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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Board,
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
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
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
								materialType: MaterialTypeEnum.AirGap,
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
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Board,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
						],
					},
					{
						contructionPosition: ConstructionPosition.Center,
						userMaterials: [
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
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
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Board,
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
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Board,
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
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Board,
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
		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofOneSide]: {
			component: <HeavyMultiLayerWallSoundproofingOneSideComponent />,
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
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
			component: <HeavyMultiLayerWallSoundproofBothSideComponent />,
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
								positionId: '0',
								materialId: '',
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Heavy,
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
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
			component: <FramePartitionSingleComponent />,
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
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
			component: <FramePartitionDoubleComponent />,
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
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '5',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '7',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '8',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
			component: <HeavyMultiLayerWallSoundproofingLeftSideComponent />,
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
								positionId: '0',
								materialId: '',
								materialType: MaterialTypeEnum.ZPanel,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
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
								positionId: '1',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Heavy,
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
