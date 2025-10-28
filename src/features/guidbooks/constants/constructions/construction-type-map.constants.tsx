import { ConstructionPosition, MaterialParametrs } from '@api-gen';
import {
	FramePartitionDoubleComponent,
	FramePartitionSingleComponent,
	HeavyMultiLayerWallComponent,
	HeavyMultiLayerWallFacingBothSideComponent,
	HeavyMultiLayerWallFacingOneSideComponent,
	HeavyMultiLayerWallSoundproofBothSideComponent,
	HeavyMultiLayerWallSoundproofingOneSideComponent,
	HeavySingleLayerWallComponent,
	HeavySingleLayerWallFacingBothSideComponent,
	HeavySingleLayerWallFacingOneSideComponent,
	HeavySingleLayerWallSoundproofingBothSideComponent,
	HeavySingleLayerWallSoundproofingOneSideComponent,
	OneGlassFrameComponent,
	TwoGlassFrameComponent,
} from '@features';
import { ConstructionTypeEnum, MaterialTypeEnum } from '@features/guidbooks/types';
import type { JSX } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface ConstructionTypeMapProps {
	currentConstruction: ConstructionTypeEnum;
	currentForm: UseFormReturn<any>;
}

export const ConstructionTypeMap = ({
	currentConstruction,
	currentForm,
}: ConstructionTypeMapProps) => {
	const { setValue } = currentForm;

	const typeMap: Record<
		ConstructionTypeEnum,
		{
			component: JSX.Element;
			action: () => void;
		}
	> = {
		//TODO
		[ConstructionTypeEnum.OneGlassFrame]: {
			component: <OneGlassFrameComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.OneGlassFrame,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Glazing,
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
		[ConstructionTypeEnum.TwoGlassFrame]: {
			component: <TwoGlassFrameComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.TwoGlassFrame,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Glazing,
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
		[ConstructionTypeEnum.Floor]: {
			component: <></>,
			action: () => {},
		},
		[ConstructionTypeEnum.HeavySingleWallFacing]: {
			component: <></>,
			action: () => {},
		},
		[ConstructionTypeEnum.HeavySingleLayerWall]: {
			component: <HeavySingleLayerWallComponent currentForm={currentForm} />,
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
								positionId: '2',
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
			component: <HeavySingleLayerWallFacingOneSideComponent currentForm={currentForm} />,
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
								positionId: '2',
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
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
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
			component: <HeavySingleLayerWallFacingBothSideComponent currentForm={currentForm} />,
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
								positionId: '4',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '1',
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
								positionId: '0',
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
								positionId: '2',
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
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
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
			component: (
				<HeavySingleLayerWallSoundproofingOneSideComponent currentForm={currentForm} />
			),
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
								positionId: '2',
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
			component: (
				<HeavySingleLayerWallSoundproofingBothSideComponent currentForm={currentForm} />
			),
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
								positionId: '2',
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
			component: <HeavyMultiLayerWallComponent currentForm={currentForm} />,
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
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
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
								positionId: '5',
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
			component: <HeavyMultiLayerWallFacingOneSideComponent currentForm={currentForm} />,
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
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
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
								positionId: '5',
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
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
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
			component: <HeavyMultiLayerWallFacingBothSideComponent currentForm={currentForm} />,
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
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
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
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
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
								positionId: '5',
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
								materialType: MaterialTypeEnum.Link,
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
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
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
		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide]: {
			component: (
				<HeavyMultiLayerWallSoundproofingOneSideComponent currentForm={currentForm} />
			),
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
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
								positionId: '5',
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
		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide]: {
			component: <HeavyMultiLayerWallSoundproofBothSideComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide,
				);
				setValue('constructionTypeObject.constructions', [
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
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Heavy,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
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
								positionId: '5',
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
			component: <FramePartitionSingleComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.FramePartitionSingle,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '5',
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
			component: <FramePartitionDoubleComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.FramePartitionDouble,
				);
				setValue('constructionTypeObject.constructions', [
					{
						contructionPosition: ConstructionPosition.Left,
						userMaterials: [
							{
								positionId: '2',
								materialId: '',
								materialType: MaterialTypeEnum.Board,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '3',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '4',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '5',
								materialId: '',
								materialType: MaterialTypeEnum.AirGap,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Thickness, value: '' },
									{ materialParameters: MaterialParametrs.Density, value: '' },
								],
							},
							{
								positionId: '6',
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
								positionId: '7',
								materialId: '',
								materialType: MaterialTypeEnum.Frame,
								materialTypeValue: [
									{ materialParameters: MaterialParametrs.Width, value: '' },
									{ materialParameters: MaterialParametrs.RackStep, value: '' },
								],
							},
							{
								positionId: '8',
								materialId: '',
								materialType: MaterialTypeEnum.Filler,
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

	return typeMap[currentConstruction];
};
