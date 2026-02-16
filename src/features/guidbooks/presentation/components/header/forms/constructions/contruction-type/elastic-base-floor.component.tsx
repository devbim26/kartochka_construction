import { DeleteIcon } from '@core';
import {
	AcousticTreatmentMaterialsType,
	ConstructionLayer,
	HeavyMaterialType,
	ThicknessDensityFieldsType,
} from '@features';
import { ConstructionFieldsMap } from '@features/guidbooks/constants';
import type { ConstructionTypeProps, MaterialTypeEnum } from '@features/guidbooks/types';
import { MaterialTypesSelectValuesEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { Fragment } from 'react/jsx-runtime';

export const ElasticBaseFloorComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;

	const { fields, append, remove } = useConstructionMaterials(control, watch, 'Center');

	const renderAddButton = (positionId: string) => (
		<AiOutlinePlusCircle
			key={`add-${positionId}`}
			onClick={() =>
				append({
					positionId,
					materialId: '',
					materialType: '',
					materialTypeValue: [],
				})
			}
			className="size-[40px] self-center text-primary"
		/>
	);

	const getSelectValuesForPosition = (positionId: string) => {
		if (positionId === '2') {
			return MaterialTypesSelectValuesEnum.Soundproofing;
		}
		return MaterialTypesSelectValuesEnum.Base;
	};

	const renderMaterialBlock = (positionId: string, fieldIndex: number, fieldId: string) => {
		const field = fields[fieldIndex];
		const isAcousticPosition = positionId === '2';
		const isHeavyPosition = positionId === '1' || positionId === '3';

		return (
			<div key={fieldId} className="flex w-full items-start justify-between">
				<div className="flex flex-1 gap-[20px]">
					{isAcousticPosition && (
						<>
							<AcousticTreatmentMaterialsType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
							{/* <ThicknessDensityFieldsType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/> */}
						</>
					)}

					{isHeavyPosition && !isAcousticPosition ? (
						<>
							<HeavyMaterialType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
							<ThicknessDensityFieldsType
								{...{ fieldIndex, constructionPosition: 'Center', currentForm }}
							/>
						</>
					) : (
						<div className="flex gap-[8px]">
							{ConstructionFieldsMap({
								fieldIndex,
								constructionPosition: 'Center',
								materialType: (field as any)?.materialType as MaterialTypeEnum,
								currentForm,
							})}
						</div>
					)}
				</div>

				{!isHeavyPosition && !isAcousticPosition && (
					<DeleteIcon
						className="shrink-0 self-start"
						onClick={() => remove(fieldIndex)}
					/>
				)}
			</div>
		);
	};

	const positions = ['0', '1', '2', '3', '4', '5', '6'];

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			<div className="flex flex-col gap-[24px]">
				{fields.length === 0 && renderAddButton('0')}

				{positions.map((positionId, index) => {
					const fieldIndex = fields.findIndex((f: any) => f.positionId === positionId);
					const field = fields[fieldIndex];

					let showAddButton = false;

					if (fieldIndex === -1) {
						switch (positionId) {
							case '1':
								showAddButton = fields.some((f: any) => f.positionId === '2');
								break;
							case '3':
								showAddButton = fields.some((f: any) => f.positionId === '2');
								break;
							case '0':
								showAddButton = fields.some((f: any) => f.positionId === '1');
								break;
							case '4':
								showAddButton = fields.some((f: any) => f.positionId === '3');
								break;
							case '5':
								showAddButton = fields.some((f: any) => f.positionId === '4');
								break;
							case '6':
								showAddButton = fields.some((f: any) => f.positionId === '5');
								break;
						}
					}

					if (showAddButton) {
						return renderAddButton(positionId);
					}

					if (fieldIndex !== -1) {
						return (
							<Fragment key={field.id}>
								{renderMaterialBlock(positionId, fieldIndex, field.id)}
							</Fragment>
						);
					}

					return null;
				})}
			</div>
		</ConstructionLayer>
	);
};
