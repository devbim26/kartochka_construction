import { MULTI_LAYER_VERTICAL_CLADDING_POSITION_IDS } from '@features/guidbooks/constants';

import type { ConstructionTypeProps } from '@features/guidbooks/types';

import { MaterialTypeEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';

import { Fragment, type ComponentType } from 'react';

import { ThicknessDensityFieldsType } from '../construction-fields-types/thickness-density-fields-type.component';

import { PointConnectionsFieldsType } from '../construction-fields-types/point-connections-fields-type.component';

import { WidthRacksStepFieldsType } from '../construction-fields-types/width-racks-step-fields-type.component';

import { AirGapMaterialType } from '../construction-material-types/air-gap-material-type.component';

import { BoardMaterialType } from '../construction-material-types/board-material-type.component';

import { FillerMaterialType } from '../construction-material-types/filler-material-type.component';

import { FrameMaterialType } from '../construction-material-types/frame-material-type.component';

import { LinkMaterialType } from '../construction-material-types/link-material-type.component';

import { ConstructionLayer } from '../constructions-layer.component';



const materialTypeComponentMap: Record<string, ComponentType<any>[]> = {

	[MaterialTypeEnum.AirGap]: [AirGapMaterialType, ThicknessDensityFieldsType],

	[MaterialTypeEnum.Link]: [LinkMaterialType, PointConnectionsFieldsType],

	[MaterialTypeEnum.Frame]: [FrameMaterialType, WidthRacksStepFieldsType],

	[MaterialTypeEnum.Filler]: [FillerMaterialType, ThicknessDensityFieldsType],

	[MaterialTypeEnum.Board]: [BoardMaterialType, ThicknessDensityFieldsType],

};



export type VerticalFacingCladdingVariant = 'top' | 'bottom';



export type VerticalFacingCladdingSectionProps = ConstructionTypeProps & {

	constructionPosition: 'Left' | 'Right';

	variant: VerticalFacingCladdingVariant;

	title: string;

};



export const VerticalFacingCladdingSection = ({
	currentForm,
	constructionPosition,
	title,
}: VerticalFacingCladdingSectionProps) => {

	const { control, watch } = currentForm;

	const { fields } = useConstructionMaterials(control, watch, constructionPosition);



	return (

		<ConstructionLayer title={title}>

			<div className="flex flex-col gap-[24px]">

				{MULTI_LAYER_VERTICAL_CLADDING_POSITION_IDS.map((positionId) => {

					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);

					const field = fields[fieldIndex];

					if (fieldIndex === -1 || !field) {

						return null;

					}

					const materialType = (field as { materialType?: string }).materialType ?? '';

					const components = materialTypeComponentMap[materialType];

					if (!components?.length) {

						return null;

					}

					return (

						<Fragment key={field.id}>

							<div className="flex w-full items-start justify-between">

								<div className="flex flex-1 flex-wrap gap-[20px]">

									{components.map((Comp, i) => (

										<Comp

											key={i}

											fieldIndex={fieldIndex}

											constructionPosition={constructionPosition}

											currentForm={currentForm}

										/>

									))}

								</div>

							</div>

						</Fragment>

					);

				})}

			</div>

		</ConstructionLayer>

	);

};


