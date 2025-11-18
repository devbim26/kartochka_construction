import { MaterialParametrs } from '@api-gen';
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

				setValue('constructionTypeObject.leftConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Glazing,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.TwoGlassFrame]: {
			component: <TwoGlassFrameComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.TwoGlassFrame,
				);

				setValue('constructionTypeObject.leftConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Glazing,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
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

				setValue('constructionTypeObject.leftConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Heavy,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide]: {
			component: <HeavySingleLayerWallFacingOneSideComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWallFacingOneSide,
				);

				setValue('constructionTypeObject.leftConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Heavy,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide]: {
			component: <HeavySingleLayerWallFacingBothSideComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWallFacingBothSide,
				);

				setValue('constructionTypeObject.leftConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Heavy,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.rightConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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

				setValue('constructionTypeObject.leftConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Heavy,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', [
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
				]);

				setValue('constructionTypeObject.rightConstruction', []);
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

				setValue('constructionTypeObject.leftConstruction', [
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
				]);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Heavy,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.rightConstruction', [
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

				setValue('constructionTypeObject.leftConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.centerConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide]: {
			component: <HeavyMultiLayerWallFacingOneSideComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallFacingOneSide,
				);

				setValue('constructionTypeObject.leftConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.centerConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide]: {
			component: <HeavyMultiLayerWallFacingBothSideComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallFacingBothSide,
				);

				// Left
				setValue('constructionTypeObject.leftConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				// Center
				setValue('constructionTypeObject.centerConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				// Right
				setValue('constructionTypeObject.rightConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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

				setValue('constructionTypeObject.leftConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.centerConstruction', [
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
				]);

				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide]: {
			component: <HeavyMultiLayerWallSoundproofBothSideComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide,
				);

				setValue('constructionTypeObject.leftConstruction', [
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
				]);

				setValue('constructionTypeObject.centerConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
				]);

				setValue('constructionTypeObject.rightConstruction', [
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
				]);
			},
		},

		[ConstructionTypeEnum.OneFramePartition]: {
			component: <FramePartitionSingleComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.OneFramePartition,
				);

				setValue('constructionTypeObject.leftConstruction', [
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
						materialType: MaterialTypeEnum.GapDistance,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
						],
					},
					{
						positionId: '6',
						materialId: '',
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},
		[ConstructionTypeEnum.TwoFramePartition]: {
			component: <FramePartitionDoubleComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.TwoFramePartition,
				);

				setValue('constructionTypeObject.leftConstruction', [
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
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
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
					{
						positionId: '9',
						materialId: '',
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.centerConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},
	};

	return typeMap[currentConstruction];
};
