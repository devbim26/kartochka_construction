import { MaterialParametrs } from '@api-gen';
import {
	BoardMaterialType,
	ConstructionLayer,
	FillerMaterialType,
	HeavyMaterialType,
	ThicknessDensityFieldsType,
} from '@features';
import type { ConstructionTypeProps } from '@features/guidbooks/types';
import { ConstructionTypeEnum, MaterialTypeEnum } from '@features/guidbooks/types';

import { useConstructionMaterials } from '@features/guidbooks/utils';
import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

const ELASTIC_FLOOR_POSITIONS = ['1', '2', '3'] as const;

const elasticFloorDefaultRows = () => [
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
];

export const ElasticBaseFloorComponent = ({ currentForm }: ConstructionTypeProps) => {
	const { control, watch } = currentForm;
	const { fields, replace } = useConstructionMaterials(control, watch, 'Center');

	const enumValue = useWatch({
		control,
		name: 'constructionTypeObject.constructionTypeEnum',
	});
	const centerConstruction = useWatch({
		control,
		name: 'constructionTypeObject.centerConstruction',
	});

	useEffect(() => {
		if (enumValue !== ConstructionTypeEnum.ElasticBaseFloor) return;
		const list = (centerConstruction as any[]) || [];
		const byPos = new Map<string, any>(
			list.map((row: { positionId?: string }) => [String(row?.positionId), row]),
		);
		const row1 = byPos.get('1');
		const row2 = byPos.get('2');
		const row3 = byPos.get('3');
		const typeOk =
			String(row1?.materialType) === MaterialTypeEnum.Heavy &&
			String(row2?.materialType) === MaterialTypeEnum.Filler &&
			String(row3?.materialType) === MaterialTypeEnum.Board;
		if (list.length >= 3 && typeOk) return;

		replace(elasticFloorDefaultRows() as any);
	}, [enumValue, centerConstruction, replace]);

	const renderMaterialBlock = (positionId: string, fieldIndex: number, fieldId: string) => (
		<div key={fieldId} className="flex w-full items-start justify-between">
			<div className="flex flex-1 gap-[20px]">
				{positionId === '1' ? (
					<>
						<HeavyMaterialType
							fieldIndex={fieldIndex}
							constructionPosition="Center"
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={fieldIndex}
							constructionPosition="Center"
							currentForm={currentForm}
						/>
					</>
				) : positionId === '2' ? (
					<>
						<FillerMaterialType
							fieldIndex={fieldIndex}
							constructionPosition="Center"
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={fieldIndex}
							constructionPosition="Center"
							currentForm={currentForm}
						/>
					</>
				) : (
					<>
						<BoardMaterialType
							fieldIndex={fieldIndex}
							constructionPosition="Center"
							currentForm={currentForm}
						/>
						<ThicknessDensityFieldsType
							fieldIndex={fieldIndex}
							constructionPosition="Center"
							currentForm={currentForm}
						/>
					</>
				)}
			</div>
		</div>
	);

	return (
		<ConstructionLayer title="1. Базовая конструкция">
			<div className="flex flex-col gap-[24px]">
				{ELASTIC_FLOOR_POSITIONS.map((positionId) => {
					const fieldIndex = fields.findIndex((f: any) => String(f.positionId) === positionId);
					if (fieldIndex === -1) return null;
					const field = fields[fieldIndex];
					return renderMaterialBlock(positionId, fieldIndex, field.id);
				})}
			</div>
		</ConstructionLayer>
	);
};
