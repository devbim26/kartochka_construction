import { MaterialParametrs } from '@api-gen';
import {
	ElasticBaseFloorComponent,
	FramePartitionDoubleComponent,
	FramePartitionSingleComponent,
	HeavyMultiLayerWallComponent,
	HeavyMultiLayerWallFacingBothSideComponent,
	HeavyMultiLayerWallFacingOneSideComponent,
	DoorConstructionComponent,
	HeavySingleLayerWallComponent,
	HeavySingleLayerWallFacingBothSideComponent,
	HeavySingleLayerWallFacingOneSideComponent,
	HomogeniusFloorComponent,
	OneGlassFrameComponent,
	TwoGlassFrameComponent,
	ZPanelWallComponent,
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

	const applyZPanelWallFormDefaults = (enumValue: ConstructionTypeEnum) => {
		setValue('constructionTypeObject.constructionTypeEnum', enumValue);
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
		setValue('constructionTypeObject.leftConstruction', []);
		setValue('constructionTypeObject.rightConstruction', []);
	};

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

				setValue('constructionTypeObject.centerConstruction', [
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

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.DoubleGlazedFrame]: {
			component: <TwoGlassFrameComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.DoubleGlazedFrame,
				);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Glazing,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
					{
						positionId: '3',
						materialId: '',
						materialType: MaterialTypeEnum.AirGap,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
					{
						positionId: '4',
						materialId: '',
						materialType: MaterialTypeEnum.Glazing,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HomogeneousFloor]: {
			component: <HomogeniusFloorComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HomogeneousFloor,
				);

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

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},
		[ConstructionTypeEnum.ElasticBaseFloor]: {
			component: <ElasticBaseFloorComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.ElasticBaseFloor,
				);

				setValue('constructionTypeObject.centerConstruction', [
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
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},
		[ConstructionTypeEnum.HeavySingleWallFacing]: {
			component: <></>,
			action: () => {},
		},

		[ConstructionTypeEnum.Door]: {
			component: <DoorConstructionComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.Door,
				);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '2',
						materialId: '',
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavySingleLayerWall]: {
			component: <HeavySingleLayerWallComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavySingleLayerWall,
				);

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

				setValue('constructionTypeObject.leftConstruction', []);
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
						positionId: '3',
						materialId: '',
						materialType: MaterialTypeEnum.Link,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
						positionId: '3',
						materialId: '',
						materialType: MaterialTypeEnum.Link,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.ConnectionNumber, value: '' },
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
			component: <ZPanelWallComponent currentForm={currentForm} />,
			action: () =>
				applyZPanelWallFormDefaults(
					ConstructionTypeEnum.HeavySingleLayerWallSoundproofingOneSide,
				),
		},
		[ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide]: {
			component: <ZPanelWallComponent currentForm={currentForm} />,
			action: () =>
				applyZPanelWallFormDefaults(
					ConstructionTypeEnum.HeavySingleLayerWallSoundproofingBothSide,
				),
		},

		[ConstructionTypeEnum.ZPanel]: {
			component: <ZPanelWallComponent currentForm={currentForm} />,
			action: () => applyZPanelWallFormDefaults(ConstructionTypeEnum.ZPanel),
		},

		[ConstructionTypeEnum.HeavyMultiLayerWall]: {
			component: <HeavyMultiLayerWallComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWall,
				);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '1',
						materialId: '',
						materialType: MaterialTypeEnum.Plaster,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
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
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
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
					{
						positionId: '5',
						materialId: '',
						materialType: MaterialTypeEnum.Plaster,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
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
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
							{ materialParameters: MaterialParametrs.ConnectionType, value: '' },
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
			component: <HeavyMultiLayerWallComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingOneSide,
				);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '1',
						materialId: '',
						materialType: MaterialTypeEnum.Plaster,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
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
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
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
					{
						positionId: '5',
						materialId: '',
						materialType: MaterialTypeEnum.Plaster,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide]: {
			component: <HeavyMultiLayerWallComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.HeavyMultiLayerWallSoundproofingBothSide,
				);

				setValue('constructionTypeObject.centerConstruction', [
					{
						positionId: '1',
						materialId: '',
						materialType: MaterialTypeEnum.Plaster,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
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
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
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
					{
						positionId: '5',
						materialId: '',
						materialType: MaterialTypeEnum.Plaster,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},

		[ConstructionTypeEnum.OneFramePartition]: {
			component: <FramePartitionSingleComponent currentForm={currentForm} />,
			action: () => {
				setValue(
					'constructionTypeObject.constructionTypeEnum',
					ConstructionTypeEnum.OneFramePartition,
				);

				setValue('constructionTypeObject.centerConstruction', [
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
						positionId: '6',
						materialId: '',
						materialType: MaterialTypeEnum.Board,
						materialTypeValue: [
							{ materialParameters: MaterialParametrs.Thickness, value: '' },
							{ materialParameters: MaterialParametrs.Density, value: '' },
						],
					},
				]);

				setValue('constructionTypeObject.leftConstruction', []);
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

				setValue('constructionTypeObject.centerConstruction', [
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
				]);

				setValue('constructionTypeObject.leftConstruction', []);
				setValue('constructionTypeObject.rightConstruction', []);
			},
		},
	};

	return typeMap[currentConstruction];
};
